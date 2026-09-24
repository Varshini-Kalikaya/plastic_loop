const PickupRequest = require('../models/PickupRequest');
const PlasticType = require('../models/PlasticType');
const Collection = require('../models/Collection');
const RecyclingRecord = require('../models/RecyclingRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new pickup request
// @route   POST /api/pickups
// @access  Private (USER)
exports.createPickupRequest = async (req, res, next) => {
  try {
    const { plasticTypeId, estimatedWeight, address, preferredDate, preferredTimeSlot, description, images } = req.body;

    if (!plasticTypeId || !estimatedWeight || !address || !preferredDate || !preferredTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide plastic type, estimated weight, address, preferred date, and time slot',
      });
    }

    if (estimatedWeight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Estimated weight must be greater than 0',
      });
    }

    const plasticType = await PlasticType.findById(plasticTypeId);
    if (!plasticType) {
      return res.status(404).json({ success: false, message: 'Plastic type not found' });
    }

    const pickup = await PickupRequest.create({
      userId: req.user.id,
      plasticTypeId,
      estimatedWeight,
      address,
      preferredDate,
      preferredTimeSlot,
      description: description || '',
      images: images || ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400'],
      status: 'PENDING',
    });

    // Create Notification for User
    await Notification.create({
      userId: req.user.id,
      title: 'Pickup Request Created',
      message: `Your pickup request #${pickup._id.toString().slice(-6)} for ${estimatedWeight} kg of ${plasticType.name} has been submitted successfully.`,
      type: 'INFO',
    });

    const populatedPickup = await PickupRequest.findById(pickup._id)
      .populate('userId', 'name email phone')
      .populate('plasticTypeId', 'name code pointsPerKg');

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: populatedPickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's pickup requests
// @route   GET /api/pickups/my-pickups
// @access  Private (USER)
exports.getMyPickups = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const pickups = await PickupRequest.find(query)
      .populate('plasticTypeId', 'name code pointsPerKg')
      .populate('collectorId', 'name phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await PickupRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pickups.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pickup request by ID
// @route   GET /api/pickups/:id
// @access  Private
exports.getPickupById = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate('userId', 'name email phone address profileImage')
      .populate('plasticTypeId', 'name code pointsPerKg description')
      .populate('collectorId', 'name phone profileImage');

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    // Role safety: USER can only view own pickup unless ADMIN, COLLECTOR, or RECYCLER
    if (req.user.role === 'USER' && pickup.userId._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this pickup request' });
    }

    res.status(200).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel pickup request
// @route   PUT /api/pickups/:id/cancel
// @access  Private (USER or ADMIN)
exports.cancelPickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (req.user.role === 'USER' && pickup.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this pickup' });
    }

    if (!['PENDING', 'ASSIGNED'].includes(pickup.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel pickup with status '${pickup.status}'`,
      });
    }

    pickup.status = 'CANCELLED';
    await pickup.save();

    await Notification.create({
      userId: pickup.userId,
      title: 'Pickup Request Cancelled',
      message: `Your pickup request #${pickup._id.toString().slice(-6)} was cancelled.`,
      type: 'WARNING',
    });

    res.status(200).json({
      success: true,
      message: 'Pickup request cancelled successfully',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin assigns collector to pickup
// @route   PUT /api/pickups/:id/assign
// @access  Private (ADMIN)
exports.assignCollector = async (req, res, next) => {
  try {
    const { collectorId } = req.body;
    if (!collectorId) {
      return res.status(400).json({ success: false, message: 'Please provide collectorId' });
    }

    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'COLLECTOR') {
      return res.status(400).json({ success: false, message: 'Invalid collector ID' });
    }

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Pickup must be in PENDING status to assign collector (Current status: ${pickup.status})`,
      });
    }

    pickup.collectorId = collectorId;
    pickup.status = 'ASSIGNED';
    await pickup.save();

    // Notifications
    await Notification.create({
      userId: pickup.userId,
      title: 'Collector Assigned',
      message: `Collector ${collector.name} has been assigned to your pickup #${pickup._id.toString().slice(-6)}.`,
      type: 'INFO',
    });

    await Notification.create({
      userId: collectorId,
      title: 'New Pickup Assigned',
      message: `You have been assigned to pickup #${pickup._id.toString().slice(-6)}. Please review and accept.`,
      type: 'INFO',
    });

    const updatedPickup = await PickupRequest.findById(pickup._id)
      .populate('userId', 'name phone address')
      .populate('collectorId', 'name phone profileImage')
      .populate('plasticTypeId', 'name code');

    res.status(200).json({
      success: true,
      message: 'Collector assigned successfully',
      data: updatedPickup,
    });
  } catch (error) {
    next(error);
  }
};

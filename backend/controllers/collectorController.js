const PickupRequest = require('../models/PickupRequest');
const Collection = require('../models/Collection');
const RecyclingRecord = require('../models/RecyclingRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get collector assigned pickups
// @route   GET /api/collector/pickups
// @access  Private (COLLECTOR)
exports.getAssignedPickups = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { collectorId: req.user.id };
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'VERIFIED'] };
    }

    const pickups = await PickupRequest.find(query)
      .populate('userId', 'name email phone address profileImage')
      .populate('plasticTypeId', 'name code pointsPerKg')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept assigned pickup
// @route   PUT /api/collector/pickups/:id/accept
// @access  Private (COLLECTOR)
exports.acceptPickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.collectorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this pickup request' });
    }

    if (pickup.status !== 'ASSIGNED') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept pickup with status '${pickup.status}'. Must be ASSIGNED.`,
      });
    }

    pickup.status = 'ACCEPTED';
    await pickup.save();

    await Notification.create({
      userId: pickup.userId,
      title: 'Pickup Accepted',
      message: `Collector has accepted your pickup request #${pickup._id.toString().slice(-6)} and will arrive as scheduled.`,
      type: 'INFO',
    });

    res.status(200).json({
      success: true,
      message: 'Pickup request accepted',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark pickup as picked up
// @route   PUT /api/collector/pickups/:id/pickup
// @access  Private (COLLECTOR)
exports.pickupMaterial = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.collectorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    if (pickup.status !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark picked up when status is '${pickup.status}'. Must be ACCEPTED.`,
      });
    }

    pickup.status = 'PICKED_UP';
    await pickup.save();

    await Notification.create({
      userId: pickup.userId,
      title: 'Material Picked Up',
      message: `Collector has picked up your plastic waste for pickup #${pickup._id.toString().slice(-6)}. Weight verification in progress.`,
      type: 'INFO',
    });

    res.status(200).json({
      success: true,
      message: 'Status updated to PICKED_UP',
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify actual weight & create Collection record
// @route   PUT /api/collector/pickups/:id/verify-weight
// @access  Private (COLLECTOR)
exports.verifyWeight = async (req, res, next) => {
  try {
    const { actualWeight, proofImages, notes } = req.body;

    if (!actualWeight || actualWeight <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid positive actual weight' });
    }

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.collectorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    if (pickup.status !== 'PICKED_UP') {
      return res.status(400).json({
        success: false,
        message: `Cannot verify weight when status is '${pickup.status}'. Must be PICKED_UP.`,
      });
    }

    pickup.actualWeight = Number(actualWeight);
    pickup.status = 'VERIFIED';
    await pickup.save();

    // Create or update Collection record
    const collection = await Collection.findOneAndUpdate(
      { pickupId: pickup._id },
      {
        pickupId: pickup._id,
        collectorId: req.user.id,
        userId: pickup.userId,
        plasticTypeId: pickup.plasticTypeId,
        estimatedWeight: pickup.estimatedWeight,
        actualWeight: Number(actualWeight),
        proofImages: proofImages || pickup.images,
        verifiedAt: new Date(),
        notes: notes || '',
        status: 'VERIFIED',
      },
      { upsert: true, new: true }
    );

    // Update Collector's total plastic collected statistic
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPlasticCollected: Number(actualWeight) },
    });

    await Notification.create({
      userId: pickup.userId,
      title: 'Weight Verified',
      message: `Verified weight for pickup #${pickup._id.toString().slice(-6)}: ${actualWeight} kg. Material is ready for recycling dispatch.`,
      type: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: 'Collection weight verified successfully',
      data: { pickup, collection },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dispatch material to recycler
// @route   PUT /api/collector/pickups/:id/send-to-recycler
// @access  Private (COLLECTOR)
exports.sendToRecycler = async (req, res, next) => {
  try {
    const { recyclerId, notes } = req.body;

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    if (pickup.collectorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    if (pickup.status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        message: `Cannot dispatch to recycler when status is '${pickup.status}'. Must be VERIFIED.`,
      });
    }

    // Find available recycler if recyclerId not explicitly provided
    let assignedRecyclerId = recyclerId;
    if (!assignedRecyclerId) {
      const defaultRecycler = await User.findOne({ role: 'RECYCLER', isActive: true });
      if (!defaultRecycler) {
        return res.status(400).json({ success: false, message: 'No active recycler available in platform' });
      }
      assignedRecyclerId = defaultRecycler._id;
    }

    pickup.status = 'SENT_TO_RECYCLER';
    await pickup.save();

    // Create Recycling Record
    const recyclingRecord = await RecyclingRecord.findOneAndUpdate(
      { pickupId: pickup._id },
      {
        pickupId: pickup._id,
        recyclerId: assignedRecyclerId,
        plasticTypeId: pickup.plasticTypeId,
        receivedWeight: pickup.actualWeight,
        status: 'RECEIVED',
        notes: notes || '',
      },
      { upsert: true, new: true }
    );

    // Notify user & recycler
    await Notification.create({
      userId: pickup.userId,
      title: 'Sent to Recycler',
      message: `Your material (${pickup.actualWeight} kg) has been dispatched to the recycling facility.`,
      type: 'INFO',
    });

    await Notification.create({
      userId: assignedRecyclerId,
      title: 'Incoming Waste Shipment',
      message: `Shipment #${pickup._id.toString().slice(-6)} (${pickup.actualWeight} kg) has been dispatched to your center.`,
      type: 'INFO',
    });

    res.status(200).json({
      success: true,
      message: 'Material dispatched to recycler successfully',
      data: { pickup, recyclingRecord },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Collector Dashboard statistics
// @route   GET /api/collector/dashboard
// @access  Private (COLLECTOR)
exports.getCollectorDashboard = async (req, res, next) => {
  try {
    const collectorId = req.user.id;

    const assignedCount = await PickupRequest.countDocuments({ collectorId, status: 'ASSIGNED' });
    const acceptedCount = await PickupRequest.countDocuments({ collectorId, status: 'ACCEPTED' });
    const activeCount = await PickupRequest.countDocuments({ collectorId, status: { $in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'VERIFIED'] } });
    const completedCount = await PickupRequest.countDocuments({ collectorId, status: { $in: ['SENT_TO_RECYCLER', 'PROCESSING', 'RECYCLED'] } });

    const totalCollectedStats = await Collection.aggregate([
      { $match: { collectorId: new (require('mongoose').Types.ObjectId)(collectorId) } },
      { $group: { _id: null, totalKg: { $sum: '$actualWeight' } } },
    ]);

    const totalKg = totalCollectedStats.length > 0 ? totalCollectedStats[0].totalKg : 0;

    const recentPickups = await PickupRequest.find({ collectorId })
      .populate('userId', 'name phone address')
      .populate('plasticTypeId', 'name code')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        assignedCount,
        acceptedCount,
        activeCount,
        completedCount,
        totalKgCollected: totalKg,
        recentPickups,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Collector history
// @route   GET /api/collector/history
// @access  Private (COLLECTOR)
exports.getCollectorHistory = async (req, res, next) => {
  try {
    const collections = await Collection.find({ collectorId: req.user.id })
      .populate('pickupId')
      .populate('userId', 'name email phone address')
      .populate('plasticTypeId', 'name code')
      .sort({ collectedAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

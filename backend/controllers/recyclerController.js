const RecyclingRecord = require('../models/RecyclingRecord');
const PickupRequest = require('../models/PickupRequest');
const PlasticType = require('../models/PlasticType');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ImpactRecord = require('../models/ImpactRecord');

// @desc    Get incoming / assigned recycling materials
// @route   GET /api/recycler/materials
// @access  Private (RECYCLER)
exports.getIncomingMaterials = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    
    // Recycler can see materials assigned to them or unassigned incoming
    if (status) {
      query.status = status;
    }

    const records = await RecyclingRecord.find(query)
      .populate({
        path: 'pickupId',
        populate: [
          { path: 'userId', select: 'name email phone address' },
          { path: 'collectorId', select: 'name phone' },
        ],
      })
      .populate('plasticTypeId', 'name code pointsPerKg')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Receive incoming shipment
// @route   PUT /api/recycler/materials/:id/receive
// @access  Private (RECYCLER)
exports.receiveMaterial = async (req, res, next) => {
  try {
    const { receivedWeight, notes } = req.body;

    const record = await RecyclingRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Recycling record not found' });
    }

    record.recyclerId = req.user.id;
    record.status = 'PROCESSING';
    if (receivedWeight && Number(receivedWeight) > 0) {
      record.receivedWeight = Number(receivedWeight);
    }
    if (notes) record.notes = notes;
    await record.save();

    // Update pickup request status
    const pickup = await PickupRequest.findById(record.pickupId);
    if (pickup) {
      pickup.status = 'PROCESSING';
      await pickup.save();

      await Notification.create({
        userId: pickup.userId,
        title: 'Recycling Processing Started',
        message: `Your waste shipment #${pickup._id.toString().slice(-6)} is now being sorted and processed at the recycling plant.`,
        type: 'INFO',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shipment received and processing started',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete recycling process & credit reward points
// @route   PUT /api/recycler/materials/:id/complete
// @access  Private (RECYCLER)
exports.completeRecycling = async (req, res, next) => {
  try {
    const { recycledWeight, rejectedWeight, notes } = req.body;

    const record = await RecyclingRecord.findById(req.params.id).populate('plasticTypeId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Recycling record not found' });
    }

    if (record.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'This recycling record has already been marked COMPLETED. Duplicate reward points prevented.',
      });
    }

    const recWeight = Number(recycledWeight || 0);
    const rejWeight = Number(rejectedWeight || 0);

    if (recWeight < 0 || rejWeight < 0) {
      return res.status(400).json({ success: false, message: 'Weight values cannot be negative' });
    }

    // Business Rule #11: recycledWeight + rejectedWeight must not exceed receivedWeight
    if (recWeight + rejWeight > record.receivedWeight + 0.1) {
      return res.status(400).json({
        success: false,
        message: `Recycled weight (${recWeight} kg) + Rejected weight (${rejWeight} kg) cannot exceed Received weight (${record.receivedWeight} kg)`,
      });
    }

    record.processedWeight = recWeight + rejWeight;
    record.recycledWeight = recWeight;
    record.rejectedWeight = rejWeight;
    record.status = 'COMPLETED';
    record.completedAt = new Date();
    if (notes) record.notes = notes;
    await record.save();

    // Update PickupRequest status to RECYCLED
    const pickup = await PickupRequest.findById(record.pickupId);
    if (pickup) {
      pickup.status = 'RECYCLED';
      pickup.actualWeight = recWeight;
      await pickup.save();

      // Calculate points
      const pointsPerKg = record.plasticTypeId ? record.plasticTypeId.pointsPerKg : 10;
      const pointsAwarded = Math.round(recWeight * pointsPerKg);

      // Atomically update User points and recycled stats
      const user = await User.findByIdAndUpdate(
        pickup.userId,
        {
          $inc: {
            points: pointsAwarded,
            totalPlasticRecycled: recWeight,
          },
        },
        { new: true }
      );

      // Environmental impact calculations (EPA WARM standards)
      // 1 kg plastic recycled ≈ 1.5 kg CO2 avoided, 5.77 kWh energy saved, 0.002 m3 landfill saved, 0.03 trees eq.
      const co2AvoidedKg = parseFloat((recWeight * 1.5).toFixed(2));
      const energySavedKwh = parseFloat((recWeight * 5.77).toFixed(2));
      const landfillSavedM3 = parseFloat((recWeight * 0.002).toFixed(4));
      const treesEquivalent = parseFloat((recWeight * 0.03).toFixed(2));

      await ImpactRecord.create({
        userId: pickup.userId,
        pickupId: pickup._id,
        plasticWeight: recWeight,
        co2AvoidedKg,
        energySavedKwh,
        landfillSavedM3,
        treesEquivalent,
      });

      // Notify User
      await Notification.create({
        userId: pickup.userId,
        title: '🎉 Recycling Completed & Points Credited!',
        message: `Your ${recWeight} kg of plastic was successfully recycled! You earned +${pointsAwarded} reward points. Total Points: ${user ? user.points : 0}.`,
        type: 'SUCCESS',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recycling completed successfully and reward points credited!',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recycler Dashboard stats
// @route   GET /api/recycler/dashboard
// @access  Private (RECYCLER)
exports.getRecyclerDashboard = async (req, res, next) => {
  try {
    const recyclerId = req.user.id;

    const incomingCount = await RecyclingRecord.countDocuments({ status: 'RECEIVED' });
    const processingCount = await RecyclingRecord.countDocuments({ status: 'PROCESSING' });
    const completedCount = await RecyclingRecord.countDocuments({ status: 'COMPLETED' });

    const totalRecycledStats = await RecyclingRecord.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalRecycled: { $sum: '$recycledWeight' }, totalRejected: { $sum: '$rejectedWeight' } } },
    ]);

    const totalRecycled = totalRecycledStats.length > 0 ? totalRecycledStats[0].totalRecycled : 0;
    const totalRejected = totalRecycledStats.length > 0 ? totalRecycledStats[0].totalRejected : 0;

    const recentRecords = await RecyclingRecord.find()
      .populate({
        path: 'pickupId',
        populate: { path: 'userId', select: 'name' },
      })
      .populate('plasticTypeId', 'name code')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        incomingCount,
        processingCount,
        completedCount,
        totalRecycledKg: totalRecycled,
        totalRejectedKg: totalRejected,
        recentRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

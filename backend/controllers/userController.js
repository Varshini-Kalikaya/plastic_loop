const PickupRequest = require('../models/PickupRequest');
const ImpactRecord = require('../models/ImpactRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get user dashboard summary stats
// @route   GET /api/user/dashboard
// @access  Private (USER)
exports.getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const completedPickups = await PickupRequest.countDocuments({ userId: user._id, status: 'RECYCLED' });
    const activePickup = await PickupRequest.findOne({
      userId: user._id,
      status: { $in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'VERIFIED', 'SENT_TO_RECYCLER', 'PROCESSING'] },
    })
      .populate('plasticTypeId', 'name code')
      .populate('collectorId', 'name phone profileImage')
      .sort({ createdAt: -1 });

    const recentPickups = await PickupRequest.find({ userId: user._id })
      .populate('plasticTypeId', 'name code pointsPerKg')
      .sort({ createdAt: -1 })
      .limit(5);

    // Impact aggregates
    const impactRecords = await ImpactRecord.find({ userId: user._id });
    const totalCo2Avoided = impactRecords.reduce((acc, curr) => acc + (curr.co2AvoidedKg || 0), 0);
    const totalEnergySaved = impactRecords.reduce((acc, curr) => acc + (curr.energySavedKwh || 0), 0);
    const totalLandfillSaved = impactRecords.reduce((acc, curr) => acc + (curr.landfillSavedM3 || 0), 0);
    const totalTrees = impactRecords.reduce((acc, curr) => acc + (curr.treesEquivalent || 0), 0);

    const unreadNotifications = await Notification.countDocuments({ userId: user._id, read: false });

    res.status(200).json({
      success: true,
      data: {
        points: user.points,
        totalPlasticCollected: user.totalPlasticCollected,
        totalPlasticRecycled: user.totalPlasticRecycled,
        completedPickups,
        activePickup,
        recentPickups,
        unreadNotifications,
        impact: {
          co2AvoidedKg: parseFloat(totalCo2Avoided.toFixed(2)),
          energySavedKwh: parseFloat(totalEnergySaved.toFixed(2)),
          landfillSavedM3: parseFloat(totalLandfillSaved.toFixed(4)),
          treesEquivalent: parseFloat(totalTrees.toFixed(2)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed user environmental impact records
// @route   GET /api/user/impact
// @access  Private (USER)
exports.getImpactDetails = async (req, res, next) => {
  try {
    const impactRecords = await ImpactRecord.find({ userId: req.user.id })
      .populate({
        path: 'pickupId',
        populate: { path: 'plasticTypeId', select: 'name code' },
      })
      .sort({ createdAt: -1 });

    const totalCo2Avoided = impactRecords.reduce((acc, curr) => acc + (curr.co2AvoidedKg || 0), 0);
    const totalEnergySaved = impactRecords.reduce((acc, curr) => acc + (curr.energySavedKwh || 0), 0);
    const totalLandfillSaved = impactRecords.reduce((acc, curr) => acc + (curr.landfillSavedM3 || 0), 0);
    const totalTrees = impactRecords.reduce((acc, curr) => acc + (curr.treesEquivalent || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          co2AvoidedKg: parseFloat(totalCo2Avoided.toFixed(2)),
          energySavedKwh: parseFloat(totalEnergySaved.toFixed(2)),
          landfillSavedM3: parseFloat(totalLandfillSaved.toFixed(4)),
          treesEquivalent: parseFloat(totalTrees.toFixed(2)),
        },
        records: impactRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

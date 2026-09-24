const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const PlasticType = require('../models/PlasticType');
const Collection = require('../models/Collection');
const RecyclingRecord = require('../models/RecyclingRecord');
const Redemption = require('../models/Redemption');
const ImpactRecord = require('../models/ImpactRecord');

// @desc    Admin Ecosystem Dashboard Overview
// @route   GET /api/admin/dashboard
// @access  Private (ADMIN)
exports.getDashboardOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalCollectors = await User.countDocuments({ role: 'COLLECTOR' });
    const totalRecyclers = await User.countDocuments({ role: 'RECYCLER' });

    const pendingPickups = await PickupRequest.countDocuments({ status: 'PENDING' });
    const activePickups = await PickupRequest.countDocuments({
      status: { $in: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'VERIFIED', 'SENT_TO_RECYCLER', 'PROCESSING'] },
    });
    const completedPickups = await PickupRequest.countDocuments({ status: 'RECYCLED' });

    const totalCollectedStats = await Collection.aggregate([
      { $group: { _id: null, totalKg: { $sum: '$actualWeight' } } },
    ]);
    const totalPlasticCollected = totalCollectedStats.length > 0 ? totalCollectedStats[0].totalKg : 0;

    const totalRecycledStats = await RecyclingRecord.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalKg: { $sum: '$recycledWeight' } } },
    ]);
    const totalPlasticRecycled = totalRecycledStats.length > 0 ? totalRecycledStats[0].totalKg : 0;

    const recyclingRate = totalPlasticCollected > 0 ? ((totalPlasticRecycled / totalPlasticCollected) * 100).toFixed(1) : 0;

    // Recent activity timeline
    const recentPickups = await PickupRequest.find()
      .populate('userId', 'name email')
      .populate('plasticTypeId', 'name code')
      .populate('collectorId', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCollectors,
        totalRecyclers,
        pendingPickups,
        activePickups,
        completedPickups,
        totalPlasticCollected,
        totalPlasticRecycled,
        recyclingRate: Number(recyclingRate),
        recentPickups,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, filtering & pagination
// @route   GET /api/admin/users
// @access  Private (ADMIN)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or active status
// @route   PUT /api/admin/users/:id
// @access  Private (ADMIN)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive, phone } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pickup requests with filters
// @route   GET /api/admin/pickups
// @access  Private (ADMIN)
exports.getAllPickups = async (req, res, next) => {
  try {
    const { status, plasticTypeId, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (plasticTypeId) query.plasticTypeId = plasticTypeId;

    const skip = (page - 1) * limit;

    const pickups = await PickupRequest.find(query)
      .populate('userId', 'name email phone address')
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

// @desc    Get all redemptions
// @route   GET /api/admin/redemptions
// @access  Private (ADMIN)
exports.getAllRedemptions = async (req, res, next) => {
  try {
    const redemptions = await Redemption.find()
      .populate('userId', 'name email phone')
      .populate('rewardId')
      .sort({ redeemedAt: -1 });

    res.status(200).json({
      success: true,
      count: redemptions.length,
      data: redemptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update redemption status
// @route   PUT /api/admin/redemptions/:id
// @access  Private (ADMIN)
exports.updateRedemptionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const redemption = await Redemption.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('rewardId');

    if (!redemption) {
      return res.status(404).json({ success: false, message: 'Redemption record not found' });
    }

    res.status(200).json({
      success: true,
      message: `Redemption status updated to ${status}`,
      data: redemption,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analytics: Monthly Plastic Collection & Recycling Trends
// @route   GET /api/admin/analytics/overview
// @access  Private (ADMIN)
exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    // Aggregation for monthly plastic stats
    const monthlyStats = await PickupRequest.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalEstimated: { $sum: '$estimatedWeight' },
          totalCollected: { $sum: '$actualWeight' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyStats.map((item) => ({
      name: `${months[item._id.month - 1]} ${item._id.year}`,
      Collected: Math.round(item.totalCollected || item.totalEstimated),
      Requests: item.count,
    }));

    // Plastic type distribution aggregation
    const plasticDistribution = await PickupRequest.aggregate([
      {
        $lookup: {
          from: 'plastictypes',
          localField: 'plasticTypeId',
          foreignField: '_id',
          as: 'plasticInfo',
        },
      },
      { $unwind: '$plasticInfo' },
      {
        $group: {
          _id: '$plasticInfo.code',
          name: { $first: '$plasticInfo.name' },
          value: { $sum: '$actualWeight' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Status breakdown
    const statusDistribution = await PickupRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyTrends: formattedMonthly.length > 0 ? formattedMonthly : [
          { name: 'May', Collected: 120, Requests: 15 },
          { name: 'Jun', Collected: 240, Requests: 28 },
          { name: 'Jul', Collected: 350, Requests: 42 },
          { name: 'Aug', Collected: 480, Requests: 55 },
          { name: 'Sep', Collected: 610, Requests: 68 },
        ],
        plasticDistribution: plasticDistribution.map((p) => ({ name: p._id, value: p.value || p.count * 5 })),
        statusDistribution: statusDistribution.map((s) => ({ status: s._id, count: s.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

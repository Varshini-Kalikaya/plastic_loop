const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get active rewards catalog
// @route   GET /api/rewards
// @access  Public / Private
exports.getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ active: true }).sort({ pointsRequired: 1 });
    res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem reward
// @route   POST /api/rewards/redeem
// @access  Private (USER)
exports.redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.body;
    if (!rewardId) {
      return res.status(400).json({ success: false, message: 'Reward ID is required' });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.active) {
      return res.status(404).json({ success: false, message: 'Reward not available' });
    }

    if (reward.quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Reward is currently out of stock' });
    }

    const user = await User.findById(req.user.id);
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${reward.pointsRequired} points, but you have ${user.points} points.`,
      });
    }

    // Atomic deduction of user points & decrement reward quantity
    user.points -= reward.pointsRequired;
    await user.save();

    reward.quantity -= 1;
    await reward.save();

    const redemption = await Redemption.create({
      userId: user._id,
      rewardId: reward._id,
      pointsUsed: reward.pointsRequired,
      status: 'APPROVED',
    });

    await Notification.create({
      userId: user._id,
      title: '🎁 Reward Redeemed!',
      message: `You successfully redeemed '${reward.name}' for ${reward.pointsRequired} points. Code: ${redemption.redemptionCode}.`,
      type: 'SUCCESS',
    });

    const populatedRedemption = await Redemption.findById(redemption._id).populate('rewardId');

    res.status(201).json({
      success: true,
      message: 'Reward redeemed successfully!',
      data: populatedRedemption,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's redemption history
// @route   GET /api/rewards/my-redemptions
// @access  Private (USER)
exports.getUserRedemptions = async (req, res, next) => {
  try {
    const redemptions = await Redemption.find({ userId: req.user.id })
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

// @desc    Get leaderboard
// @route   GET /api/rewards/leaderboard
// @access  Public / Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { filter = 'all-time' } = req.query;

    // Top 20 users by total plastic recycled and points
    const topUsers = await User.find({ role: 'USER', isActive: true })
      .select('name profileImage totalPlasticRecycled totalPlasticCollected points createdAt')
      .sort({ totalPlasticRecycled: -1, points: -1 })
      .limit(20);

    const formattedLeaderboard = topUsers.map((u, index) => ({
      rank: index + 1,
      id: u._id,
      name: u.name,
      profileImage: u.profileImage,
      totalPlasticRecycled: u.totalPlasticRecycled,
      totalPlasticCollected: u.totalPlasticCollected,
      points: u.points,
      badge:
        index === 0
          ? '🥇 Eco Titan'
          : index === 1
          ? '🥈 Recycling Champion'
          : index === 2
          ? '🥉 Green Pioneer'
          : u.totalPlasticRecycled > 50
          ? 'Plastic Saver'
          : 'Eco Contributor',
    }));

    res.status(200).json({
      success: true,
      count: formattedLeaderboard.length,
      filter,
      data: formattedLeaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Reward (Admin)
// @route   POST /api/rewards
// @access  Private (ADMIN)
exports.createReward = async (req, res, next) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json({ success: true, message: 'Reward created successfully', data: reward });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Reward (Admin)
// @route   PUT /api/rewards/:id
// @access  Private (ADMIN)
exports.updateReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reward) return res.status(404).json({ success: false, message: 'Reward not found' });
    res.status(200).json({ success: true, message: 'Reward updated successfully', data: reward });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Reward (Admin)
// @route   DELETE /api/rewards/:id
// @access  Private (ADMIN)
exports.deleteReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) return res.status(404).json({ success: false, message: 'Reward not found' });
    res.status(200).json({ success: true, message: 'Reward deleted successfully', data: {} });
  } catch (error) {
    next(error);
  }
};

const express = require('express');
const router = express.Router();
const {
  getRewards,
  redeemReward,
  getUserRedemptions,
  getLeaderboard,
  createReward,
  updateReward,
  deleteReward,
} = require('../controllers/rewardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRewards);
router.get('/leaderboard', getLeaderboard);

router.post('/redeem', protect, redeemReward);
router.get('/my-redemptions', protect, getUserRedemptions);

router.post('/', protect, authorize('ADMIN'), createReward);
router.put('/:id', protect, authorize('ADMIN'), updateReward);
router.delete('/:id', protect, authorize('ADMIN'), deleteReward);

module.exports = router;

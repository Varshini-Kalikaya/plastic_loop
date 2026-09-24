const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getAllUsers,
  updateUser,
  getAllPickups,
  getAllRedemptions,
  updateRedemptionStatus,
  getAnalyticsOverview,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardOverview);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

router.get('/pickups', getAllPickups);
router.get('/redemptions', getAllRedemptions);
router.put('/redemptions/:id', updateRedemptionStatus);

router.get('/analytics/overview', getAnalyticsOverview);

module.exports = router;

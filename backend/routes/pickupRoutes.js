const express = require('express');
const router = express.Router();
const {
  createPickupRequest,
  getMyPickups,
  getPickupById,
  cancelPickup,
  assignCollector,
} = require('../controllers/pickupController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createPickupRequest);
router.get('/my-pickups', getMyPickups);
router.get('/:id', getPickupById);
router.put('/:id/cancel', cancelPickup);
router.put('/:id/assign', authorize('ADMIN'), assignCollector);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAssignedPickups,
  acceptPickup,
  pickupMaterial,
  verifyWeight,
  sendToRecycler,
  getCollectorDashboard,
  getCollectorHistory,
} = require('../controllers/collectorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('COLLECTOR', 'ADMIN'));

router.get('/dashboard', getCollectorDashboard);
router.get('/pickups', getAssignedPickups);
router.get('/history', getCollectorHistory);

router.put('/pickups/:id/accept', acceptPickup);
router.put('/pickups/:id/pickup', pickupMaterial);
router.put('/pickups/:id/verify-weight', verifyWeight);
router.put('/pickups/:id/send-to-recycler', sendToRecycler);

module.exports = router;

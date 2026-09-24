const express = require('express');
const router = express.Router();
const {
  getIncomingMaterials,
  receiveMaterial,
  completeRecycling,
  getRecyclerDashboard,
} = require('../controllers/recyclerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('RECYCLER', 'ADMIN'));

router.get('/dashboard', getRecyclerDashboard);
router.get('/materials', getIncomingMaterials);
router.put('/materials/:id/receive', receiveMaterial);
router.put('/materials/:id/complete', completeRecycling);

module.exports = router;

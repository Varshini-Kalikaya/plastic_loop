const express = require('express');
const router = express.Router();
const {
  getPlasticTypes,
  getPlasticTypeById,
  createPlasticType,
  updatePlasticType,
  deletePlasticType,
} = require('../controllers/plasticTypeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPlasticTypes);
router.get('/:id', getPlasticTypeById);

router.post('/', protect, authorize('ADMIN'), createPlasticType);
router.put('/:id', protect, authorize('ADMIN'), updatePlasticType);
router.delete('/:id', protect, authorize('ADMIN'), deletePlasticType);

module.exports = router;

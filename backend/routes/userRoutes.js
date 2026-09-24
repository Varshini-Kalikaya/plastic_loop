const express = require('express');
const router = express.Router();
const { getUserDashboard, getImpactDetails } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getUserDashboard);
router.get('/impact', getImpactDetails);

module.exports = router;

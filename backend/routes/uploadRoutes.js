const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), uploadFile);

module.exports = router;

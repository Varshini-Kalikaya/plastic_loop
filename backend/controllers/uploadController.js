// @desc    Upload single file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  // Generate accessible URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
  });
};

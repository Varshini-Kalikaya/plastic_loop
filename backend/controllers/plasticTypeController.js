const PlasticType = require('../models/PlasticType');

// @desc    Get all plastic types
// @route   GET /api/plastic-types
// @access  Public
exports.getPlasticTypes = async (req, res, next) => {
  try {
    const types = await PlasticType.find({ accepted: true }).sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: types.length,
      data: types,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plastic type
// @route   GET /api/plastic-types/:id
// @access  Public
exports.getPlasticTypeById = async (req, res, next) => {
  try {
    const plasticType = await PlasticType.findById(req.params.id);
    if (!plasticType) {
      return res.status(404).json({ success: false, message: 'Plastic type not found' });
    }
    res.status(200).json({ success: true, data: plasticType });
  } catch (error) {
    next(error);
  }
};

// @desc    Create plastic type
// @route   POST /api/plastic-types
// @access  Private/Admin
exports.createPlasticType = async (req, res, next) => {
  try {
    const plasticType = await PlasticType.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Plastic type created successfully',
      data: plasticType,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update plastic type
// @route   PUT /api/plastic-types/:id
// @access  Private/Admin
exports.updatePlasticType = async (req, res, next) => {
  try {
    const plasticType = await PlasticType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plasticType) {
      return res.status(404).json({ success: false, message: 'Plastic type not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Plastic type updated successfully',
      data: plasticType,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete plastic type
// @route   DELETE /api/plastic-types/:id
// @access  Private/Admin
exports.deletePlasticType = async (req, res, next) => {
  try {
    const plasticType = await PlasticType.findByIdAndDelete(req.params.id);
    if (!plasticType) {
      return res.status(404).json({ success: false, message: 'Plastic type not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Plastic type removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

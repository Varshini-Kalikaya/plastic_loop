const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'plasticloop_jwt_secret_key_2026_btech_project', {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const userObj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profileImage: user.profileImage,
    points: user.points,
    totalPlasticCollected: user.totalPlasticCollected,
    totalPlasticRecycled: user.totalPlasticRecycled,
    isActive: user.isActive,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: userObj,
  });
};

module.exports = { generateToken, sendTokenResponse };

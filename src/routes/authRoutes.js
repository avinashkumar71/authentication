const express = require('express');
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/refresh-token', refreshTokenValidator, validateRequest, refreshAccessToken);
router.post('/logout', refreshTokenValidator, validateRequest, logoutUser);
router.get('/me', protect, getProfile);

module.exports = router;

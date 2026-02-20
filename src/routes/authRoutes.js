const express = require('express');
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getProfile,
  getCsrfToken,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { requireCsrf } = require('../middlewares/csrfMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.get('/csrf-token', getCsrfToken);
router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/refresh-token', requireCsrf, refreshTokenValidator, validateRequest, refreshAccessToken);
router.post('/logout', requireCsrf, refreshTokenValidator, validateRequest, logoutUser);
router.get('/me', protect, getProfile);

module.exports = router;

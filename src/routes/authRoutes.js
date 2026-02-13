const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  registerValidator,
  loginValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/me', protect, getProfile);

module.exports = router;

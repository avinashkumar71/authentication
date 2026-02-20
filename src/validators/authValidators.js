const { body } = require('express-validator');
const { cookieName } = require('../utils/authCookies');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshTokenValidator = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string'),
  body().custom((_, { req }) => {
    if (req.body.refreshToken || req.cookies[cookieName]) {
      return true;
    }

    throw new Error('Refresh token is required');
  }),
];

module.exports = { registerValidator, loginValidator, refreshTokenValidator };

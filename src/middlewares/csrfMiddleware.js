const { csrfCookieName } = require('../utils/authCookies');

const requireCsrf = (req, res, next) => {
  const csrfFromCookie = req.cookies[csrfCookieName];
  const csrfFromHeader = req.headers['x-csrf-token'];

  if (!csrfFromCookie || !csrfFromHeader || csrfFromCookie !== csrfFromHeader) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }

  return next();
};

module.exports = { requireCsrf };

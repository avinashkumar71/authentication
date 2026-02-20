const jwt = require('jsonwebtoken');
const { getAccessTokenFromRequest } = require('../utils/tokenCookies');

const protect = (req, res, next) => {
  const token = getAccessTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'authentication-service',
      audience: process.env.JWT_AUDIENCE || 'authentication-client',
      algorithms: ['HS256'],
    });

    if (decoded.tokenType !== 'access') {
      return res.status(401).json({ message: 'Not authorized, invalid token type' });
    }

    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };

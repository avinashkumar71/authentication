const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const jwtIssuer = process.env.JWT_ISSUER || 'authentication-service';
const jwtAudience = process.env.JWT_AUDIENCE || 'authentication-client';

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
      tokenType: 'access',
      jti: crypto.randomUUID(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
      issuer: jwtIssuer,
      audience: jwtAudience,
      algorithm: 'HS256',
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      tokenType: 'refresh',
      jti: crypto.randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
      issuer: jwtIssuer,
      audience: jwtAudience,
      algorithm: 'HS256',
    }
  );
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
};

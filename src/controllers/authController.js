const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} = require('../utils/generateToken');
const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} = require('../utils/authCookies');

const jwtIssuer = process.env.JWT_ISSUER || 'authentication-service';
const jwtAudience = process.env.JWT_AUDIENCE || 'authentication-client';
const refreshTokenExpiresInSeconds = Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS || 7 * 24 * 60 * 60);

const getRefreshTokenExpiry = () => new Date(Date.now() + refreshTokenExpiresInSeconds * 1000);

const issueTokenPair = async (user) => {
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshTokens = (user.refreshTokens || []).filter(
    (entry) => entry.expiresAt > new Date()
  );
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(),
  });

  await user.save();

  return { accessToken, refreshToken };
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      refreshTokens: [],
    });

    const { accessToken, refreshToken } = await issueTokenPair(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = await issueTokenPair(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      issuer: jwtIssuer,
      audience: jwtAudience,
      algorithms: ['HS256'],
    });

    if (decoded.tokenType !== 'refresh') {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    const user = await User.findById(decoded.userId).select('+refreshTokens');

    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    const providedHash = hashToken(refreshToken);
    const matchedToken = (user.refreshTokens || []).find(
      (entry) => entry.tokenHash === providedHash && entry.expiresAt > new Date()
    );

    if (!matchedToken) {
      user.refreshTokens = [];
      await user.save();
      res.status(401);
      throw new Error('Refresh token reuse detected');
    }

    user.refreshTokens = user.refreshTokens.filter(
      (entry) => entry.tokenHash !== providedHash && entry.expiresAt > new Date()
    );
    await user.save();

    const { accessToken, refreshToken: rotatedRefreshToken } = await issueTokenPair(user);
    setRefreshTokenCookie(res, rotatedRefreshToken);

    return res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    return next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return res.status(400).json({ message: 'Invalid refresh token payload' });
    }

    const decoded = jwt.decode(refreshToken);

    if (!decoded || !decoded.userId) {
      res.status(400);
      throw new Error('Invalid refresh token payload');
    }

    const user = await User.findById(decoded.userId).select('+refreshTokens');

    if (user) {
      const providedHash = hashToken(refreshToken);
      user.refreshTokens = (user.refreshTokens || []).filter(
        (entry) => entry.tokenHash !== providedHash && entry.expiresAt > new Date()
      );
      await user.save();
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getProfile,
};

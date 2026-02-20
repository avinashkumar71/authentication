const crypto = require('crypto');

const refreshCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const accessCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME || 'accessToken';
const csrfCookieName = process.env.CSRF_COOKIE_NAME || 'csrfToken';

const refreshTokenExpiresInSeconds = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS || 7 * 24 * 60 * 60
);
const accessTokenExpiresInSeconds = Number(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS || 15 * 60
);

const isProduction = process.env.NODE_ENV === 'production';
const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');

const getBaseCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite,
  maxAge,
  path: '/api',
});

const getRefreshCookieOptions = () => getBaseCookieOptions(refreshTokenExpiresInSeconds * 1000);
const getAccessCookieOptions = () => getBaseCookieOptions(accessTokenExpiresInSeconds * 1000);

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie(accessCookieName, accessToken, getAccessCookieOptions());
  res.cookie(refreshCookieName, refreshToken, getRefreshCookieOptions());
};

const clearAuthCookies = (res) => {
  res.clearCookie(accessCookieName, getAccessCookieOptions());
  res.clearCookie(refreshCookieName, getRefreshCookieOptions());
  res.clearCookie(csrfCookieName, getCsrfCookieOptions());
};

const getRefreshTokenFromRequest = (req) => req.cookies[refreshCookieName] || req.body.refreshToken;
const getAccessTokenFromRequest = (req) => req.cookies[accessCookieName];

const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');

const getCsrfCookieOptions = () => ({
  httpOnly: false,
  secure: isProduction,
  sameSite,
  maxAge: refreshTokenExpiresInSeconds * 1000,
  path: '/api',
});

const setCsrfCookie = (res, csrfToken) => {
  res.cookie(csrfCookieName, csrfToken, getCsrfCookieOptions());
};

module.exports = {
  refreshCookieName,
  accessCookieName,
  csrfCookieName,
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromRequest,
  getAccessTokenFromRequest,
  generateCsrfToken,
  setCsrfCookie,
};

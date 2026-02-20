const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const refreshTokenExpiresInSeconds = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS || 7 * 24 * 60 * 60
);

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: refreshTokenExpiresInSeconds * 1000,
  path: '/api/auth',
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(cookieName, refreshToken, getRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(cookieName, {
    ...getRefreshCookieOptions(),
    maxAge: undefined,
  });
};

const getRefreshTokenFromRequest = (req) => req.body.refreshToken || req.cookies[cookieName];

module.exports = {
  cookieName,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
};

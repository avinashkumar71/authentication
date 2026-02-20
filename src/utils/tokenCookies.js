const isProduction = process.env.NODE_ENV === 'production';

const accessTokenExpiryMs = Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS || 15 * 60 * 1000);
const refreshTokenExpiryMs = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000);

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: accessTokenExpiryMs,
  });

  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: refreshTokenExpiryMs,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', baseCookieOptions);
  res.clearCookie('refreshToken', baseCookieOptions);
};

const getRefreshTokenFromRequest = (req) => {
  return req.cookies?.refreshToken || req.body?.refreshToken;
};

const getAccessTokenFromRequest = (req) => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromRequest,
  getAccessTokenFromRequest,
};

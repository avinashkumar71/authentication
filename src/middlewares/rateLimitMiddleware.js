const requestWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 10;

const buckets = new Map();

const authLimiter = (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.expiresAt) {
    buckets.set(key, { count: 1, expiresAt: now + requestWindowMs });
    return next();
  }

  if (entry.count >= maxRequestsPerWindow) {
    return res.status(429).json({
      message: 'Too many authentication attempts, please try again later',
    });
  }

  entry.count += 1;
  buckets.set(key, entry);
  return next();
};

module.exports = { authLimiter };

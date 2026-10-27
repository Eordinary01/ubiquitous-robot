// In-memory sliding window rate limiter
const store = new Map();

// Periodic cleanup every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

const cleanupStore = (windowMs) => {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, timestamps] of store.entries()) {
    const validTimestamps = timestamps.filter((time) => now - time < windowMs);
    if (validTimestamps.length === 0) {
      store.delete(key);
    } else {
      store.set(key, validTimestamps);
    }
  }
};

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  message = "Too many requests. Please try again later.",
} = {}) => {
  const limiter = (req, res, next) => {
    if (process.env.DISABLE_RATE_LIMIT === "true") {
      return next();
    }

    cleanupStore(windowMs);

    const clientIp =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";

    const now = Date.now();
    const timestamps = store.get(clientIp) || [];
    const validTimestamps = timestamps.filter((time) => now - time < windowMs);

    if (validTimestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((validTimestamps[0] + windowMs - now) / 1000),
      });
    }

    validTimestamps.push(now);
    store.set(clientIp, validTimestamps);
    next();
  };

  limiter.reset = () => {
    store.clear();
  };

  return limiter;
};

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts. Please try again later.",
});

module.exports = {
  createRateLimiter,
  loginRateLimiter,
};

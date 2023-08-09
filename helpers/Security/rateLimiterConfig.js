const rateLimit = require("express-rate-limit");

const requestRateLimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "To many request from your IP. Please try again in 1 hour",
});

module.exports = requestRateLimiter;

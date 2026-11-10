const rateLimit = require("express-rate-limit");

const createRateLimiter = (message, windowMinutes = 2, limit = 1) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message,
    },
  });
};

const forgotPasswordLimiter = createRateLimiter(
  "Please wait 2 minutes before requesting another OTP."
);

const resendVerificationLimiter = createRateLimiter(
  "Please wait 2 minutes before requesting another verification email."
);

module.exports = {
  forgotPasswordLimiter,
  resendVerificationLimiter,
};

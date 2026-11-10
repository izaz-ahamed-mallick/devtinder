const express = require("express");
const { signUpValidation, loginValidation } = require("../utils/validation");
const { signUpController, loginController } = require("../controller/auth.controller");
const { verifyEmailController } = require("../controller/verifyEmailController");
const { resendVerificationController } = require("../controller/resendVerificationController");
const { forgotPasswordController } = require("../controller/forgotPasswordcontroller");
const { forgotPasswordLimiter, resendVerificationLimiter } = require("../middleware/rateLimiter");
const { verifyOtpController } = require("../controller/verifyOtpController");
const { resetPasswordController } = require("../controller/resetPasswordController");
const authRouter = express.Router();

authRouter.post('/signup', signUpValidation, signUpController)

authRouter.post("/login", loginValidation, loginController)

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");

  res.send({
    message: "Logout successful"
  });
});
authRouter.post("/auth/verify-email", verifyEmailController);

authRouter.post("/auth/resend-verification",resendVerificationLimiter,resendVerificationController)
authRouter.post("/auth/forgot-password", forgotPasswordController);
authRouter.post("/auth/verify-reset-otp", verifyOtpController);
authRouter.post("/auth/reset-password", resetPasswordController);
module.exports = authRouter

const User = require("../models/user");
const crypto = require("crypto");
const {
  generatePasswordResetToken,
} = require("../utils/tokenUtils");

const verifyOtpController = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    if (!emailId || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

 const otpHash = crypto
  .createHash("sha256")
  .update(String(otp))
  .digest("hex");

    const user = await User.findOne({
      emailId,
      resetPasswordOTPHash: otpHash,
      resetPasswordOTPExpires: { $gt: new Date() },
      resetPasswordVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP.",
      });
    }

    const { token, tokenHash } = generatePasswordResetToken();

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordTokenExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetPasswordOTPHash = null;
    user.resetPasswordOTPExpires = null;
    user.resetPasswordVerified = false;

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully.",
      resetToken: token,
    });

  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while verifying OTP.",
    });
  }
};

module.exports = { verifyOtpController };

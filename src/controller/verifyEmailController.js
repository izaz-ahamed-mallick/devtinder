
const crypto = require("crypto");
const User = require("../models/user");
const { sendWelcomeEmail } = require("../services/emailVerificationService");


const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
      isEmailVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link.",
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;

    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.emailId, user.firstName);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    return res.status(200).json({
      message: "Email verified successfully! Welcome to DevTinder.",
    });

  } catch (error) {
    console.error("Email verification error:", error.message);

    return res.status(500).json({
      message: "Something went wrong during email verification.",
    });
  }
};

module.exports = { verifyEmailController };

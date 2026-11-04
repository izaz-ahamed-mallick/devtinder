const User = require("../models/user");
const { sendVerificationEmail } = require("../services/emailVerificationService");
const { generateEmailVerificationToken } = require("../utils/tokenUtils");

const resendVerificationController = async (req, res) => {
  try {
    const { emailId } = req.body;

    // 1. Validate email
    if (!emailId) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }

    // 2. Find user
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 3. Check whether email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Your email is already verified. Please log in.",
      });
    }

    // 4. Generate a new verification token
    const { token, tokenHash } = generateEmailVerificationToken();

    // 5. Update token hash and expiry
    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // 6. Send new verification email
    await sendVerificationEmail(user.emailId, user.firstName, token);

    return res.status(200).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });

  } catch (error) {
    console.error("Resend verification error:", error.message);

    return res.status(500).json({
      message: "Unable to send verification email. Please try again later.",
    });
  }
};

module.exports = { resendVerificationController };

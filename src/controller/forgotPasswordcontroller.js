
const User = require("../models/user");
const { generateOTP } = require("../utils/tokenUtils");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const forgotPasswordEmailTemplate = require("../templates/emails/forgotPasswordEmail");
const getEmailRecipient = require("../utils/getEmailRecipient");

const forgotPasswordController = async (req, res) => {
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

    // Generic response prevents email enumeration
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address.",
      });
    }

    // 3. Generate OTP
    const otp = generateOTP();

    // 4. Hash OTP before storing
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // 5. Store OTP hash and expiry (5 minutes)
    user.resetPasswordOTPHash = otpHash;
    user.resetPasswordOTPExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );
    user.resetPasswordVerified = false;

    await user.save();
    const html = forgotPasswordEmailTemplate({
      firstName: user.firstName,
      otp,
    });

    // 6. Send OTP email
    await sendEmail({
      to: getEmailRecipient(user.emailId),
      subject: "DevCircle Password Reset OTP",
      text: `Hi ${user.firstName}, your password reset OTP is ${otp}. It expires in 5 minutes. If you didn't request this, please ignore this email.`,
      html
    });

    return res.status(200).json({
      message: "If an account exists with this email, an OTP will be sent.",
      emailId,
    });

  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request. Please try again later.",
    });
  }
};

module.exports = { forgotPasswordController };

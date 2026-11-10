const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");

const resetPasswordController = async (req, res) => {
  try {
    const { emailId, resetToken, newPassword } = req.body;

    if (!emailId || !resetToken || !newPassword) {
      return res.status(400).json({
        message: "Email, reset token and new password are required.",
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "Please enter a strong password.",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      emailId,
      resetPasswordTokenHash: resetTokenHash,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset token.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;
    user.resetPasswordTokenHash = null;
    user.resetPasswordTokenExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. Please log in with your new password.",
    });

  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Unable to reset password. Please try again later.",
    });
  }
};

module.exports = { resetPasswordController };

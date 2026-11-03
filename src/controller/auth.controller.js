
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const { loginService } = require('../utils/validation');
const User = require('../models/user');
const { generateEmailVerificationToken } = require('../utils/tokenUtils');
const { sendVerificationEmail } = require('../services/emailVerificationService');


const signUpController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      gender,
      skills,
      age,
      password,
      githubUrl,
      linkedinUrl,
      photoUrl,
      location,
    } = req.body;

    // 1. Check existing user
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Try a different email.",
      });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Generate verification token
    const { token, tokenHash } = generateEmailVerificationToken();

    // 4. Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      skills,
      age,
      password: passwordHash,
      githubUrl,
      linkedinUrl,
      photoUrl,
      location,

      isEmailVerified: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    });

    // 5. Save user
    const savedUser = await user.save();

    // 6. Send verification email
    try {
      await sendVerificationEmail(emailId, firstName, token);
    } catch (emailError) {
      console.error("Verification email failed:", emailError.message);

      return res.status(503).json({
        message: "Account created, but verification email could not be sent. Please try resending it.",
      });
    }

    // 7. Return response
    return res.status(201).json({
      message: "Account created successfully. Please check your email to verify your account.",
      data: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
        isEmailVerified: savedUser.isEmailVerified,
      },
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    console.error("Signup error:", err.message);

    return res.status(400).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

module.exports = { signUpController };


const loginController = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await loginService(emailId, password)
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }
    const token = await user.getJWT()
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      message: "Login successful"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}


module.exports = { loginController, signUpController }

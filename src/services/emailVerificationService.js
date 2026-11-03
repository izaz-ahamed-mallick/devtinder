const { sendEmail } = require("./emailService");
const verifyEmailTemplate = require("../templates/emails/verifyEmail");
const { getMaxListeners } = require("../models/user");
const getEmailRecipient = require("../utils/getEmailRecipient");
const welcomeEmailTemplate = require("../templates/emails/welcomeEmail");

const sendVerificationEmail = async (email, firstName, token) => {
  const verificationLink =
    `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const html = verifyEmailTemplate({
    firstName,
    verificationLink,
  });

  await sendEmail({
    to: getEmailRecipient(email),
    subject: "Verify your DevTinder email",
    text: `Hi ${firstName}, verify your email here: ${verificationLink}`,
    html,
  });
};

const sendWelcomeEmail = async (email, firstName) => {
  const html = welcomeEmailTemplate({ firstName });

  await sendEmail({
    to: getEmailRecipient(email),
    subject: "Welcome to DevTinder!",
    text: `Hi ${firstName}, your email has been verified successfully. Welcome to DevTinder!`,
    html,
  });
};

module.exports = { sendVerificationEmail,sendWelcomeEmail };

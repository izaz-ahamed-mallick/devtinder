
const crypto = require("crypto");


const generateSecureToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return { token, tokenHash };
};

const generateEmailVerificationToken = generateSecureToken;
const generatePasswordResetToken = generateSecureToken;

const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

module.exports = {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateOTP,
};
module.exports = {
  generateEmailVerificationToken,
  generateOTP,
  generatePasswordResetToken
};

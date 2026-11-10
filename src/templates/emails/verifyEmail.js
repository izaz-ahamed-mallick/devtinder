
const verifyEmailTemplate = ({ firstName, verificationLink }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify your DevCircle email</title>
      </head>

      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">

        <h2>Welcome to DevCircle!</h2>

        <p>Hi ${firstName},</p>

        <p>
          Thanks for signing up. Please verify your email address
          to activate your DevCircle account.
        </p>

        <a href="${verificationLink}"
          style="background: #2563eb; color: white;
          padding: 12px 24px; text-decoration: none;
          border-radius: 6px; display: inline-block;">
          Verify Email
        </a>

        <p>This verification link expires in 15 minutes.</p>

        <p>If you didn't create this account, please ignore this email.</p>

        <p>Thanks,<br>DevCircle Team</p>

      </body>
    </html>
  `;
};

module.exports = verifyEmailTemplate;

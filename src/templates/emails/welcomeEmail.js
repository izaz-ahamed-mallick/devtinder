
const welcomeEmailTemplate = ({ firstName }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Welcome to DevTinder</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to DevTinder, ${firstName}!</h2>

        <p>Your email has been successfully verified.</p>

        <p>Your DevTinder account is now active. 
        You can start connecting with developers, 
        building your network, and exploring opportunities.</p>

        <p>We're excited to have you here!</p>

        <p>Thanks,<br>DevTinder Team</p>
      </body>
    </html>
  `;
};

module.exports = welcomeEmailTemplate;

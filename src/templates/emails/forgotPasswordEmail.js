
const forgotPasswordEmailTemplate = ({ firstName, otp }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your DevCircle Password</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#111827; padding:28px 30px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:26px;">
                      Dev<span style="color:#60a5fa;">Tinder</span>
                    </h1>
                    <p style="margin:8px 0 0; color:#9ca3af; font-size:13px;">
                      Developer Networking Platform
                    </p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding:35px 30px; color:#374151;">

                    <h2 style="margin:0 0 15px; color:#111827; font-size:22px;">
                      Reset your password
                    </h2>

                    <p style="font-size:15px; line-height:24px;">
                      Hi ${firstName},
                    </p>

                    <p style="font-size:15px; line-height:24px;">
                      We received a request to reset your DevCircle account password.
                      Use the verification code below to continue.
                    </p>

                    <!-- OTP -->
                    <div style="margin:30px 0; padding:22px; background:#f3f4f6;
                      border:1px dashed #9ca3af; border-radius:10px; text-align:center;">

                      <p style="margin:0 0 12px; color:#6b7280; font-size:12px;
                        letter-spacing:2px; text-transform:uppercase;">
                        Your verification code
                      </p>

                      <h1 style="margin:0; color:#2563eb; font-size:36px;
                        letter-spacing:10px;">
                        ${otp}
                      </h1>

                    </div>

                    <p style="font-size:14px; line-height:22px; color:#4b5563;">
                      This code will expire in <strong>5 minutes</strong>.
                      For your security, do not share this code with anyone.
                    </p>

                    <p style="font-size:14px; line-height:22px; color:#4b5563;">
                      If you didn't request a password reset, you can safely ignore
                      this email. Your existing password will remain unchanged.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:22px 30px; background:#f9fafb; text-align:center;">
                    <p style="margin:0; color:#6b7280; font-size:12px;">
                      © ${new Date().getFullYear()} DevCircle. All rights reserved.
                    </p>
                    <p style="margin:8px 0 0; color:#9ca3af; font-size:11px;">
                      Connecting developers, building opportunities.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
};

module.exports = forgotPasswordEmailTemplate;

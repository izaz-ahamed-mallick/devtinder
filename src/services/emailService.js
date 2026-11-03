
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("../config/sesClient");

const sendEmail = async ({ to, subject, text, html }) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
        ...(html && {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        }),
      },
    },
  });

  const result = await sesClient.send(command);

  return result.MessageId;
};

module.exports = { sendEmail };

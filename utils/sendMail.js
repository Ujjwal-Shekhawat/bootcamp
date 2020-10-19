const nodemailer = require('nodemailer');

const sendMail = async (opts) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: `${process.env.SMTP_EMAIL}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });

  const info = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: opts.email,
    subject: opts.subject,
    text: opts.message,
  };

  const result = await transport.sendMail(info);

  console.log(result.messageId);
};

module.exports = sendMail;

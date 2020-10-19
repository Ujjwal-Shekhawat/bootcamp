const nodemailer = require('nodemailer');

const sendMail = async (opts) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'dd1f9267eee8d5',
      pass: '55c76f4f1bd672',
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

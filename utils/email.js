const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1)CREATE A TRANSPORTER
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //   2)DEFINE THE EMAIL OPTIONS

  const option = {
    from: 'naol m <naol@email.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //   3)SEND THE EMAIL
  await transport.sendMail(option);
};
module.exports = sendEmail;

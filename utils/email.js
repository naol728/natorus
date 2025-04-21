const nodemailer = require('nodemailer');
const htmltotext = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Naol Meseret <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USENAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    return transport;
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstname: this.firstName, url: this.url, subject },
    );
    const option = {
      from: this.from,
      to: this.to,
      subject,
      text: htmltotext.fromString(html),
    };

    await this.newTransport.sendMail(option);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the natorous family!');
  }
  async sendforgetpassword() {
    await this.send(
      'forgotePassword',
      'This  token is valid only for 10 minutes',
    );
  }
};

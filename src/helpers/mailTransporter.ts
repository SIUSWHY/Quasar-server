import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
class Mailer {
  private transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  async init() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: process.env.NODE_ENV === 'development' ? 'smtp.ethereal.email' : 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODE_ENV === 'development' ? testAccount.user : process.env.MAILER_USER, // generated ethereal user
        pass: process.env.NODE_ENV === 'development' ? testAccount.pass : process.env.MAILER_PASS, // generated ethereal password
      },
      from: '"Hermes Server" <info@hermes.server.com>',
    });
  }

  public async sendMessage(email: string, username: string, text: string, imgHref: string, stamp: Date) {
    if (!this.transporter) {
      throw new Error('NO TRANSPORTER');
    }

    const time = new Date(stamp);
    let minutes = time.getMinutes().toString();
    if (minutes.length !== 2) {
      minutes = '0' + minutes;
    }
    const _stamp = time.getHours() + ':' + minutes;

    const html = `
    <html>

<head>
  <style>
    .title {
      font-size: 28px;
      color: #3f4350 !important;
      font-weight: 600;
      text-align: center;
      font-family: 'Open Sans', sans-serif !important;
    }

    .container {
      padding: 32px !important;
      font-family: 'Roboto', sans-serif;
      background-color: #f3f3f3;
    }

    .card {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 24px;
      max-width: 600px;
      margin: 0px auto;
    }

    .subtitle {
      padding: 16px 24px;
      text-align: center;
      font-size: 16px;
      color: rgba(63, 67, 80, 0.64) !important;
    }

    .button {
      background-color: #1c58d9 !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 18px !important;
      color: #ffffff !important;
      padding: 15px 24px !important;
      border: none;
      border-radius: 5px;
      display: inline-block;
      /* margin: 0 11vw; */
      text-decoration: none;
    }

    .content-box {
      max-width: 552px;
      margin: 0px auto;
      background: #ffffff !important;
      box-sizing: border-box !important;
      padding: 32px !important;
    }

    .content {
      border-radius: 4px !important;
      border: 1px solid rgba(61, 60, 64, 0.08) !important;
      padding: 32px;
      display: flex;
    }

    .text-content {
      padding-left: 10px;
    }

    .btn-container {
      display: flex;
      justify-content: space-around;
    }

    .avatar {
      max-width: 32px;
      max-height: 32px;
      border-radius: 50%;
    }

    .username {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px !important;
      font-weight: 600;
      color: #3f4350 !important;
      padding-right: 5px;
    }

    .info-container {
      padding-bottom: 10px;
      display: flex;
      align-items: center;
    }

    .time-stamp {
      font-family: 'Open Sans', sans-serif;
      font-size: 12px !important;
      color: rgba(63, 67, 80, 0.56) !important;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <div>
        <div class="title">You have new messages</div>
        <div class="subtitle">See below for a summary of your new messages.</div>
        <div class="btn-container">
          <a href="https://hermes-server.online/" target="_blank" class="button">Open Hermes</a>
        </div>
      </div>
      <div class="content-box">
        <div class="content">
          <img class="avatar" alt="avatar" src=${imgHref}></img>
          <div class="text-content">
            <div class="info-container">
              <div class="username">${username}</div>
              <div class="time-stamp">${_stamp}</div>
            </div>
            <div>${text}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>`;

    const info = await this.transporter.sendMail({
      from: '"Hermes Server" <info@hermes.server.com>',
      to: email,
      subject: 'Hermes',
      html,
    });
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export default new Mailer();

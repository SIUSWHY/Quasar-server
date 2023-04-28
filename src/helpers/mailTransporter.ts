import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// let testAccount: Partial<nodemailer.TestAccount> = {};
// nodemailer.createTestAccount().then(account => {
//   testAccount = account;
// });

// const getTransporter = () =>
//   nodemailer.createTransport({
//     host: process.env.NODE_ENV === 'development' ? 'smtp.ethereal.email' : 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.NODE_ENV === 'development' ? testAccount.user : process.env.MAILER_USER, // generated ethereal user
//       pass: process.env.NODE_ENV === 'development' ? testAccount.pass : process.env.MAILER_PASS, // generated ethereal password
//     },
//     from: '"Hermes Server" <info@hermes.server.com>',
//   });

const getTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_USER, // generated ethereal user
    pass: process.env.MAILER_PASS, // generated ethereal password
  },
  from: '"Hermes Server" <info@hermes.server.com>',
});

export default getTransporter;

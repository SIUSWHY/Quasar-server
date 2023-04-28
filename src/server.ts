import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketLogic from './helpers/socket/index';
import { instrument } from '@socket.io/admin-ui';
import https from 'https';
import fs from 'fs';
import { loggerLogic } from './helpers/loggerLogic';
import additionalRoutes from './routes/index';
import cron from 'node-cron';
import { logger } from './helpers/logger';
import nodemailer from 'nodemailer';
import transporter from './helpers/mailTransporter';
import getTransporter from './helpers/mailTransporter';

async function run() {
  let credentials: { key: string; cert: string };
  if (process.env.NODE_ENV === 'development') {
    const privateKey = fs.readFileSync('./certificates/server.key', 'utf8');
    const certificate = fs.readFileSync('./certificates/server.crt', 'utf8');
    credentials = {
      key: privateKey,
      cert: certificate,
    };
  }

  const app = express();
  const httpServer = process.env.NODE_ENV === 'development' ? https.createServer(credentials, app) : createServer(app);

  const io = new Server(httpServer, {
    path: '/socket/',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    /* options */
  });
  const port = process.env.PORT || 3000;

  app.use(
    cors({
      origin: ['https://192.168.88.47:8080', 'https://hermes-server.online'],
      credentials: true,
    })
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  await mongoose
    .connect(
      `mongodb+srv://quasarapp.ebpoijk.mongodb.net/${
        process.env.NODE_ENV === 'development' ? 'Dev' : 'QuasarMobileApp'
      }?retryWrites=true&w=majority`,
      {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
      }
    )
    .then(() => {
      console.log('✅: Connection to the Atlas Cluster is successful!');
    })
    .catch(err => {
      logger.log({
        level: 'error',
        message: err,
      });
    });

  app.use(additionalRoutes);

  instrument(io, {
    auth: false,
  });

  socketLogic(io);

  cron.schedule('0 * * * *', () => loggerLogic(), { timezone: 'Europe/Moscow' });

  httpServer.listen(port, () =>
    console.log(`🔥: Example app listening on port ${port}!
  `)
  );

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Hermes Server" <info@hermes.server.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    // subject: 'Hello ✔', // Subject line
    // text: 'Hello world?', // plain text body
    html: `
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
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <div>
        <div class="title">You have new messages</div>
        <div class="subtitle">See below for a summary of your new messages.</div>
        <div class="btn-container">
          <a target="_blank" href="https://hermes-server.online/" class="button">Open Hermes</a>
        </div>
      </div>
      <div class="content-box">
        <div class="content">
          <img alt="avatar" src=""></img>
          <div class="text-content">
            <div>name</div>
            <div>text</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
    `, // html body
  });

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

run();

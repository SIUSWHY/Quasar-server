import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketLogic from './helpers/socket/index';
import { instrument } from '@socket.io/admin-ui';
import https from 'https';
import fs from 'fs';
import { loggerLogic } from './helpers/loggerLogic';
import cron from 'node-cron';
import { logger } from './helpers/logger';
import app from './app';

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

  instrument(io, {
    auth: false,
  });

  socketLogic(io);

  cron.schedule('0 * * * *', () => loggerLogic(), { timezone: 'Europe/Moscow' });

  httpServer.listen(port, () =>
    console.log(`🔥: Example app listening on port ${port}!
  `)
  );
}

run();

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
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    /* options */
  });
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  await mongoose
    .connect('mongodb+srv://quasarapp.ebpoijk.mongodb.net/QuasarMobileApp?retryWrites=true&w=majority', {
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    })
    .then(() => {
      console.log('✅: Connection to the Atlas Cluster is successful!');
    })
    .catch(err => console.error(err));

  app.use(additionalRoutes);

  instrument(io, {
    auth: false,
  });

  socketLogic(io);
  loggerLogic();

  httpServer.listen(port, () =>
    console.log(`🔥: Example app listening on port ${port}!
  `)
  );
}

run();

import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import LoginUser from './controllers/login'
import getUsers from './controllers/getUsers'
import getUser from './controllers/getUser'
import getUnreadMessagesCount from './controllers/getUnreadMessages'
import getCurrentUser from './controllers/getCurrentUser'
import getCompanion from './controllers/getCompanion'
import getRooms from './controllers/getRooms'
import socketLogic from './helpers/socket/index'
import SignUpUser from './controllers/signUpUser'
import { instrument } from '@socket.io/admin-ui'
import fs from 'fs'
import https from 'https'

async function run() {
  let credentials: { key: string; cert: string }
  if (process.env.NODE_ENV === 'development') {
    const privateKey = fs.readFileSync('./certificates/server.key', 'utf8')
    const certificate = fs.readFileSync('./certificates/server.crt', 'utf8')
    credentials = {
      key: privateKey,
      cert: certificate
    }
  }

  const app = express()
  const httpServer =
    process.env.NODE_ENV === 'development'
      ? https.createServer(credentials, app)
      : createServer(app)

  const io = new Server(httpServer, {
    cors: {
      origin: [
        'https://192.168.88.47:8080',
        'https://192.168.105.25:8080',
        'https://quasar-client.onrender.com',
        '*'
      ],
      methods: ['GET', 'POST']
    }
    /* options */
  })
  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.json())

  await mongoose
    .connect(
      'mongodb+srv://quasarapp.ebpoijk.mongodb.net/QuasarMobileApp?retryWrites=true&w=majority',
      {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS
      }
    )
    .then(() => {
      console.log('Connection to the Atlas Cluster is successful!')
    })
    .catch((err) => console.error(err))

  app.use([
    LoginUser,
    getUsers,
    getCurrentUser,
    getCompanion,
    getRooms,
    getUser,
    getUnreadMessagesCount,
    SignUpUser
  ])

  instrument(io, {
    auth: false
  })

  socketLogic(io)

  httpServer.listen(port, () =>
    console.log(`
  Example app listening on port ${port}!
  `)
  )
}

run()

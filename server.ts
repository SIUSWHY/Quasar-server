import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { createServer } from 'http'
import { Server } from 'socket.io'
import LoginUser from './controllers/login'
import getUsers from './controllers/getUsers'
import getCurrentUser from './controllers/getCurrentUser'
import modelRoom from './models/modelRoom'
import { MessageType, RoomType } from './types/roomType'

async function run() {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
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

  app.use([LoginUser, getUsers, getCurrentUser])

  io.on('connection', async (socket) => {
    let token: any = socket.handshake.query.token
    let user: any = jwt.verify(token, 'JWT_KEY')
    let chatType: any = socket.handshake.query.chatType
    let roomId: string = `${Date.now()}`
    let users_id: any = []
    let roomData: RoomType

    socket.on('companionId', async (data) => {
      roomData = {
        roomId: roomId,
        chatType: chatType,
        users_id: [user.user._id, data.companionId],
        messages: []
      }

      const room: RoomType[] = await modelRoom.find({
        $or: [
          {
            $and: [
              { users_id: [user.user._id, data.companionId] },
              { chatType: 'double' }
            ]
          },
          {
            $and: [
              { users_id: [data.companionId, user.user._id] },
              { chatType: 'double' }
            ]
          }
        ]
      })

      if (room.length !== 0) {
        socket.join(room[0].roomId)
        postMessageforUsers(room[0].roomId, room[0].messages)
      } else {
        await modelRoom.create(roomData)
        socket.join(roomData.roomId)
        postMessageforUsers(roomData.roomId, roomData.messages)
      }
    })

    console.log(`
    ${user.user.name} - connected`)

    socket.on('disconnecting', () => {
      console.log(socket.rooms)
    })

    socket.on('disconnect', () => {
      console.log(`${user.user.name} - disconnected`)
    })

    function postMessageforUsers(room_id: string, arrMessages: Array<object>) {
      socket.on('message', async (data) => {
        const message: MessageType = data.message

        // save to DB

        // const message = await Message.create()
        // const dataForSocket = adaptMessage(message)
        // io.to(roomId).emit('ok', dataForSocket)

        await modelRoom.updateOne(
          { roomId: room_id },
          { $push: { messages: message } }
        )

        io.to(room_id).emit('ok', { data })
      })
    }
  })

  httpServer.listen(port, () =>
    console.log(`
  Example app listening on port ${port}!
  `)
  )
}

run()

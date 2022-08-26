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
import { RoomType } from './types/roomType'
import modelMessage from './models/modelMessage'
import { MessageType } from './types/messageType'

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
        users_id: [user.user._id, data.companionId]
      }

      let room = await modelRoom.findOne({
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

      if (!room) {
        room = await modelRoom.create(roomData)
      }

      socket.join(room.roomId)
      postMessageforUsers(room.roomId)

      const messages = await modelMessage.find({
        roomId: room.roomId
      })

      socket.emit('join', {
        roomId: room.roomId,
        messages: messages
      })

      // socket.on('message', onSocketMessage)
    })

    console.log(`
    ${user.user.name} - connected`)

    socket.on('disconnecting', () => {
      console.log(socket.rooms)
    })

    socket.on('disconnect', () => {
      console.log(`${user.user.name} - disconnected`)
    })

    function postMessageforUsers(room_id: string) {
      socket.on('message', async (data) => {
        const message: MessageType = data.message
        console.log(message)

        // save to DB

        // const message = await Message.create()
        // const dataForSocket = adaptMessage(message)
        // io.to(roomId).emit('ok', dataForSocket)

        await modelMessage.create({
          roomId: room_id,
          stamp: message.stamp,
          messageText: message.messageText,
          userId: message.userId
        })
        // ;(await modelRoom.findById(room_id))?.messages0

        // await modelMessage.find({ roomId: room_id })

        io.to(room_id).emit('ok', { data })
      })
    }

    // function getRoom(room) {
    //   socket.emit('getRoom', room)
    // }
  })

  httpServer.listen(port, () =>
    console.log(`
  Example app listening on port ${port}!
  `)
  )
}

run()

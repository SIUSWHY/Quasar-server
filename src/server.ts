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
import getUser from './controllers/getUser'
import getUnreadMessagesCount from './controllers/getUnreadMessages'
import getCurrentUser from './controllers/getCurrentUser'
import modelRoom from './models/modelRoom'
import { RoomType } from './types/roomType'
import modelMessage from './models/modelMessage'
import { MessageType } from './types/messageType'
import getCompanion from './controllers/getCompanion'
import getRooms from './controllers/getRooms'
import { UserType } from './types/userType'
import modelUser from './models/modelUser'
import cryptPassword from './helpers/hashPassword'

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

  app.use([
    LoginUser,
    getUsers,
    getCurrentUser,
    getCompanion,
    getRooms,
    getUser,
    getUnreadMessagesCount,
    cryptPaasswords
  ])

  async function cryptPaasswords() {
    const users: UserType[] = await modelUser.find()
    const newUsers = await Promise.all(
      users.map(async (user) => {
        const newUserPassword = await cryptPassword(user.password)
        user.password = newUserPassword
        return user
      })
    )
    const json = JSON.stringify(newUsers)
    console.log(json)
  }

  // cryptPaasswords()

  const sockets = new Map<string, string>()

  io.on('connection', async (socket) => {
    let token: any = socket.handshake.query.token
    let { user } = jwt.verify(token, 'JWT_KEY') as { user: UserType }
    let chatType: any = socket.handshake.query.chatType
    let roomId: string
    let users_id: any = []
    let roomData: RoomType
    sockets.set(user._id, socket.id)

    socket.on('getRoomId', (data) => {
      roomId = data.roomId
    })

    socket.on('companionId', async (data) => {
      let room: RoomType

      if (roomId === undefined || null) {
        roomData = {
          roomId: `${Date.now()}`,
          chatType: chatType,
          users_id: [user._id, data.companionId]
        }

        console.log('roomData', roomData)

        room = await modelRoom.findOne({
          $and: [
            { users_id: user._id },
            { users_id: data.companionId },
            { chatType: 'double' }
          ]
        })

        if (!room) {
          room = await modelRoom.create(roomData)
        }
      } else {
        room = await modelRoom.findOne({ roomId: roomId })
      }

      socket.join(room.roomId)
      postMessageforUsers(room)

      const messages = await modelMessage.find({
        roomId: room.roomId
      })

      socket.emit('join', {
        room: room,
        messages: messages
      })

      // socket.on('message', onSocketMessage)
    })

    console.log(`
    ${user.name} - connected`)

    socket.on('disconnecting', () => {
      console.log(socket.rooms)
    })

    socket.on('disconnect', () => {
      console.log(`
      ${user.name} - disconnected`)
    })

    function postMessageforUsers(room: RoomType) {
      socket.on('message', async (data) => {
        const message: MessageType = data.message
        console.log(message)

        // save to DB

        // const message = await Message.create()
        // const dataForSocket = adaptMessage(message)
        // io.to(roomId).emit('ok', dataForSocket)

        await modelMessage.create({
          roomId: room.roomId,
          stamp: message.stamp,
          messageText: message.messageText,
          userId: message.userId,
          whoRead: message.whoRead
        })
        // ;(await modelRoom.findById(room_id))?.messages0

        // await modelMessage.find({ roomId: room_id })

        io.to(room.roomId).emit('ok', { data })

        room.users_id.forEach((userId) => {
          const userIdString = userId.toString()
          const socket_id = sockets.get(userIdString)
          console.log(socket_id, userIdString, sockets)

          if (userId === user._id) {
            return
          }

          io.to(socket_id).emit('newMessNotify', room.roomId)
        })
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

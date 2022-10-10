import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose, { ObjectId } from 'mongoose'
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
    getUnreadMessagesCount
  ])

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
      console.log('@getRoomId')
    })

    socket.on('companionId', async (data) => {
      let room: RoomType

      if (roomId === undefined || null) {
        roomData = {
          roomId: `${Date.now()}`,
          chatType: chatType,
          users_id: [user._id, data.companionId]
        }

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

    socket.on('getdataForGroup', async (data) => {
      const {
        groupName,
        groupImage,
        groupMembers,
        groupType
      }: {
        groupName: string
        groupImage: string
        groupMembers: ObjectId[]
        groupType: string
      } = data
      const group = await modelRoom.create({
        roomId: `${Date.now()}`,
        chatType: groupType,
        users_id: groupMembers,
        room_img: groupImage,
        room_name: groupName
      })
    })

    function postMessageforUsers(room: RoomType) {
      socket.on('message', async (data) => {
        const message: MessageType = data.message

        await modelMessage.create({
          roomId: room.roomId,
          stamp: message.stamp,
          messageText: message.messageText,
          userId: message.userId,
          whoRead: message.whoRead
        })

        io.to(room.roomId).emit('ok', { data })

        room.users_id.forEach((userId) => {
          const userIdString = userId.toString()
          const socket_id = sockets.get(userIdString)

          if (userId === user._id) {
            return
          }

          io.to(socket_id).emit('newMessNotify', room.roomId)
        })
      })
    }

    socket.on('disconnectRoom', () => {
      socket.rooms.forEach((room) => {
        socket.leave(room)
        console.log('leave room: ', room)
      })
      console.log(socket.rooms)
    })
  })

  httpServer.listen(port, () =>
    console.log(`
  Example app listening on port ${port}!
  `)
  )
}

run()

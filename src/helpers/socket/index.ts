import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import modelMessage from '../../models/modelMessage'
import { MessageType } from '../../types/messageType'
import modelRoom from '../../models/modelRoom'
import { RoomType } from '../../types/roomType'
import { UserType } from '../../types/userType'

function socketLogic(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  const clients = new Map<string, string>()

  io.on('connection', async (socket) => {
    let token: any = socket.handshake.query.token
    let chatType: any = socket.handshake.query.chatType
    let { user } = jwt.verify(token, 'JWT_KEY') as { user: UserType }
    let roomId: string
    let users_id: any = []
    let room: RoomType

    clients.set(user._id, socket.id)

    socket.on('get_room_id', (data) => {
      roomId = data.roomId
    })

    socket.on('get_companion_id', async (data) => {
      if (!Boolean(roomId)) {
        const roomData: RoomType = {
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

      const messages = await modelMessage.find({
        roomId: room.roomId
      })

      socket.emit('send_room_data_to_clent', {
        room: room,
        messages: messages
      })
    })

    socket.on('save_message_to_db', async (data) => {
      if (!room) {
        throw new Error('NO ROOM')
      }

      const message: MessageType = data.message

      await modelMessage.create({
        roomId: room.roomId,
        stamp: message.stamp,
        messageText: message.messageText,
        userId: message.userId,
        whoRead: message.whoRead
      })

      io.to(room.roomId).emit('sent_message_to_room', { data })

      room.users_id.forEach((userId) => {
        const userIdString = userId.toString()
        const socket_id = clients.get(userIdString)

        if (userIdString === user._id) {
          return
        }

        io.to(socket_id).emit('set_new_message_notify', room.roomId)
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

    socket.on('get_data_for_group', async (data) => {
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

    socket.on('disconnect_from_rooms', () => {
      socket.rooms.forEach((room) => {
        socket.leave(room)
        console.log('leave room: ', room)
      })
    })
  })
}

export default socketLogic

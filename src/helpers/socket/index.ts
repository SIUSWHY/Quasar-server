import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import modelMessage from '../../models/modelMessage'
import saveMessageToDb from './helpers/saveMessage'
import modelRoom from '../../models/modelRoom'
import { RoomType } from '../../types/roomType'
import { UserType } from '../../types/userType'
import createGroupRoom from './helpers/createGroupRoom'
import sendUserStatus from './helpers/sendUserStatus'

function socketLogic(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  const clients = new Map<string, string>()

  io.on('connection', async (socket) => {
    let token: any = socket.handshake.query.token
    let chatType: any = socket.handshake.query.chatType
    let { user } = jwt.verify(token, process.env.JWT_KEY) as { user: UserType }
    let room: RoomType = { roomId: '', chatType: '', users_id: [] }

    clients.set(user._id, socket.id)

    socket.on('get_room_id', (data) => {
      if (!Boolean(data.roomId)) {
        return
      }

      room.roomId = data.roomId
    })

    socket.on('get_companion_id', async (data) => {
      if (!Boolean(room.roomId)) {
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
        room = await modelRoom.findOne({ roomId: room.roomId })
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

      saveMessageToDb(data, room)

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

    socket.on('get_all_user_status', () => {
      const arrUsersStatus: { userId: string; isOnline: boolean }[] = []
      for (const userId of clients.keys()) {
        arrUsersStatus.push({ userId: userId, isOnline: true })
      }
      socket.emit('send_all_users_status', arrUsersStatus)
    })

    sendUserStatus(true, user, clients, io)

    socket.on('disconnecting', () => {
      sendUserStatus(false, user, clients, io)
    })

    socket.on('disconnect', () => {
      console.log(`
      ${user.name} - disconnected`)
    })

    socket.on('get_data_for_group', async (data) => {
      createGroupRoom(data)
    })
  })
}

export default socketLogic

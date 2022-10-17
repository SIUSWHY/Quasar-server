import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { UserType } from '../../../types/userType'

function sendUserStatus(
  status: boolean,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  user: UserType,
  clients: Map<string, string>,
  io: any
) {
  for (const socketId of clients.values()) {
    console.log([socket.id, socketId])
    if (socket.id === socketId) return

    io.to(socketId).emit('send_online_status', {
      userId: user._id,
      isOnline: status
    })
  }
}
export default sendUserStatus

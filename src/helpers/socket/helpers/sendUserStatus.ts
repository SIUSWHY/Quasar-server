import { UserType } from '../../../types/userType'

function sendUserStatus(
  status: boolean,
  user: UserType,
  clients: Map<string, string>,
  io: any
) {
  for (const socketId of clients.values()) {
    io.to(socketId).emit('send_online_status', {
      userId: user._id,
      isOnline: status
    })
  }
}
export default sendUserStatus

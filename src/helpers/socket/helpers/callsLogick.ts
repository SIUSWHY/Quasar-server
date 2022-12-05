import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserType } from "../../../types/userType";
import Call from '../../../models/modelCall'

async function callsLogick(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  clients: Map<string, string>,
  user: UserType) {
  socket.on('send_companion_id_for_call_to_server', (data) => {
    const socket_id = clients.get(data.companionId);
    io.to(socket_id).emit('send_notify_to_companion', { userId: user._id, peerId: data.peerId })

    socket.on('send_peer_id_to_server', (data: { peerId: string, userId: string }) => {
      io.to(data.userId).emit('send_peer_id_to_client', { peerId: data.peerId })
    })
  })

  socket.on('send_video_status', (data: { video: boolean, userId: string }) => {
    const socket_id = clients.get(data.userId);
    io.to(socket_id).emit('send_video_status_to_client', data.video)
  })

  socket.on('stop_call', (data: { userId: string }) => {
    const socket_id = clients.get(data.userId);
    io.to(socket_id).emit('send_stop_status_to_client')
  })

  socket.on('set_call_data', async (data: { userId: string, comUserId: string, timeOfStartCall: Date, timeOfEndCall: Date }) => {
    const call = await Call.create({ userId: data.userId, comUserId: data.comUserId, timeOfEndCall: data.timeOfEndCall, timeOfStartCall: data.timeOfStartCall })
    socket.emit('send_call_log', call)
    io.to(data.comUserId).emit('send_call_log_to_companion', call)

    console.log(call);
  })
}
export default callsLogick;

import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import modelMessage from '../../models/modelMessage';
import saveMessageToDb from './helpers/saveMessage';
import callsLogick from './helpers/callsLogick';
import modelRoom from '../../models/modelRoom';
import { RoomType } from '../../types/roomType';
import { UserType } from '../../types/userType';
import createGroupRoom from './helpers/createGroupRoom';
import sendUserStatus from './helpers/sendUserStatus';
import makeIdForRoom from './helpers/createIdString';
import loginUserByQr from './helpers/loginUserByQR';
import { MessageType } from '../../types/messageType';
import link_preview_generator from 'link-preview-generator';

function socketLogic(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  const clients = new Map<string, string>();

  io.on('connection', async socket => {
    let token: any = socket.handshake.query.token;
    let user: any;
    let room: RoomType;

    if (token === 'null') {
      socket.on('is_user_need_qr', async () => {
        let roomIdForAuthUser = makeIdForRoom(20);
        await socket.join(roomIdForAuthUser);

        socket.emit('send_room_data_to_clent', {
          socketId: roomIdForAuthUser,
        });
      });

      socket.on('send_data_for_auth_user_by_qr', async (data: { socketId: string; userData: UserType }) => {
        let token = await loginUserByQr(data);
        token = token;

        await socket.join(data.socketId);

        io.to(data.socketId).emit('send_user_token_to_socket', {
          token: token,
          roomId: data.socketId,
        });
      });

      socket.on('destroy_room_for_auth_qr', data => {
        socket.leave(data.roomId);
      });
    } else {
      user = jwt.verify(token, process.env.JWT_KEY) as UserType;
      room = { roomId: '', chatType: '', users_id: [] };

      clients.set(user._id, socket.id);

      socket.on('get_room_id', data => {
        console.log(data);

        if (!Boolean(data.roomId)) {
          return;
        }

        room.roomId = data.roomId;
      });

      socket.on('get_companion_id', async data => {
        if (!Boolean(room.roomId)) {
          const roomData: RoomType = {
            roomId: makeIdForRoom(20).toString(),
            chatType: 'double',
            users_id: [user._id, data.companionId],
          };

          room = await modelRoom.findOne({
            $and: [{ users_id: user._id }, { users_id: data.companionId }, { chatType: 'double' }],
          });

          if (!room) {
            room = await modelRoom.create(roomData);
          }
        } else {
          room = await modelRoom.findOne({ roomId: room.roomId });
        }

        socket.join(room.roomId);

        const messages = await modelMessage.find({
          roomId: room.roomId,
        });

        socket.emit('send_room_data_to_clent', {
          room: room,
          messages: messages,
        });
      });

      socket.on('save_message_to_db', async (data: { message: MessageType }) => {
        if (!room) {
          throw new Error('NO ROOM');
        }

        if (data.message.url) {
          const { title, description, img } = await link_preview_generator(data.message.url);
          const urlData = { title, description, img, url: data.message.url }

          const messText: string = data.message.messageText.pop()
          const text = messText.replace(urlData.url, '')

          saveMessageToDb(data, room, text, urlData);
          const message = { ...data.message, messageText: [text], urlData: urlData }

          io.to(room.roomId).emit('sent_message_to_room', { message });
        } else {
          saveMessageToDb(data, room,);
          io.to(room.roomId).emit('sent_message_to_room', { message: data.message });
        }



        room.users_id.forEach(userId => {
          const userIdString = userId.toString();
          const socket_id = clients.get(userIdString);

          if (userIdString === user._id) {
            return;
          }

          io.to(socket_id).emit('set_new_message_notify', room.roomId);
        });
      });

      console.log(`✅: ${user.name} - connected`);

      sendUserStatus(true, user, clients, io);

      socket.on('disconnecting', () => {
        sendUserStatus(false, user, clients, io);
      });

      socket.on('disconnect', () => {
        console.log(`❌: ${user.name} - disconnected`);
      });

      socket.on('get_data_for_group', async data => {
        createGroupRoom(data);
      });

      callsLogick(socket, io, clients, user);
    }
  });
}

export default socketLogic;

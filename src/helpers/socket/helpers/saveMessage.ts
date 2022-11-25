import { MessageType } from '../../../types/messageType';
import modelMessage from '../../../models/modelMessage';
import { RoomType } from '../../../types/roomType';

async function saveMessageToDb(data: { message: MessageType }, room: RoomType) {
  const message = data.message;

  await modelMessage.create({
    roomId: room.roomId,
    stamp: message.stamp,
    messageText: message.messageText,
    userId: message.userId,
    whoRead: message.whoRead,
  });
}
export default saveMessageToDb;

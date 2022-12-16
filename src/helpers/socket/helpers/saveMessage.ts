import { MessageType } from '../../../types/messageType';
import modelMessage from '../../../models/modelMessage';
import { RoomType } from '../../../types/roomType';


async function saveMessageToDb(data: { message: MessageType }, room: RoomType, text?: string, urlData?: {
  title: string;
  description: string;
  img: string;
  url: string;
}) {
  const message = data.message;

  if (urlData) {
    await modelMessage.create({
      roomId: room.roomId,
      stamp: message.stamp,
      messageText: [text],
      userId: message.userId,
      whoRead: message.whoRead,
      urlData: urlData
    });
  } else {
    await modelMessage.create({
      roomId: room.roomId,
      stamp: message.stamp,
      messageText: message.messageText,
      userId: message.userId,
      whoRead: message.whoRead,
    });
  }
}
export default saveMessageToDb;

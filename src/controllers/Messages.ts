import fs from 'fs';
import { s3 } from '../helpers/storage';
import Message from '../models/modelMessage';

const unreadMessagesCount = async function (
  req: {
    body: {
      currentUserId: string;
      roomId: string[];
    };
  },
  res: any
) {
  const companionUserData = req.body;
  const roomIds = req.body.roomId;

  const arrayCountUnreadMessages = await Promise.all(
    roomIds.map(async (roomId: string) => {
      const messCount: number = await Message.find({
        $and: [{ roomId: roomId }, { whoRead: { $ne: companionUserData.currentUserId } }],
      }).count();

      return { [roomId]: messCount };
    })
  );

  const result = Object.fromEntries(arrayCountUnreadMessages.map(obj => Object.entries(obj)[0]));

  res.json(result);
};

const readMessages = async function (
  req: {
    data: any;
    body: {
      roomId: string;
    };
  },
  _res: any
) {
  await Message.updateMany(
    {
      $and: [{ userId: { $ne: req.data._id } }, { roomId: req.body.roomId }],
    },
    { $push: { whoRead: req.data._id } }
  );
};

const attachFile = async function (req: any, res: any) {
  const img = fs.readFileSync(req.file!.path);

  const upload = await s3.Upload(
    {
      buffer: img,
    },
    '/attach/'
  );

  return res.status(200).send(upload.Location);
};

export { unreadMessagesCount, readMessages, attachFile };

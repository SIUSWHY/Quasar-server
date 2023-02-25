import { ObjectId } from 'mongoose';
import { RoomType } from '../types/roomType';
import { logger } from '../helpers/logger';
import Room from '../models/modelRoom';
import fs from 'fs';
import { s3 } from '../helpers/storage';

const s3_url = 'https://quasar-storage.storage.yandexcloud.net/avatars/';

const getRooms = async function (req: any, res: any) {
  const userId: ObjectId = req.body._id;
  const Rooms = await Room.find({ users_id: userId }).populate('users_id');

  res.json(Rooms);
};

const changeGroupImage = async function (req: any, res: any) {
  const { roomId }: { roomId: string } = req.body;

  const group: RoomType = await Room.findOne({ roomId });

  if (Boolean(group)) {
    try {
      const img = fs.readFileSync(req.file!.path);

      const upload = await s3.Upload(
        {
          buffer: img,
        },
        '/avatars/'
      );

      await s3.Remove('avatars/' + group.room_img.replace(s3_url, ''));

      const patchGroup = await Room.findOneAndUpdate({ roomId: roomId }, { room_img: upload.Location }, { new: true });

      logger.log({
        level: 'info',
        message: `Admin is change group avatar`,
      });

      res.send(patchGroup);
    } catch (err) {
      logger.log({
        level: 'error',
        message: err,
      });
    }
  }
};

const changeGroupName = async function (req: any, res: any) {
  const { newName, _id } = req.body;

  try {
    await Room.findByIdAndUpdate({ _id }, { room_name: newName }, { new: true });
    return res.status(200).send({ message: 'Group name changed' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { getRooms, changeGroupImage, changeGroupName };

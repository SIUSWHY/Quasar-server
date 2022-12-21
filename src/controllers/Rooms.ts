import { ObjectId } from 'mongoose';
import Room from '../models/modelRoom';

const getRooms = async function (req: any, res: any) {
  const userId: ObjectId = req.body._id;
  const Rooms = await Room.find({ users_id: userId }).populate('users_id');

  res.json(Rooms);
};

export { getRooms };

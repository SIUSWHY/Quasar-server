import Call from '../models/modelCall';
import { ObjectId } from 'mongoose';

const getCalls = async function (req: any, res: any) {
  const userId: ObjectId = req.body._id;
  const CallsLogs = await Call.find({
    $or: [{ comUserId: userId }, { userId }],
  });

  res.json(CallsLogs);
};

export { getCalls };

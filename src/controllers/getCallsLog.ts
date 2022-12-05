import express from 'express';
import { ObjectId } from 'mongoose';
import verifyToken from '../helpers/verifyToken';
import Call from '../models/modelCall';
const getCallsLogs = express.Router();

getCallsLogs.post('/getCallLogs', verifyToken, async (req: any, res: any, _next: any) => {
  const userId: ObjectId = req.body._id;

  const CallsLogs = await Call.find({
    $or: [
      { comUserId: userId },
      { userId }
    ]
  });

  res.json(CallsLogs);
});

export default getCallsLogs;

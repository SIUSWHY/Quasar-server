import { model, Schema } from 'mongoose';
import { CallType } from '../types/callType';

const CallSchema = new Schema<CallType>({
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  comUserId: { type: Schema.Types.ObjectId, ref: 'Users' },
  timeOfStartCall: Date,
  timeOfEndCall: Date
});

export default model<CallType>('Call', CallSchema);

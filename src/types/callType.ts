import { ObjectId } from "mongoose";

export interface CallType {
  userId: ObjectId;
  comUserId: ObjectId;
  timeOfStartCall: Date;
  timeOfEndCall: Date
}

import { model, ObjectId, Schema } from 'mongoose'
import { MessageType } from '../types/messageType'

const MessageSchema = new Schema<MessageType>({
  messageText: Array,
  stamp: Date,
  userId: String,
  roomId: String,
  whoRead: Array<ObjectId>
})

export default model<MessageType>('Message', MessageSchema)

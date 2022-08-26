import { model, Schema } from 'mongoose'
import { MessageType } from '../types/messageType'

const MessageSchema = new Schema<MessageType>({
  messageText: Array,
  stamp: String,
  userId: String,
  roomId: String
})

export default model<MessageType>('Message', MessageSchema)

import { model, Schema } from 'mongoose'
import { RoomType } from '../types/roomType'

//ItemCard Schema
const RoomSchema = new Schema<RoomType>({
  roomId: String,
  chatType: String,
  users_id: Array,
  messages: Array
})

export default model<RoomType>('Room', RoomSchema)

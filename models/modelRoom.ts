import { model, Schema } from 'mongoose'
import { RoomType } from '../types/roomType'

const RoomSchema = new Schema<RoomType>({
  roomId: String,
  chatType: String,
  users_id: Array
})

export default model<RoomType>('Room', RoomSchema)

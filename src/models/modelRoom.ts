import { model, Schema } from 'mongoose';
import { RoomType } from '../types/roomType';

const RoomSchema = new Schema<RoomType>({
  roomId: String,
  chatType: String,
  users_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  room_img: { type: String, default: '' },
  room_name: { type: String, default: '' },
  adminUserId: String,
});

export default model<RoomType>('Room', RoomSchema);

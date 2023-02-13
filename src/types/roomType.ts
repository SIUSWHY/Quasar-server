export interface RoomType {
  roomId: string;
  chatType: string;
  users_id: string[];
  room_name?: string;
  room_img?: string;
  adminUserId?: string;
}

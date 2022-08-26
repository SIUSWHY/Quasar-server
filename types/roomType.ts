export interface RoomType {
  roomId: string
  chatType: string
  users_id: string[]
  messages: MessageType[]
}
export interface MessageType {
  messageText: []
  stamp: string
  users_id: string
}

export interface MessageType {
  messageText: [];
  stamp: Date;
  userId: string;
  roomId: string;
  whoRead: [];
  url?: string
  urlData?: {
    title: string;
    description: string;
    img: string;
    url: string;
  }
}

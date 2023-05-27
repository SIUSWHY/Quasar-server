export interface MessageType {
  messageText: [];
  stamp: Date;
  userId: string;
  roomId: string;
  whoRead: [];
  type?: string;
  url?: string;
  urlData?: {
    title: string;
    description: string;
    img: string;
    url: string;
  };
  fileUrl?: string;
}

import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Message from '../models/modelMessage'
const readMessagesFromChat = express.Router()

readMessagesFromChat.post(
  '/readMessages',
  verifyToken,
  async (
    req: {
      data: any
      body: {
        roomId: string
      }
    },
    res: any,
    _next: any
  ) => {
    await Message.updateMany(
      {
        $and: [{ userId: { $ne: req.data._id } }, { roomId: req.body.roomId }]
      },
      { $push: { whoRead: req.data._id } }
    )
  }
)

export default readMessagesFromChat

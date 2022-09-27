import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Message from '../models/modelMessage'
const getUnreadMessagesCount = express.Router()

getUnreadMessagesCount.post(
  '/getUnreadMessagesCount',
  verifyToken,
  async (
    req: {
      body: {
        currentUserId: string
        roomId: string[]
      }
    },
    res: any,
    _next: any
  ) => {
    const companionUserData = req.body
    const roomIds = req.body.roomId

    const arrayCountUnreadMessages = await Promise.all(
      roomIds.map(async (roomId: string) => {
        const messCount: number = await Message.find({
          $and: [
            { roomId: roomId },
            { whoRead: { $ne: companionUserData.currentUserId } }
          ]
        }).count()

        return { [roomId]: messCount }
      })
    )

    const result = Object.fromEntries(
      arrayCountUnreadMessages.map((obj) => Object.entries(obj)[0])
    )

    res.json(result)
  }
)

export default getUnreadMessagesCount

import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Room from '../models/modelRoom'
const getRooms = express.Router()

getRooms.post(
  '/getRooms',
  verifyToken,
  async (req: any, res: any, _next: any) => {
    const userId = req.body._id
    console.log(userId)

    const Rooms = await Room.find({ users_id: userId })

    res.json(Rooms)
  }
)

export default getRooms

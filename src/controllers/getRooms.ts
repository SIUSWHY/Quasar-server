import express from 'express'
import { ObjectId } from 'mongoose'
import verifyToken from '../helpers/verifyToken'
import Room from '../models/modelRoom'
const getRooms = express.Router()

getRooms.post(
  '/getRooms',
  verifyToken,
  async (req: any, res: any, _next: any) => {
    const userId: ObjectId = req.body._id

    const Rooms = await Room.find({ users_id: userId }).populate('users_id')

    res.json(Rooms)
  }
)

export default getRooms

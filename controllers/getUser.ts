import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Users from '../models/modelUser'
import { UserType } from '../types/userType'
const getUser = express.Router()

getUser.post(
  '/getUser',
  verifyToken,
  async (req: any, res: any, _next: any) => {
    const userId: string = req.body
    console.log(userId)

    const User: UserType | null = await Users.findOne({
      _id: userId
    })
    res.json(User)
  }
)

export default getUser

import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Users from '../models/modelUser'
import { UserType } from '../types/userType'
const getUsers = express.Router()

getUsers.get('/users', verifyToken, async (req: any, res: any, _next: any) => {
  const auth = req.data
  const UsersList: UserType[] = await Users.find({
    _id: { $ne: auth._id }
  })
  res.json(UsersList)
})

export default getUsers

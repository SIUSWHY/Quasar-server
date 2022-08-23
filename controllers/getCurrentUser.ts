import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Users from '../models/modelUser'
import { UserType } from '../types/userType'
const getCurrentUser = express.Router()

getCurrentUser.get('/currentUser', verifyToken, async (req: any, res: any, _next: any) => {
  const auth = req.data.user
  const UsersList: UserType[] = await Users.find({
    _id: auth._id 
  })
  console.log(UsersList);
  
  res.json(UsersList)
})

export default getCurrentUser

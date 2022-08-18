import express from 'express'
import verifyToken from '../helpers/verifyToken'
import Users from '../models/modelUser'
import { UserType } from '../types/userType'
const getUsers = express.Router()

getUsers.get('/users', verifyToken, async (req, res, next) => {
  // const auth = req.user

  const UsersList: UserType[] = await Users
    .find
    //   {
    //   _id: { $ne: auth._id }
    // }
    ()
  res.json(UsersList)
})

export default getUsers

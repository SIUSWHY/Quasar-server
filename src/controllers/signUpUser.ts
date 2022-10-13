import User from '../models/modelUser'
import express from 'express'
import { UserType } from '../types/userType'
import cryptPassword from '../helpers/hashPassword'
import modelUser from '../models/modelUser'

const SignUpUser = express.Router()

SignUpUser.post('/signUpUser', async (req, res) => {
  const {
    phone,
    password,
    email,
    avatar,
    name
  }: {
    email: string
    phone: string
    name: string
    avatar: string
    password: string
  } = req.body

  const user: UserType = await User.findOne({
    $or: [{ phone }, { email }]
  })

  if (Boolean(user)) {
    res
      .status(409)
      .send({ message: 'This user already exists', type: 'warning' })
  } else {
    try {
      const cryptPass = await cryptPassword(password)
      const User = await modelUser.create({
        avatar,
        email,
        password: cryptPass,
        name,
        phone
      })

      res.send(User)
    } catch (err) {
      console.log(err)
    }
  }
})

export default SignUpUser

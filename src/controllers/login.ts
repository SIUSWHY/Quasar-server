import User from '../models/modelUser'
import express from 'express'
import bcrypt from 'bcryptjs'
import createToken from '../helpers/createToken'
import { UserType } from '../types/userType'
const LoginUser = express.Router()

LoginUser.post('/loginUser', async (req, res) => {
  try {
    const { name, password }: { name: string; password: string } = req.body
    const user: UserType = await User.findOne({
      $and: [{ name }, { password }]
    })

    // const isPasswordValid: Promise<boolean> = bcrypt.compare(
    //   password,
    //   user.password
    // )

    // if (!isPasswordValid) {
    //   return res
    //     .status(400)
    //     .send({ message: 'Invalid password', type: 'negative' })
    // }
    if (user !== null) {
      const token = createToken({
        user
      })
      return res
        .status(200)
        .send({ massege: 'You login. Welcome', user, token })
    }
    return res.status(400).send({ message: 'User not found', type: 'negative' })
  } catch (error) {
    console.log(error)
  }
})

export default LoginUser
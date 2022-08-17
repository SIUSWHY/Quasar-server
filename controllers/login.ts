import User from '../models/modelUser'
import express from 'express'
import createToken from '../helpers/createToken'
const LoginUser = express.Router()

LoginUser.post('/loginUser', async (req, res) => {
  try {
    const { name, password } = req.body
    const user = await User.findOne({ $and: [{ name }, { password }] })
    const token = createToken({
      user
    })
    return res.status(200).send({ massege: 'You login. Welcome', user, token })
  } catch (error) {
    return error.status(400)
  }
})

export default LoginUser

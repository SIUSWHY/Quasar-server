import User from '../models/modelUser'
import express from 'express'
import createToken from '../helpers/createToken'
const LoginUser = express.Router()

LoginUser.post('/loginUser', async (req, res) => {
  try {
    const { name, password } = req.body
    const user = await User.findOne({ $and: [{ name }, { password }] })
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

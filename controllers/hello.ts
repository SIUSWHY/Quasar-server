import express from 'express'
const Hello = express.Router()

Hello.get('/users', async (req, res, next) => {
  res.send('Hello')
})

export default Hello

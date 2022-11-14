import express from 'express'
import webpush from 'web-push'
const subNotifications = express.Router()

const publicVapidKey = process.env.PUB_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

subNotifications.post(
  '/subNotifications',
  async (req: any, res: any, _next: any) => {
    const subscription = req.body

    // Send 201 - resource created
    res.status(201).json({})

    // Create payload
    const payload = JSON.stringify({ title: 'Push Test' })

    // Pass object into sendNotification
    webpush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err))
  }
)

export default subNotifications

import jwt from 'jsonwebtoken'

function verifyToken(req: any, _res: any, next: any) {
  // try {
  let token = req.headers.authorization.split(' ').pop()
  // verify a token symmetric - synchronous
  let decoded = jwt.verify(token, 'JWT_KEY')
  req.user = decoded
  next()
  // } catch (error) {
  //   return res.status(403).send({
  //     errors: [error.message]
  //   })
  // }
}

export default verifyToken

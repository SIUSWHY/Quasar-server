import jwt from 'jsonwebtoken'

function verifyToken(req: any, _res: any, next: any) {
  let token = req.headers.authorization.split(' ').pop()

  // verify a token symmetric - synchronous
  let decoded = jwt.verify(token, 'JWT_KEY')

  req.data = decoded
  next()
}

export default verifyToken

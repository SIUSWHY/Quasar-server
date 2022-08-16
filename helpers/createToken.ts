import jwt from 'jsonwebtoken'

function createToken(user: any) {
  const token: string = jwt.sign(user, 'JWT_KEY')
  return token
}

export default createToken

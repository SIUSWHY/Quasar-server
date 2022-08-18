import jwt from 'jsonwebtoken'

function verifyToken(req: any, _res: any, next: any) {
  let token = req.headers.authorization.split(' ').pop()
  const currentUser = jwt.verify(token, 'JWT_KEY')
  console.log(token, currentUser)
  next()
  // try {
  //   let token = req.headers.Authorization.split(' ').pop()
  //   console.log(token)

  //   // verify a token symmetric - synchronous
  //   let decoded = jwt.verify(token, 'JWT_KEY')

  //   req.user = decoded

  //   console.log(decoded) // bar
  //   next()
  // } catch (error) {
  //   return res.status(403).send({
  //     errors: [error.message]
  //   })
  // }
}

export default verifyToken

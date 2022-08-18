// import jwt from 'jsonwebtoken'

function verifyToken(req: any, _res: any, next: any) {
  let token = req.headers.authorization
  let token2 = req.headers
  console.log(token)
  console.log(token2)
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

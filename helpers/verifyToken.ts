// import jwt from 'jsonwebtoken'

function verifyToken(
  req: { headers: { Authorization: string } },
  res: any,
  next: any
) {
  let token = req.headers.Authorization.split(' ').pop()
  console.log(token)
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

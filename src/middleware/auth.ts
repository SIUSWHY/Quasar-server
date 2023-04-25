import jwt from 'jsonwebtoken';

function authMiddleware(req: any, res: any, next: any) {
  let token = req.headers.cookie?.split('=').pop();

  // verify a token symmetric - synchronous
  jwt.verify(token, process.env.JWT_KEY, (err: any, decoded: string) => {
    if (err) {
      res.status(401).send(err.message);
    } else {
      req.data = decoded;
      next();
    }
  });
}

export default authMiddleware;

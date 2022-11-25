import express from 'express';
import verifyToken from '../helpers/verifyToken';
import Users from '../models/modelUser';
import { UserType } from '../types/userType';
const getCurrentUser = express.Router();

getCurrentUser.get('/currentUser', verifyToken, async (req: any, res: any, _next: any) => {
  const auth = req.data;
  const CurrentUser = await Users.findOne({
    _id: auth._id,
  });

  res.json(CurrentUser);
});

export default getCurrentUser;

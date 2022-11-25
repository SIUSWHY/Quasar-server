import express from 'express';
import verifyToken from '../helpers/verifyToken';
import Users from '../models/modelUser';
const getCompanion = express.Router();

getCompanion.post('/getCompanion', verifyToken, async (req: any, res: any, _next: any) => {
  const companionUserData = req.body;
  console.log(companionUserData);

  const Companion = await Users.findOne(companionUserData);

  res.json(Companion);
});

export default getCompanion;

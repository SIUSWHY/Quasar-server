import express from 'express';
import Users from '../models/modelUser';
import { UserType } from '../types/userType';
const getUsers = express.Router();

getUsers.get('/users', async (req, res, next) => {
  const UsersList: UserType[] = await Users.find();
  res.json(UsersList);
});

export default getUsers;

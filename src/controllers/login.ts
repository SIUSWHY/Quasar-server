import User from '../models/modelUser';
import express from 'express';
import bcrypt from 'bcryptjs';
import createToken from '../helpers/createToken';
import { UserType } from '../types/userType';
import { logger } from '../helpers/logger';
const LoginUser = express.Router();

LoginUser.post('/loginUser', async (req, res) => {
  try {
    const { name, password }: { name: string; password: string } = req.body;

    const user: UserType = await User.findOne({
      $or: [{ phone: name }, { email: name }],
    });
    if (!Boolean(user)) {
      res.status(400).send({ message: `We can't find user`, type: 'negative' });
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid password', type: 'negative' });
    }

    if (user !== null) {
      const { name, email, phone, _id } = user;
      const token = createToken({
        name,
        email,
        phone,
        _id,
      });

      logger.log({
        level: 'info',
        message: `User ${user.name}:[_id:${user._id}] is signIn`,
      });

      return res.status(200).send({ message: 'You login. Welcome', user, token });
    }
    return res.status(400).send({ message: 'User not found', type: 'negative' });
  } catch (error) {
    logger.log({
      level: 'error',
      message: error,
    });
  }
});

export default LoginUser;

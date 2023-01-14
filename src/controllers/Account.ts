import createToken from '../helpers/createToken';
import User from '../models/modelUser';
import bcrypt from 'bcryptjs';
import { UserType } from '../types/userType';
import fs from 'fs';
import { logger } from '../helpers/logger';
import cryptPassword from '../helpers/hashPassword';
import { s3 } from '../helpers/storage';
import modelUser from '../models/modelUser';

const login = async function (req: any, res: any) {
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
};

const signUp = async function (req: any, res: any) {
  const {
    phone,
    password,
    email,
    name,
  }: {
    email: string;
    phone: string;
    name: string;
    password: string;
  } = req.body;

  const user: UserType = await User.findOne({
    $or: [{ phone }, { email }],
  });

  if (Boolean(user)) {
    res.status(409).send({ message: 'This phone or email already exists', type: 'warning' });
  } else {
    try {
      const cryptPass = await cryptPassword(password);
      const img = fs.readFileSync(req.file!.path);

      const upload = await s3.Upload(
        {
          buffer: img,
        },
        '/avatars/'
      );

      const User = await modelUser.create({
        avatar: upload.Location,
        email,
        password: cryptPass,
        name,
        phone,
      });

      logger.log({
        level: 'info',
        message: `User ${User.name}:[_id:${User._id}] is signUp`,
      });

      res.send(User);
    } catch (err) {
      logger.log({
        level: 'error',
        message: err,
      });
    }
  }
};

const deleteAccount = async function (req: any, res: any) {
  const { _id } = req.body;
  try {
    const user: UserType = await User.findOne({ _id });
    await s3.Remove('avatars/' + user.avatar);
    await User.deleteOne({ _id });

    logger.log({
      level: 'info',
      message: `User ${user.name}:[_id:${user._id}] is delete account`,
    });

    return res.status(200).send({ message: 'Your account deleted' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { login, signUp, deleteAccount };

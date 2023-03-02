import createToken from '../helpers/createToken';
import User from '../models/modelUser';
import bcrypt from 'bcryptjs';
import { UserType } from '../types/userType';
import fs from 'fs';
import { logger } from '../helpers/logger';
import cryptPassword from '../helpers/hashPassword';
import { s3 } from '../helpers/storage';
import modelUser from '../models/modelUser';

const s3_url = 'https://quasar-storage.storage.yandexcloud.net/avatars/';

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

const changeUserTheme = async function (req: any, res: any) {
  const { _id, value }: { _id: string; value: boolean } = req.body;

  try {
    await User.findByIdAndUpdate({ _id }, { isDarkMode: value }, { new: true });
    return res.status(200).send({ message: 'Your theme change' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const changeUserAvatar = async function (req: any, res: any) {
  const { id }: { id: string } = req.body;

  const user: UserType = await User.findOne({
    _id: id,
  });

  if (Boolean(user)) {
    try {
      const img = fs.readFileSync(req.file!.path);

      const upload = await s3.Upload(
        {
          buffer: img,
        },
        '/avatars/'
      );

      await s3.Remove('avatars/' + user.avatar.replace(s3_url, ''));

      const patchUser = await User.findByIdAndUpdate({ _id: id }, { avatar: upload.Location }, { new: true });

      logger.log({
        level: 'info',
        message: `User ${user.name}:[_id:${user._id}] change avatar`,
      });

      res.send(patchUser);
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
    await s3.Remove('avatars/' + user.avatar.replace(s3_url, ''));
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

const changeDefaultTeam = async function (req: any, res: any) {
  const { _id, teamId } = req.body;

  try {
    await User.findByIdAndUpdate({ _id }, { defaultTeam: teamId });

    return res.status(200).send({ message: 'Change default team' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { login, signUp, deleteAccount, changeUserAvatar, changeUserTheme, changeDefaultTeam };

import User from '../models/modelUser';
import express from 'express';
import { UserType } from '../types/userType';
import cryptPassword from '../helpers/hashPassword';
import { s3 } from '../helpers/storage';
import modelUser from '../models/modelUser';
import multer from 'multer';
import fs from 'fs';

const SignUpUser = express.Router();

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'src/assets/')
  // },
  // filename: function (req, file, cb) {
  //   const mime = file.mimetype.split('/').pop()
  //   cb(null, file.fieldname + '-' + Date.now() + '.' + mime)
  // }
});

const upload = multer({ storage: storage });

SignUpUser.post('/signUpUser', upload.single('avatar'), async (req, res) => {
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

      res.send(User);
    } catch (err) {
      console.log(err);
    }
  }
});

export default SignUpUser;

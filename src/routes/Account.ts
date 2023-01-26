import express from 'express';
import * as AccountController from '../controllers/Account';
import multer from 'multer';

const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
const accountRoutes = express.Router();

accountRoutes.post('/signIn', AccountController.login);
accountRoutes.post('/signUp', upload.single('avatar'), AccountController.signUp);
accountRoutes.post('/delete', AccountController.deleteAccount);

export default accountRoutes;

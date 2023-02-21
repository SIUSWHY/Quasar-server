import express from 'express';
import * as AccountController from '../controllers/Account';
import multerMiddleware from '../middleware/uploadSingleFile';

const accountRoutes = express.Router();

accountRoutes.post('/signIn', AccountController.login);
accountRoutes.post('/signUp', multerMiddleware('avatar'), AccountController.signUp);
accountRoutes.patch('/changeUserAvatar', multerMiddleware('avatar'), AccountController.changeUserAvatar);
accountRoutes.patch('/changeUserTheme', AccountController.changeUserTheme);
accountRoutes.post('/delete', AccountController.deleteAccount);

export default accountRoutes;

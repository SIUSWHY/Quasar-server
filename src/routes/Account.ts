import express from 'express';
import * as AccountController from '../controllers/Account';
import multerMiddleware from '../middleware/uploadSingleFile';
import authMiddleware from '../middleware/auth';

const accountRoutes = express.Router();

accountRoutes.post('/signIn', AccountController.login);
accountRoutes.post('/signUp', multerMiddleware('avatar'), AccountController.signUp);
accountRoutes.patch(
  '/changeUserAvatar',
  authMiddleware,
  multerMiddleware('avatar'),
  AccountController.changeUserAvatar
);
accountRoutes.patch('/changeUserTheme', authMiddleware, AccountController.changeUserTheme);
accountRoutes.patch('/changeDefaultTeam', authMiddleware, AccountController.changeDefaultTeam);
accountRoutes.patch('/changeDefaultLocale', authMiddleware, AccountController.changeDefaultLocale);
accountRoutes.post('/delete', authMiddleware, AccountController.deleteAccount);

export default accountRoutes;

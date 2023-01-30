import express from 'express';
import * as AccountController from '../controllers/Account';
import multerMiddleware from '../middleware/uploadSingleFile'

const accountRoutes = express.Router();


accountRoutes.post('/signIn', AccountController.login);
accountRoutes.post('/signUp', multerMiddleware('avatar'), AccountController.signUp);

export default accountRoutes;

import express from 'express';
import * as AccountController from '../controllers/Account';

const accountRoutes = express.Router();

accountRoutes.post('/signIn', AccountController.login);
accountRoutes.get('/signUp', AccountController.signUp);

export default accountRoutes;

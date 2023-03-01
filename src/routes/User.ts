import express from 'express';
import * as UserController from '../controllers/User';

const userRoutes = express.Router();

userRoutes.get('/', UserController.user);
userRoutes.post('/all', UserController.allUsers);
userRoutes.get('/current', UserController.currentUser);
userRoutes.post('/companion', UserController.companion);

export default userRoutes;

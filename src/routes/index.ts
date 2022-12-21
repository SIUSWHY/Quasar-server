import { Router } from 'express';
import verifyToken from '../helpers/verifyToken';
import UserRoutes from './User';

const routes = Router();

routes.use('/user', verifyToken, UserRoutes);

export default routes;

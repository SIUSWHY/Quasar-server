import { Router } from 'express';
import verifyToken from '../helpers/verifyToken';
import UserRoutes from './User';
import AccountRoutes from './Account'

const routes = Router();

routes.use('/user', verifyToken, UserRoutes);
routes.use('/account', AccountRoutes);

export default routes;

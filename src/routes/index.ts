import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import UserRoutes from './User';
import AccountRoutes from './Account'
import MessagesRotes from './Messages';
import RoomRotes from './Room';
import CallRotes from './Calls';
import HealthRotes from './Health';

const routes = Router();

routes.use('/user', authMiddleware, UserRoutes);
routes.use('/message', authMiddleware, MessagesRotes);
routes.use('/room', authMiddleware, RoomRotes);
routes.use('/call', authMiddleware, CallRotes);
routes.use('/account', AccountRoutes);
routes.use('/', HealthRotes);

export default routes;

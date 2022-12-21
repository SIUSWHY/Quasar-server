import { Router } from 'express';
import verifyToken from '../helpers/verifyToken';
import UserRoutes from './User';
import AccountRoutes from './Account'
import MessagesRotes from './Messages';
import RoomRotes from './Room';

const routes = Router();

routes.use('/user', verifyToken, UserRoutes);
routes.use('/message', verifyToken, MessagesRotes);
routes.use('/room', verifyToken, RoomRotes);
routes.use('/account', AccountRoutes);

export default routes;

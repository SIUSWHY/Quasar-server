import { Router } from 'express';
import verifyToken from '../helpers/verifyToken';
import UserRoutes from './User';
import AccountRoutes from './Account'
import MessagesRotes from './Messages';
import RoomRotes from './Room';
import CallRotes from './Calls';

const routes = Router();

routes.use('/user', verifyToken, UserRoutes);
routes.use('/message', verifyToken, MessagesRotes);
routes.use('/room', verifyToken, RoomRotes);
routes.use('/call', verifyToken, CallRotes);
routes.use('/account', AccountRoutes);

export default routes;

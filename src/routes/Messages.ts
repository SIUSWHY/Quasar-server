import express from 'express';
import * as MessageController from '../controllers/Messages';

const messagesRoutes = express.Router();

messagesRoutes.post('/unreadCount', MessageController.unreadMessagesCount);
messagesRoutes.post('/read', MessageController.readMessages);

export default messagesRoutes;

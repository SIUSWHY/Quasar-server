import express from 'express';
import authMiddleware from '../middleware/auth';
import * as MessageController from '../controllers/Messages';
import multerMiddleware from '../middleware/uploadSingleFile';

const messagesRoutes = express.Router();

messagesRoutes.post('/unreadCount', MessageController.unreadMessagesCount);
messagesRoutes.post('/read', MessageController.readMessages);
messagesRoutes.post('/attachFile', authMiddleware, multerMiddleware('avatar'), MessageController.attachFile);

export default messagesRoutes;

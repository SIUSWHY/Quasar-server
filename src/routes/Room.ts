import express from 'express';
import multerMiddleware from '../middleware/uploadSingleFile';
import * as RoomController from '../controllers/Rooms';

const roomRoutes = express.Router();

roomRoutes.post('/all', RoomController.getRooms);
roomRoutes.patch('/changeGroupImage', multerMiddleware('avatar'), RoomController.changeGroupImage);

export default roomRoutes;

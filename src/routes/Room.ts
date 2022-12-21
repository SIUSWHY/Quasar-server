import express from 'express';
import * as RoomController from '../controllers/Rooms';

const roomRoutes = express.Router();

roomRoutes.post('/all', RoomController.getRooms);

export default roomRoutes;

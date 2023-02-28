import express from 'express';
import multerMiddleware from '../middleware/uploadSingleFile';
import * as TeamController from '../controllers/Team';

const roomRoutes = express.Router();

roomRoutes.post('/create', multerMiddleware('avatar'), TeamController.createTeam);

export default roomRoutes;

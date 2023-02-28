import express from 'express';
import multerMiddleware from '../middleware/uploadSingleFile';
import * as TeamController from '../controllers/Team';

const roomRoutes = express.Router();

roomRoutes.post('/create', multerMiddleware('avatar'), TeamController.createTeam);
roomRoutes.patch('/join', TeamController.joinToTeam);
roomRoutes.post('/all', TeamController.getTeams);

export default roomRoutes;

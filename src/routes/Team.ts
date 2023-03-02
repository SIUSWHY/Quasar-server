import express from 'express';
import multerMiddleware from '../middleware/uploadSingleFile';
import * as TeamController from '../controllers/Team';

const teamRoutes = express.Router();

teamRoutes.post('/create', multerMiddleware('avatar'), TeamController.createTeam);
teamRoutes.patch('/join', TeamController.joinToTeam);
teamRoutes.post('/all', TeamController.getTeams);
teamRoutes.patch('/changeAvatar', multerMiddleware('avatar'), TeamController.changeTeamAvatar);
teamRoutes.patch('/changeName', TeamController.changeTeamName);
teamRoutes.post('/deleteUser', TeamController.deleteUserFromTeam);

export default teamRoutes;

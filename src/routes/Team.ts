import express from 'express';
import multerMiddleware from '../middleware/uploadSingleFile';
import * as TeamController from '../controllers/Team';
import authMiddleware from '../middleware/auth';

const teamRoutes = express.Router();

teamRoutes.post('/create', multerMiddleware('avatar'), TeamController.createTeam);
teamRoutes.patch('/join', TeamController.joinToTeam);
teamRoutes.post('/all', authMiddleware, TeamController.getTeams);
teamRoutes.patch('/changeAvatar', authMiddleware, multerMiddleware('avatar'), TeamController.changeTeamAvatar);
teamRoutes.patch('/changeName', authMiddleware, TeamController.changeTeamName);
teamRoutes.post('/deleteUser', authMiddleware, TeamController.deleteUserFromTeam);
teamRoutes.post('/deleteTeam', authMiddleware, TeamController.deleteTeam);

export default teamRoutes;

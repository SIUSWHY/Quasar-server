import express from 'express';
import * as HealthController from '../controllers/Health';

const healthRoutes = express.Router();

healthRoutes.get('/', HealthController.getHealth);

export default healthRoutes;

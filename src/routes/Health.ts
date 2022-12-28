import express from 'express';
import * as HealthController from '../controllers/Health';

const callHealth = express.Router();

callHealth.post('/', HealthController.getHealth);

export default callHealth;

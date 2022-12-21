import express from 'express';
import * as CallController from '../controllers/Calls';

const callRoutes = express.Router();

callRoutes.post('/all', CallController.getCalls);

export default callRoutes;

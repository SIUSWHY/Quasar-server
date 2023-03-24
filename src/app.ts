import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import additionalRoutes from './routes/index';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(additionalRoutes);

export default app;

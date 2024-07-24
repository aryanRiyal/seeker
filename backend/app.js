import { LOGGER } from './utils/logger.js';
import { config } from 'dotenv';
import express from 'express';
import jobRouter from './routes/jobRoutes.js';
import userRouter from './routes/userRoutes.js';
import applicationRouter from './routes/applicationRoutes.js';
import { connectDB } from './database/dbConnection.js';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

LOGGER.DEBUG('starting ./app.js');

LOGGER.DEBUG('Configuring dotenv in app.js');
config({ path: './config/config.env' });

LOGGER.DEBUG('Initializing Express app');
const app = express();

LOGGER.DEBUG('Initializing loggerMiddleware');
app.use(loggerMiddleware);

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/'
    })
);

LOGGER.DEBUG('Registering routes');
app.use('/api/v1/user', userRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/job', jobRouter);

LOGGER.DEBUG('Connecting to the database');
connectDB();

LOGGER.DEBUG('Applying error middleware');
app.use(errorMiddleware);

export default app;
LOGGER.DEBUG('exporting default app');

import { LOGGER } from './utils/logger.js';
import cloudinary from 'cloudinary';
import app from './app.js';
import { closeDB } from './database/dbConnection.js';

LOGGER.DEBUG('starting ./server.js');

LOGGER.DEBUG('Configuring Cloudinary');
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});

const PORT = process.env.PORT || 4444;
const server = app.listen(PORT, () => {
    LOGGER.INFO(`Server Running on PORT ${PORT}`);
});

let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('\n');
    LOGGER.NOTICE(`${signal} received: closing HTTP Server`);

    server.close(async () => {
        try {
            await closeDB();
            LOGGER.INFO('HTTP server closed');
            process.exit(0);
        } catch (err) {
            LOGGER.ERROR('Error during shutdown', err);
            process.exit(1);
        }
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

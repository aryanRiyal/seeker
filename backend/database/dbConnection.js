import { LOGGER } from '../utils/logger.js';
import mongoose from 'mongoose';

LOGGER.DEBUG('starting ./database/dbConnections.js');

const connectDB = () => {
    LOGGER.DEBUG('using - connectDB()');
    const mongoURI = process.env.MONGO_URI_LOCAL;
    // const mongoURI = process.env.MONGO_URI_ATLAS;
    if (!mongoURI) {
        LOGGER.ERROR('Mongo URI is not defined in the environment variables');
        throw new Error('Mongo URI is not defined in the environment variables');
    }
    mongoose
        .connect(mongoURI, {
            dbName: 'MERN_JOB_SEEKER'
        })
        .then(() => {
            LOGGER.INFO('Connected to MongoDB!');
        })
        .catch((err) => {
            LOGGER.ERROR(`Error connecting to MongoDB: ${err}`);
        });
};

mongoose.connection.on('connected', () => {
    LOGGER.INFO('Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    LOGGER.ERROR('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    LOGGER.NOTICE('Mongoose disconnected from MongoDB');
});

const closeDB = async () => {
    LOGGER.DEBUG('using - closeDB()');
    await mongoose.connection
        .close()
        .then(() => {
            LOGGER.INFO('MongoDB connection closed');
        })
        .catch((err) => {
            LOGGER.ERROR('Error closing MongoDB connection:', err.message);
        });
};

export { connectDB, closeDB };
LOGGER.DEBUG('exporting connectDB and closeDB');

// const closeDB = function () {
//         console.log('using - closeDB()');
//     try {
//         await mongoose.connection.close();
//         console.log('MongoDB  connection closed!');
//     } catch (err) {
//         console.error('Error closing MongoDB connection:', err.message);
//     }
// };

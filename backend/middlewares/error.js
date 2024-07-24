import { LOGGER } from '../utils/logger.js';

LOGGER.DEBUG('starting ./middlewares/error.js');

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = function (err, req, res, next) {
    LOGGER.DEBUG('using - errorMiddleware()');
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    if (err.name === 'CaseError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is Invalid, Try again!`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === 'TokenExpiredError') {
        const message = `Json Web Token is Expired, Try again!`;
        err = new ErrorHandler(message, 400);
    }
    LOGGER.ERROR(`Response(${err.statusCode}): ${err.message}`);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
LOGGER.DEBUG('exporting errorMiddleware');
export default ErrorHandler;
LOGGER.DEBUG('exporting default ErrorHandler');

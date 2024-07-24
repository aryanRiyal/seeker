import { LOGGER } from '../utils/logger.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from './error.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

LOGGER.DEBUG('starting ./middlewares/auth.js');

export const isAuthenticated = catchAsyncError(async function (req, res, next) {
    LOGGER.DEBUG('using - isAuthenticated');
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Authentication failed!', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});
LOGGER.DEBUG('exporting isAuthenticated');

export const isAuthorized = function (allowedRoles) {
    return catchAsyncError(async (req, res, next) => {
        LOGGER.DEBUG('using - isAuthorized');
        const { role } = req.user;
        if (!allowedRoles.includes(role)) {
            return next(new ErrorHandler('You are not authorized to access this resource!', 403));
        }
        next();
    });
};
LOGGER.DEBUG('exporting isAuthorized');

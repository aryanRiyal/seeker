import { LOGGER } from './logger.js';

LOGGER.DEBUG('starting ./utils/jwtToken.js');

export const sendToken = (user, statusCode, res, message) => {
    LOGGER.DEBUG('using - sendToken()');
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    LOGGER.INFO(`Success: ${message}`);
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        message,
        token
    });
};
LOGGER.DEBUG('exporting sendToken');

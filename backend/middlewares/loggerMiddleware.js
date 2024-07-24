import { LOGGER } from '../utils/logger.js';

LOGGER.DEBUG('starting ./middlewares/loggerMiddleware.js');

export const loggerMiddleware = function (req, res, next) {
    LOGGER.DEBUG('using - loggerMiddleware()');
    LOGGER.INFO(`Request: ${req.method} ${req.originalUrl}`);
    res.on('finish', function () {
        if (199 < res.statusCode && res.statusCode <= 299) {
            LOGGER.INFO(`Response(${res.statusCode}): ${req.method} ${req.originalUrl}`);
        }
    });
    next();
};
LOGGER.DEBUG('exporting loggerMiddleware');

import { LOGGER } from '../utils/logger.js';

LOGGER.DEBUG('starting ./middlewares/catchAsyncError.js');

export const catchAsyncError = function (theFunction) {
    LOGGER.DEBUG('using - catchAsyncError()');
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};
LOGGER.DEBUG('exporting catchAsyncError');

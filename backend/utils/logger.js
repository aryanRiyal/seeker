import { createLogger, transports, format, addColors } from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, 'temp.logs');

const checkLogFile = () => {
    if (fs.existsSync(logFilePath)) {
        const lines = fs.readFileSync(logFilePath, 'utf8').split('\n').length;
        if (lines > 220) {
            fs.unlinkSync(logFilePath);
        }
    }
};

checkLogFile();

const customLevels = {
    levels: {
        ERROR: 0,
        WARN: 1,
        NOTICE: 2,
        INFO: 3,
        DEBUG: 4
    },
    colors: {
        ERROR: 'red',
        WARN: 'yellow',
        NOTICE: 'magenta',
        INFO: 'green',
        DEBUG: 'blue'
    }
};

// Add colors to winston
addColors(customLevels.colors);

const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
        // const upperCaseLevel = level.toUpperCase();
        // const upperCaseLevel = level;
        return `${timestamp} [${level}]: ${message}`;
    })
);

export const LOGGER = createLogger({
    levels: customLevels.levels,
    format: customFormat,
    transports: [
        new transports.File({ filename: logFilePath, level: 'DEBUG' }),
        new transports.Console({
            level: 'INFO',
            format: format.combine(format.colorize({ all: true }), customFormat)
        })
    ],
    exitOnError: false
});

// export const logger = createLogger({
//     levels: {
//         error: 0,
//         warn: 1,
//         notice: 2,
//         info: 3,
//         debug: 4
//     },
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
//         format.printf(
//             ({ timestamp, level, message }) =>
//                 `${timestamp} [${level.toLocaleUpperCase()}]: ${message}`
//         )
//     ),
//     transports: [
//         new transports.File({ filename: logFilePath, level: 'debug' }),
//         new transports.Console({
//             level: 'info'
//         })
//     ],
//     exitOnError: false
// });

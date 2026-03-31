import { createLogger, format, transports, addColors } from 'winston';

// Define standard levels and their colors
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

// Tell Winston to use these colors
addColors(colors);

const logger = createLogger({
    // Set to 'http' (3) or 'debug' (4) so you can call all methods
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        // 1. Critical Errors only
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // 2. Everything from the global level and above
        new transports.File({ filename: 'logs/combined.log' }),
        // 3. Readable Console for Development
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${
                        Object.keys(meta).length ? JSON.stringify(meta) : ''
                    }`;
                })
            ),
        }),
    ],
});


if(process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    }));
}

export { logger };
import { createLogger, format, transports, addColors } from 'winston';

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

addColors(colors);

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        // Critical Errors only
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Everything from the global level and above
        new transports.File({ filename: 'logs/combined.log' }),
        // Readable Console for Development
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
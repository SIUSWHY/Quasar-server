import { createLogger, format, transports } from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new WinstonDailyRotateFile({
      dirname: 'src/logs',
      datePattern: 'DD-MM-YYYY',
      filename: 'error.log',
      level: 'error',
    }),
    new WinstonDailyRotateFile({
      dirname: 'src/logs',
      datePattern: 'DD-MM-YYYY',
      filename: 'combined.log',
    }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

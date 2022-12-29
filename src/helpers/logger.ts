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
    new WinstonDailyRotateFile({
      dirname: process.env.NODE_ENV !== 'production' ? 'src/logs' : 'dist/logs',
      datePattern: 'DD-MM-YYYY',
      filename: '%DATE%.error.log',
      level: 'error',
    }),
    new WinstonDailyRotateFile({
      dirname: process.env.NODE_ENV !== 'production' ? 'src/logs' : 'dist/logs',
      datePattern: 'DD-MM-YYYY',
      filename: '%DATE%.combined.log',
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

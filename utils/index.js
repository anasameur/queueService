const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');

/**************************************/
/*           Config logger            */
/**************************************/
var transport = new transports.DailyRotateFile({
  filename: 'log/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '10k',
  maxFiles: '14d',
});

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});

const myFormat = printf((info) => {
  return `[${new Date()}] [${info.level}] : ${info.message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    transport,
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
    })
  );
}

module.exports = {
  logger: logger,
};

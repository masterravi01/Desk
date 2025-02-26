const { createLogger, format, transports } = require("winston");
const path = require("path");

// Configure logger
const logger = createLogger({
    level: "info", // Levels: error, warn, info, http, verbose, debug, silly
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, "logs", "app.log") }),
        new transports.Console()
    ]
});

module.exports = logger;

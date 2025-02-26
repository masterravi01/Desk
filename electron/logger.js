const fs = require("fs");
const path = require("path");

const logFilePath = path.join(require("electron").app.getPath("userData"), "app.log");

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = { log };

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const logger = require("../logger");
const dbPath = path.join(require("electron").app.getPath("userData"), "database.sqlite");

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ Database Connection Error:", err);
    else logger.info("✅ Connected to SQLite Database");
});

module.exports = db;

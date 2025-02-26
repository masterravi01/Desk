const db = require("./database");
const logger = require("../../logger");

const migrations = [
    {
        version: 1,
        description: "Create Users Table",
        script: `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )
        `,
    },
    {
        version: 2,
        description: "Create Orders Table",
        script: `
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                price REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `,
    },
];

function applyMigrations() {
    migrations.forEach((migration) => {
        db.run(migration.script, (err) => {
            if (err) logger.error(`❌ Migration ${migration.version} Failed:`, err);
            else logger.info(`✅ Migration ${migration.version}: ${migration.description}`);
        });
    });
}

applyMigrations();

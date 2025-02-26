const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(require("electron").app.getPath("userData"), "database.sqlite");

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database Error:", err);
    else console.log("Connected to SQLite Database");
});

// Create table
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    )`
    );
});

// CRUD Functions
function getUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addUser(user) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

function updateUser(user) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [user.name, user.email, user.id], function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

module.exports = { getUsers, addUser, updateUser, deleteUser };

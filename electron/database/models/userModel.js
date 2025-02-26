const db = require("../database");

function getAllUsers() {
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

module.exports = { getAllUsers, addUser, updateUser, deleteUser };

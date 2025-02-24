const db = require('../config/database');

class User {
    static getAll(callback) {
        db.all('SELECT * FROM users', [], callback);
    }

    static create(name, email, callback) {
        const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
        db.run(sql, [name, email], function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID, name, email });
        });
    }

    static update(id, name, email, callback) {
        db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
            callback(err);
        });
    }

    static delete(id, callback) {
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
            callback(err);
        });
    }
}

module.exports = User;

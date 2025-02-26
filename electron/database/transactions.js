const db = require("./database");

function createUserWithOrder(user, order) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            db.run("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email], function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                }

                const userId = this.lastID;

                db.run("INSERT INTO orders (user_id, product_name, price) VALUES (?, ?, ?)",
                    [userId, order.product_name, order.price],
                    function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return reject(err);
                        }
                        db.run("COMMIT");
                        resolve({ userId, orderId: this.lastID });
                    }
                );
            });
        });
    });
}

module.exports = { createUserWithOrder };

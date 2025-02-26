const db = require("../database");

function getOrders() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM orders", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function addOrder(order) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO orders (user_id, product_name, price) VALUES (?, ?, ?)",
            [order.user_id, order.product_name, order.price], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
    });
}

module.exports = { getOrders, addOrder };

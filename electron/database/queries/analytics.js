const db = require("../database");

function getTotalSpentByUsers() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT users.name, SUM(orders.price) AS total_spent
             FROM orders 
             JOIN users ON orders.user_id = users.id
             GROUP BY users.id`,
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

function getOrderCountByUser() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT users.name, COUNT(orders.id) AS order_count
             FROM orders
             JOIN users ON orders.user_id = users.id
             GROUP BY users.id`,
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

module.exports = { getTotalSpentByUsers, getOrderCountByUser };

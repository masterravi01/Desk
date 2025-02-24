const User = require('../models/user.model');
const logger = require('../config/logger');

exports.getUsers = (req, res) => {
    User.getAll((err, rows) => {
        if (err) {
            logger.error(`Failed to fetch users: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    User.create(name, email, (err, user) => {
        if (err) {
            logger.error(`Failed to create user: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        logger.info(`User created: ${user.name}`);
        res.status(201).json(user);
    });
};

// Update user (Refactored)
exports.updateUser = (req, res) => {
    const { name, email } = req.body;
    const userId = req.params.id;

    User.update(userId, name, email, (err) => {
        if (err) {
            logger.error(`Failed to update user: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        logger.info(`User updated: ${userId}`);
        res.json({ message: 'User updated successfully' });
    });
};

// Delete user (Refactored)
exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    User.delete(userId, (err) => {
        if (err) {
            logger.error(`Failed to delete user: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
        logger.info(`User deleted: ${userId}`);
        res.json({ message: 'User deleted successfully' });
    });
};

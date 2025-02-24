const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/errorHandler');
const { PORT } = require('./config/dotenv');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;

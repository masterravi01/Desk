const app = require('./app');
const { PORT } = require('./config/dotenv');

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

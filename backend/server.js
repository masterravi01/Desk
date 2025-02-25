const app = require("./app");
const { PORT } = require("./config/dotenv");

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
// Gracefully close the server when Electron quits
process.on("exit", () => {
  server.close(() => {
    console.log("Server closed");
  });
});

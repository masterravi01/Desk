const { ipcMain } = require("electron");
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("./database/models/userModel");
const {
  getCompany,
  addCompany,
  updateCompany,
  deleteCompany,
} = require("./database/controllers/company");

function setupIpcHandlers() {
  // User APIs
  ipcMain.handle("getUsers", async () => {
    return await getAllUsers();
  });

  ipcMain.handle("addUser", async (event, user) => {
    return await addUser(user);
  });

  ipcMain.handle("updateUser", async (event, user) => {
    return await updateUser(user);
  });

  ipcMain.handle("deleteUser", async (event, userId) => {
    return await deleteUser(userId);
  });

  // Company APIs
  ipcMain.handle("getCompany", async (event, id) => {
    return await getCompany(id);
  });

  ipcMain.handle("addCompany", async (event, company) => {
    return await addCompany(company);
  });

  ipcMain.handle("updateCompany", async (event, company) => {
    return await updateCompany(company);
  });

  ipcMain.handle("deleteCompany", async (event, companyId) => {
    return await deleteCompany(companyId);
  });
}

module.exports = { setupIpcHandlers };

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

const {
  getCurrency,
  addCurrency,
  updateCurrency,
  deleteCurrency,
  getAllCurrencies,
} = require("./database/controllers/currency");

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

  ipcMain.handle("getCurrency", async (event, companyId) => {
    return await getCurrency(companyId);
  });
  ipcMain.handle("getAllCurrencies", async (event, companyId) => {
    return await getAllCurrencies(companyId);
  });
  ipcMain.handle("addCurrency", async (event, currency) => {
    return await addCurrency(currency);
  });
  ipcMain.handle("updateCurrency", async (event, currency) => {
    return await updateCurrency(currency);
  });
  ipcMain.handle("deleteCurrency", async (event, id) => {
    return await deleteCurrency(id);
  });
}

module.exports = { setupIpcHandlers };

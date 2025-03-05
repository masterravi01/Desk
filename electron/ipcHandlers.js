const { ipcMain } = require("electron");

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

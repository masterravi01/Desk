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

const {
  getAllBottomNote,
  addBottomNote,
  updateBottomNote,
  deleteBottomNote,
} = require("./database/controllers/bottomnote");

const {
  getSystemParameter,
  getAllSystemParameters,
  addSystemParameter,
  updateSystemParameter,
  deleteSystemParameter,
} = require("./database/controllers/systemParameter");

const {
  getInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  addInvoice,
} = require("./database/controllers/invoiceMaster");

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

  ipcMain.handle("getSystemParameter", async (event, id) => {
    return await getSystemParameter(id);
  });
  ipcMain.handle("getAllSystemParameters", async (event) => {
    return await getAllSystemParameters();
  });
  ipcMain.handle("updateSystemParameter", async (event, parameter) => {
    return await updateSystemParameter(parameter);
  });
  ipcMain.handle("addSystemParameter", async (event, parameter) => {
    return await addSystemParameter(parameter);
  });

  ipcMain.handle("deleteSystemParameter", async (event, id) => {
    return await deleteSystemParameter(id);
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

  ipcMain.handle("getAllBottomNote", async (event) => {
    return await getAllBottomNote();
  });
  ipcMain.handle("addBottomNote", async (event, bottomNote) => {
    return await addBottomNote(bottomNote);
  });
  ipcMain.handle("updateBottomNote", async (event, bottomNote) => {
    return await updateBottomNote(bottomNote);
  });
  ipcMain.handle("deleteBottomNote", async (event, id) => {
    return await deleteBottomNote(id);
  });

  ipcMain.handle("getInvoice", async (event, id) => {
    return await getInvoice(id);
  });

  ipcMain.handle("getAllInvoices", async (event) => {
    return await getAllInvoices();
  });

  ipcMain.handle("updateInvoice", async (event, invoice) => {
    return await updateInvoice(invoice);
  });

  ipcMain.handle("addInvoice", async (event, invoice) => {
    return await addInvoice(invoice);
  });
  ipcMain.handle("deleteInvoice", async (event, id) => {
    return await deleteInvoice(id);
  });
}

module.exports = { setupIpcHandlers };

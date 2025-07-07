const { ipcMain } = require("electron");
const fs = require('fs');
const path = require('path');

const {
  getCompany,
  getAllCompanies,
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
  getAllInstruction,
  addInstruction,
  updateInstruction,
  deleteInstruction,
  getInstructionsByCustomer,
} = require("./database/controllers/instruction");

const {
  getAllContainer,
  addContainer,
  updateContainer,
  deleteContainer,
} = require("./database/controllers/container");

const {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./database/controllers/customer");
const {
  getInvoiceMaster,
  getAllMasterInvoices,
  updateInvoiceMaster,
  deleteInvoiceMaster,
  addInvoiceMaster,
} = require("./database/controllers/invoiceMaster");

const {
  insertInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoice,
  addFinalInvoice,
  updateFinalInvoice,
  deleteFinalInvoice,
  getInvoiceDetails,
  exportInvoice,
  importInvoice,
} = require("./database/controllers/invoice");

const {
  generateInvoiceDocument,
  generateOrderConfirmation,
} = require("./database/generate-document/report");

function setupIpcHandlers() {
  // Company APIs
  ipcMain.handle("getCompany", async (event, id) => {
    return await getCompany(id);
  });

  ipcMain.handle("getAllCompanies", async (event) => {
    return await getAllCompanies();
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

  ipcMain.handle("getInstructionsByCustomer", async (event, id) => {
    return await getInstructionsByCustomer(id);
  });
  ipcMain.handle("getAllInstruction", async (event) => {
    return await getAllInstruction();
  });
  ipcMain.handle("addInstruction", async (event, instruction) => {
    return await addInstruction(instruction);
  });
  ipcMain.handle("updateInstruction", async (event, instruction) => {
    return await updateInstruction(instruction);
  });
  ipcMain.handle("deleteInstruction", async (event, id) => {
    return await deleteInstruction(id);
  });

  ipcMain.handle("getAllContainer", async (event) => {
    return await getAllContainer();
  });
  ipcMain.handle("addContainer", async (event, container) => {
    return await addContainer(container);
  });
  ipcMain.handle("updateContainer", async (event, container) => {
    return await updateContainer(container);
  });
  ipcMain.handle("deleteContainer", async (event, ID) => {
    return await deleteContainer(ID);
  });

  ipcMain.handle("getAllCustomers", async (event) => {
    return await getAllCustomers();
  });
  ipcMain.handle("addCustomer", async (event, customer) => {
    return await addCustomer(customer);
  });
  ipcMain.handle("updateCustomer", async (event, customer) => {
    return await updateCustomer(customer);
  });
  ipcMain.handle("deleteCustomer", async (event, ID) => {
    return await deleteCustomer(ID);
  });
  ipcMain.handle("getInvoice", async (event, id) => {
    return await getInvoice(id);
  });

  ipcMain.handle("updateInvoice", async (event, invoice) => {
    return await updateInvoice(invoice);
  });
  ipcMain.handle("deleteInvoice", async (event, id) => {
    return await deleteInvoice(id);
  });

  ipcMain.handle("insertInvoice", async (event, invoice) => {
    return await insertInvoice(invoice);
  });
  ipcMain.handle("addFinalInvoice", async (event, invoice) => {
    return await addFinalInvoice(invoice);
  });
  ipcMain.handle("importInvoice", async (event, invoice) => {
    return await importInvoice(invoice);
  });
  ipcMain.handle("exportInvoice", async (event, invoice) => {
    return await exportInvoice(invoice);
  });
  ipcMain.handle("updateFinalInvoice", async (event, invoice) => {
    return await updateFinalInvoice(invoice);
  });
  ipcMain.handle("deleteFinalInvoice", async (event, invoiceId) => {
    return await deleteFinalInvoice(invoiceId);
  });
  ipcMain.handle("getInvoiceDetails", async (event, data) => {
    return await getInvoiceDetails(data);
  });

  ipcMain.handle("getAllMasterInvoices", async (event, invoice) => {
    return await getAllMasterInvoices(invoice);
  });

  ipcMain.handle("generateInvoiceDocument", async (event, body) => {
    return await generateInvoiceDocument(body);
  });

  ipcMain.handle("generateOrderConfirmation", async (event, body) => {
    return await generateOrderConfirmation(body);
  });

  // IPC handler to save image to src/assets
  ipcMain.handle('saveImageToAssets', async (event, { fileName, base64Data }) => {
    try {
      const assetsPath = path.join(__dirname, '../src/assets', fileName);
      // Remove the data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      fs.writeFileSync(assetsPath, buffer);
      return { success: true, path: 'assets/' + fileName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}

module.exports = { setupIpcHandlers };

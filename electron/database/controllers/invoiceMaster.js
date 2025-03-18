const db = require("../database");

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const isSelectQuery = query.trim().toUpperCase().startsWith("SELECT");

    if (isSelectQuery) {
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error(`Query Error: ${err.message}`);
          console.error(`Failed Query: ${query}`);
          console.error(`Parameters: ${JSON.stringify(params)}`);
          reject(err);
        } else {
          resolve(rows); // Return data for SELECT queries
        }
      });
    } else {
      db.run(query, params, function (err) {
        if (err) {
          console.error(`Query Error: ${err.message}`);
          console.error(`Failed Query: ${query}`);
          console.error(`Parameters: ${JSON.stringify(params)}`);
          reject(err);
        } else {
          if (query.trim().toUpperCase().startsWith("INSERT")) {
            resolve(this.lastID); // Return last inserted ID for INSERT
          } else if (
            query.trim().toUpperCase().startsWith("UPDATE") ||
            query.trim().toUpperCase().startsWith("DELETE")
          ) {
            resolve(this.changes); // Return number of affected rows for UPDATE/DELETE
          } else {
            resolve(true); // Default for other queries
          }
        }
      });
    }
  });
}

// Get an invoice by ID
function getInvoiceMaster(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM invoiceMaster WHERE invoiceId = ?",
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// Get all invoices
async function getAllMasterInvoices(master = true) {
  try {
    // Step 1: Fetch All Final Invoices

    if (master) {
      const masterInvoices = await runQuery("SELECT * FROM invoiceMaster");
      return masterInvoices;
    } else {
      const finalInvoices = await runQuery("SELECT * FROM finalinvoice");

      // Step 2: Extract Invoice IDs from Final Invoices
      const finalInvoiceIds = finalInvoices.map((invoice) => invoice.invoiceId);

      // Step 3: Fetch All Master Invoices (Excluding Final Invoice IDs)
      const masterInvoices = await runQuery(
        `
      SELECT * FROM invoiceMaster 
      WHERE invoiceId NOT IN (${finalInvoiceIds.map(() => "?").join(", ")})
    `,
        finalInvoiceIds
      );

      // Step 4: Combine Final and Master Invoices
      const combinedInvoices = [...finalInvoices, ...masterInvoices];

      return combinedInvoices;
    }
  } catch (error) {
    console.error(`❌ Error fetching invoices: ${error.message}`);
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
}

// Add a new invoice
function addInvoiceMaster(invoice) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO invoiceMaster (
        customerOrderNo, invoiceDate, invoiceSerial, invoicePiNo, customerId, 
        customerName, customerAddress, customerCity, customerZip, customerState, customerCountry, 
        buyerAddress, buyerCity, buyerZip, buyerState, buyerCountry, currency, 
        status, discountType, discountValue, additionalChargeType, additionalChargeValue, 
        reference, totalQuantity, totalAmount, totalSquareMeters, rounding, netAmount, 
        deliveryTerms, deliveryDetails, shippingDetails, paymentTerms, portOfDischarge, 
        dispatchTerms, bankName, bankBranch, bankCity, swiftNumber, comments, calculationType, 
        bankAddress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        invoice.customerOrderNo,
        invoice.invoiceDate,
        invoice.invoiceSerial,
        invoice.invoicePiNo,
        invoice.customerId,
        invoice.customerName,
        invoice.customerAddress,
        invoice.customerCity,
        invoice.customerZip,
        invoice.customerState,
        invoice.customerCountry,
        invoice.buyerAddress,
        invoice.buyerCity,
        invoice.buyerZip,
        invoice.buyerState,
        invoice.buyerCountry,
        invoice.currency,
        invoice.status,
        invoice.discountType,
        invoice.discountValue,
        invoice.additionalChargeType,
        invoice.additionalChargeValue,
        invoice.reference,
        invoice.totalQuantity,
        invoice.totalAmount,
        invoice.totalSquareMeters,
        invoice.rounding,
        invoice.netAmount,
        invoice.deliveryTerms,
        invoice.deliveryDetails,
        invoice.shippingDetails,
        invoice.paymentTerms,
        invoice.portOfDischarge,
        invoice.dispatchTerms,
        invoice.bankName,
        invoice.bankBranch,
        invoice.bankCity,
        invoice.swiftNumber,
        invoice.comments,
        invoice.calculationType,
        invoice.bankAddress,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...invoice });
      }
    );
  });
}

// Update an existing invoice
function updateInvoiceMaster(invoice) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE invoiceMaster SET 
        customerOrderNo = ?, invoiceDate = ?, invoiceSerial = ?, invoicePiNo = ?, customerId = ?, 
        customerName = ?, customerAddress = ?, customerCity = ?, customerZip = ?, customerState = ?, customerCountry = ?,
        buyerAddress = ?, buyerCity = ?, buyerZip = ?, buyerState = ?, buyerCountry = ?, currency = ?,
        status = ?, discountType = ?, discountValue = ?, additionalChargeType = ?, additionalChargeValue = ?,
        reference = ?, totalQuantity = ?, totalAmount = ?, totalSquareMeters = ?, rounding = ?, netAmount = ?,
        deliveryTerms = ?, deliveryDetails = ?, shippingDetails = ?, paymentTerms = ?, portOfDischarge = ?,
        dispatchTerms = ?, bankName = ?, bankBranch = ?, bankCity = ?, swiftNumber = ?, comments = ?, calculationType = ?,
        bankAddress = ?
      WHERE invoiceId = ?
    `;
    db.run(
      query,
      [
        invoice.customerOrderNo,
        invoice.invoiceDate,
        invoice.invoiceSerial,
        invoice.invoicePiNo,
        invoice.customerId,
        invoice.customerName,
        invoice.customerAddress,
        invoice.customerCity,
        invoice.customerZip,
        invoice.customerState,
        invoice.customerCountry,
        invoice.buyerAddress,
        invoice.buyerCity,
        invoice.buyerZip,
        invoice.buyerState,
        invoice.buyerCountry,
        invoice.currency,
        invoice.status,
        invoice.discountType,
        invoice.discountValue,
        invoice.additionalChargeType,
        invoice.additionalChargeValue,
        invoice.reference,
        invoice.totalQuantity,
        invoice.totalAmount,
        invoice.totalSquareMeters,
        invoice.rounding,
        invoice.netAmount,
        invoice.deliveryTerms,
        invoice.deliveryDetails,
        invoice.shippingDetails,
        invoice.paymentTerms,
        invoice.portOfDischarge,
        invoice.dispatchTerms,
        invoice.bankName,
        invoice.bankBranch,
        invoice.bankCity,
        invoice.swiftNumber,
        invoice.comments,
        invoice.calculationType,
        invoice.bankAddress,
        invoice.invoiceId,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

// Delete an invoice by ID
function deleteInvoiceMaster(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM invoiceMaster WHERE invoiceId = ?",
      [id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

module.exports = {
  getInvoiceMaster,
  getAllMasterInvoices,
  updateInvoiceMaster,
  deleteInvoiceMaster,
  addInvoiceMaster,
};

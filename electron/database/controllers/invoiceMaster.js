const db = require("../database");

// Get an invoice by ID
function getInvoice(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM invoiceMaster WHERE invId = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get all invoices
function getAllInvoices() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM invoiceMaster", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Add a new invoice
function addInvoice(invoice) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO invoiceMaster (
        customerOrderNo, invoiceDate, invoiceSerial, invoicePiNo, customerId, 
        customerName, customerAddress, customerCity, customerZip, customerState, customerCountry, 
        billingAddress, billingCity, billingZip, billingState, billingCountry, currency, 
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
        invoice.billingAddress,
        invoice.billingCity,
        invoice.billingZip,
        invoice.billingState,
        invoice.billingCountry,
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
function updateInvoice(invoice) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE invoiceMaster SET 
        customerOrderNo = ?, invoiceDate = ?, invoiceSerial = ?, invoicePiNo = ?, customerId = ?, 
        customerName = ?, customerAddress = ?, customerCity = ?, customerZip = ?, customerState = ?, customerCountry = ?,
        billingAddress = ?, billingCity = ?, billingZip = ?, billingState = ?, billingCountry = ?, currency = ?,
        status = ?, discountType = ?, discountValue = ?, additionalChargeType = ?, additionalChargeValue = ?,
        reference = ?, totalQuantity = ?, totalAmount = ?, totalSquareMeters = ?, rounding = ?, netAmount = ?,
        deliveryTerms = ?, deliveryDetails = ?, shippingDetails = ?, paymentTerms = ?, portOfDischarge = ?,
        dispatchTerms = ?, bankName = ?, bankBranch = ?, bankCity = ?, swiftNumber = ?, comments = ?, calculationType = ?,
        bankAddress = ?
      WHERE invId = ?
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
        invoice.billingAddress,
        invoice.billingCity,
        invoice.billingZip,
        invoice.billingState,
        invoice.billingCountry,
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
        invoice.invId,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

// Delete an invoice by ID
function deleteInvoice(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM invoiceMaster WHERE invId = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getInvoice,
  getAllInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};

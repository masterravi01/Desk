const db = require("../database");

function getCompany(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM company WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function addCompany(company) {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO company (
      companyCode, companyName, entryDate, currencyCode, createdBy, remarks, isCurrentCompany,
      bankName, bankAddressLine1, bankAddressLine2, bankCity, bankPostalCode, bankCountry, swiftCode,
      accountNumber, additionalNumber, importExportCode, bankState, taxIdentificationNumber,
      companyAddressLine1, companyAddressLine2, companyCity, companyPostalCode, companyCountry, companyState
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    db.run(
      query,
      [
        company.companyCode ?? null,
        company.companyName ?? null,
        company.entryDate ?? null,
        company.currencyCode ?? null,
        company.createdBy ?? null,
        company.remarks ?? null,
        company.isCurrentCompany ?? null,
        company.bankName ?? null,
        company.bankAddressLine1 ?? null,
        company.bankAddressLine2 ?? null,
        company.bankCity ?? null,
        company.bankPostalCode ?? null,
        company.bankCountry ?? null,
        company.swiftCode ?? null,
        company.accountNumber ?? null,
        company.additionalNumber ?? null,
        company.importExportCode ?? null,
        company.bankState ?? null,
        company.taxIdentificationNumber ?? null,
        company.companyAddressLine1 ?? null,
        company.companyAddressLine2 ?? null,
        company.companyCity ?? null,
        company.companyPostalCode ?? null,
        company.companyCountry ?? null,
        company.companyState ?? null,
      ],
      function (err) {
        if (err) {
          console.error("SQL Error:", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, ...company });
        }
      }
    );
  });
}

function updateCompany(company) {
  return new Promise((resolve, reject) => {
    const query = `
    UPDATE company SET
      companyCode = ?, companyName = ?, entryDate = ?, currencyCode = ?, createdBy = ?, remarks = ?, isCurrentCompany = ?,
      bankName = ?, bankAddressLine1 = ?, bankAddressLine2 = ?, bankCity = ?, bankPostalCode = ?, bankCountry = ?, swiftCode = ?,
      accountNumber = ?, additionalNumber = ?, importExportCode = ?, bankState = ?, taxIdentificationNumber = ?,
      companyAddressLine1 = ?, companyAddressLine2 = ?, companyCity = ?, companyPostalCode = ?, companyCountry = ?, companyState = ?
    WHERE id = ?
  `;
    db.run(
      query,
      [
        company.companyCode,
        company.companyName,
        company.entryDate,
        company.currencyCode,
        company.createdBy,
        company.remarks,
        company.isCurrentCompany,
        company.bankName,
        company.bankAddressLine1,
        company.bankAddressLine2,
        company.bankCity,
        company.bankPostalCode,
        company.bankCountry,
        company.swiftCode,
        company.accountNumber,
        company.additionalNumber,
        company.importExportCode,
        company.bankState,
        company.taxIdentificationNumber,
        company.companyAddressLine1,
        company.companyAddressLine2,
        company.companyCity,
        company.companyPostalCode,
        company.companyCountry,
        company.companyState,
        company.id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function deleteCompany(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM company WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = { getCompany, addCompany, updateCompany, deleteCompany };

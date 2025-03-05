const db = require("../database");

// Get a currency by ID
function getCurrency(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Currency WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get all currencies
function getAllCurrencies() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Currency", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Add a new currency
function addCurrency(currency) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Currency (currencyName, currencyChar, currencyCountry)
      VALUES (?, ?, ?)
    `;
    db.run(
      query,
      [
        currency.currencyName ?? null,
        currency.currencyChar ?? null,
        currency.currencyCountry ?? null,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...currency });
      }
    );
  });
}

// Update an existing currency
function updateCurrency(currency) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Currency SET currencyName = ?, currencyChar = ?, currencyCountry = ?
      WHERE id = ?
    `;
    db.run(
      query,
      [
        currency.currencyName,
        currency.currencyChar,
        currency.currencyCountry,
        currency.id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

// Delete a currency by ID
function deleteCurrency(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Currency WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getCurrency,
  getAllCurrencies,
  addCurrency,
  updateCurrency,
  deleteCurrency,
};

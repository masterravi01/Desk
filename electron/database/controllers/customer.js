const db = require("../database");

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM customers WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getAllCustomers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM customers", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addCustomer(customer) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO customers (name, phone, email, contactPerson, designation,
      otherPhone, url, fax, remark,  address, 
      city, state, zip, country, buyerAddress, 
      buyerCity, buyerState, buyerZipcode, buyerCountry, bankName,
      bankBranch, bankCity, bankAddress, bankState, bankZip, bankCountry)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        customer.name ?? null,
        customer.phone ?? null,
        customer.email ?? null,
        customer.contactPerson ?? null,
        customer.designation ?? null,

        customer.otherPhone ?? null,
        customer.url ?? null,
        customer.fax ?? null,
        customer.remark ?? null,
        customer.address ?? null,

        customer.city ?? null,
        customer.state ?? null,
        customer.zip ?? null,
        customer.country ?? null,
        customer.buyerAddress ?? null,

        customer.buyerCity ?? null,
        customer.buyerState ?? null,
        customer.buyerZipcode ?? null,
        customer.buyerCountry ?? null,
        customer.bankName ?? null,

        customer.bankBranch ?? null,
        customer.bankCity ?? null,
        customer.bankAddress ?? null,
        customer.bankState ?? null,
        customer.bankZip ?? null,

        customer.bankCountry ?? null,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...customer });
      }
    );
  });
}

function updateCustomer(customer) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE customers SET name = ?, phone = ?, email = ?, contactPerson = ?, designation = ?, otherPhone = ?, 
      url = ?, fax = ?, remark = ?, address = ?, city = ?, state = ?, zip = ?, country = ?, 
      buyerAddress = ?, buyerCity = ?, buyerState = ?, buyerZipcode = ?, buyerCountry = ?, 
      bankName = ?, bankBranch = ?, bankCity = ?, bankAddress = ?, bankState = ?, bankZip = ?, bankCountry = ?
      WHERE id = ?
    `;
    db.run(
      query,
      [
        customer.name,
        customer.phone,
        customer.email,
        customer.contactPerson,
        customer.designation,
        customer.otherPhone,
        customer.url,
        customer.fax,
        customer.remark,
        customer.address,
        customer.city,
        customer.state,
        customer.zip,
        customer.country,
        customer.buyerAddress,
        customer.buyerCity,
        customer.buyerState,
        customer.buyerZipcode,
        customer.buyerCountry,
        customer.bankName,
        customer.bankBranch,
        customer.bankCity,
        customer.bankAddress,
        customer.bankState,
        customer.bankZip,
        customer.bankCountry,
        customer.id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function deleteCustomer(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getCustomer,
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};

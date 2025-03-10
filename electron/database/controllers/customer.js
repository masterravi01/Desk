const db = require("../database");

function getCustomer(ID) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM customers WHERE ID = ?", [ID], (err, row) => {
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
      INSERT INTO customers (Name, Phone, Email, ContactPerson, Designation, 
      OtherPhone, URL, Fax, Remark, Address, 
      City, State, Zip, Country, BuyerAddress, 
      BuyerCity, BuyerState, BuyerZipcode, BuyerCountry, BnkName, 
      BnkBranch, BnkCity, BnkAddress, BnkState, BnkZip, Bnkcountry)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        customer.Name ?? null,
        customer.Phone ?? null,
        customer.Email ?? null,
        customer.ContactPerson ?? null,
        customer.Designation ?? null,

        customer.OtherPhone ?? null,
        customer.URL ?? null,
        customer.Fax ?? null,
        customer.Remark ?? null,
        customer.Address ?? null,

        customer.City ?? null,
        customer.State ?? null,
        customer.Zip ?? null,
        customer.Country ?? null,
        customer.BuyerAddress ?? null,

        customer.BuyerCity ?? null,
        customer.BuyerState ?? null,
        customer.BuyerZipcode ?? null,
        customer.BuyerCountry ?? null,
        customer.BnkName ?? null,

        customer.BnkBranch ?? null,
        customer.BnkCity ?? null,
        customer.BnkAddress ?? null,
        customer.BnkState ?? null,
        customer.BnkZip ?? null,

        customer.Bnkcountry ?? null,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ ID: this.lastID, ...customer });
      }
    );
  });
}

function updateCustomer(customer) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE customers SET Name = ?, Phone = ?, Email = ?, ContactPerson = ?, Designation = ?, OtherPhone = ?, 
      URL = ?, Fax = ?, Remark = ?, Address = ?, City = ?, State = ?, Zip = ?, Country = ?, 
      BuyerAddress = ?, BuyerCity = ?, BuyerState = ?, BuyerZipcode = ?, BuyerCountry = ?, 
      BnkName = ?, BnkBranch = ?, BnkCity = ?, BnkAddress = ?, BnkState = ?, BnkZip = ?, Bnkcountry = ?
      WHERE ID = ?
    `;
    db.run(
      query,
      [
        customer.Name,
        customer.Phone,
        customer.Email,
        customer.ContactPerson,
        customer.Designation,
        customer.OtherPhone,
        customer.URL,
        customer.Fax,
        customer.Remark,
        customer.Address,
        customer.City,
        customer.State,
        customer.Zip,
        customer.Country,
        customer.BuyerAddress,
        customer.BuyerCity,
        customer.BuyerState,
        customer.BuyerZipcode,
        customer.BuyerCountry,
        customer.BnkName,
        customer.BnkBranch,
        customer.BnkCity,
        customer.BnkAddress,
        customer.BnkState,
        customer.BnkZip,
        customer.Bnkcountry,
        customer.ID,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function deleteCustomer(ID) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM customers WHERE ID = ?", [ID], function (err) {
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

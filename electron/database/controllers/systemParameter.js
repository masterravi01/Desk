const db = require("../database");

// Get a system parameter by ID
function getSystemParameter(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM systemparameter WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get all system parameters
function getAllSystemParameters() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM systemparameter", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Add a new system parameter
function addSystemParameter(parameter) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO systemparameter (parameterName, parameterValue)
      VALUES (?, ?)
    `;
    db.run(
      query,
      [parameter.parameterName ?? null, parameter.parameterValue ?? null],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...parameter });
      }
    );
  });
}

// Update an existing system parameter
function updateSystemParameter(parameter) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE systemparameter SET parameterName = ?, parameterValue = ?
      WHERE id = ?
    `;
    db.run(
      query,
      [parameter.parameterName, parameter.parameterValue, parameter.id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

// Delete a system parameter by ID
function deleteSystemParameter(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM systemparameter WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getSystemParameter,
  getAllSystemParameters,
  addSystemParameter,
  updateSystemParameter,
  deleteSystemParameter,
};

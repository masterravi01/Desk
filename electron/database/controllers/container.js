const db = require("../database");

function getAllContainer() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM containers", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addContainer(Container) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO containers (CName, Ctype, Width, Height, Weight, Length) VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        Container.CName ?? null,
        Container.Ctype ?? null,
        Container.Width ?? null,
        Container.Height ?? null,
        Container.Weight ?? null,
        Container.Length ?? null,
      ],
      function (err) {
        if (err) {
          console.error("SQL Error:", err.message);
          reject(err);
        } else {
          resolve({ ID: this.lastID, ...Container });
        }
      }
    );
  });
}

function updateContainer(Container) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE containers SET CName = ?, Ctype = ?, Width = ?, Height = ?, Weight = ?, Length = ? WHERE ID = ?
    `;
    db.run(
      query,
      [
        Container.CName,
        Container.Ctype,
        Container.Width,
        Container.Height,
        Container.Weight,
        Container.Length,
        Container.ID,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function deleteContainer(ID) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM containers WHERE ID = ?", [ID], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getAllContainer,
  addContainer,
  updateContainer,
  deleteContainer,
};

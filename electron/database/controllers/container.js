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
      INSERT INTO containers (containerName, containerType, width, height, weight, length) VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        Container.containerName ?? null,
        Container.containerType ?? null,
        Container.width ?? null,
        Container.height ?? null,
        Container.weight ?? null,
        Container.length ?? null,
      ],
      function (err) {
        if (err) {
          console.error("SQL Error:", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastid, ...Container });
        }
      }
    );
  });
}

function updateContainer(Container) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE containers SET containerName = ?, containerType = ?, width = ?, height = ?, weight = ?, length = ? WHERE id = ?
    `;
    db.run(
      query,
      [
        Container.containerName,
        Container.containerType,
        Container.width,
        Container.height,
        Container.weight,
        Container.length,
        Container.id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function deleteContainer(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM containers WHERE id = ?", [id], function (err) {
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

const db = require("../database");

function getAllInstruction() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM instruction", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addInstruction(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO instruction (Instruction) VALUES (?)
    `;
    db.run(query, [bottomNote.value ?? null], function (err) {
      if (err) {
        console.error("SQL Error:", err.message);
        reject(err);
      } else {
        resolve({ BID: this.lastID, bottomNote: bottomNote.value });
      }
    });
  });
}

function updateInstruction(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE instruction SET Instruction = ? WHERE BID = ?
    `;
    db.run(query, [bottomNote.value, bottomNote.id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteInstruction(bottomNote) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM instruction WHERE BID = ?",
      [bottomNote.id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

module.exports = {
  getAllInstruction,
  addInstruction,
  updateInstruction,
  deleteInstruction,
};

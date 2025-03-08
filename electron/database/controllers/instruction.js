const db = require("../database");

function getAllInstruction() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM instruction", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addInstruction(Instruction) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO instruction (Instruction) VALUES (?)
    `;
    db.run(query, [Instruction.value ?? null], function (err) {
      if (err) {
        console.error("SQL Error:", err.message);
        reject(err);
      } else {
        resolve({ BID: this.lastID, Instruction: Instruction.value });
      }
    });
  });
}

function updateInstruction(Instruction) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE instruction SET Instruction = ? WHERE BID = ?
    `;
    db.run(query, [Instruction.value, Instruction.id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteInstruction(Instruction) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM instruction WHERE BID = ?",
      [Instruction.id],
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

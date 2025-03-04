const db = require("../database");

function getBottomNote(BID) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM bottomnote WHERE BID = ?", [BID], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function addBottomNote(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO bottomnote (BottomNote) VALUES (?)
    `;
    db.run(query, [bottomNote.BottomNote ?? null], function (err) {
      if (err) {
        console.error("SQL Error:", err.message);
        reject(err);
      } else {
        resolve({ BID: this.lastID, ...bottomNote });
      }
    });
  });
}

function updateBottomNote(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE bottomnote SET BottomNote = ? WHERE BID = ?
    `;
    db.run(query, [bottomNote.BottomNote, bottomNote.BID], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteBottomNote(BID) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM bottomnote WHERE BID = ?", [BID], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getBottomNote,
  addBottomNote,
  updateBottomNote,
  deleteBottomNote,
};

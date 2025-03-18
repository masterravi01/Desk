const db = require("../database");

function getAllBottomNote() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM bottomnote", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addBottomNote(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO bottomnote (bottomNote) VALUES (?)
    `;
    db.run(query, [bottomNote.value ?? null], function (err) {
      if (err) {
        console.error("SQL Error:", err.message);
        reject(err);
      } else {
        resolve({ bottomNoteId: this.lastID, bottomNote: bottomNote.value });
      }
    });
  });
}

function updateBottomNote(bottomNote) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE bottomnote SET bottomNote = ? WHERE bottomNoteId = ?
    `;
    db.run(query, [bottomNote.value, bottomNote.id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function deleteBottomNote(bottomNote) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM bottomnote WHERE bottomNoteId = ?",
      [bottomNote.id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

module.exports = {
  getAllBottomNote,
  addBottomNote,
  updateBottomNote,
  deleteBottomNote,
};

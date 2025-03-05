const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const logger = require("../logger");
const dbPath = path.join(
  require("electron").app.getPath("userData"),
  "database.sqlite"
);

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error("❌ Database Connection Error:", err.message);
  } else {
    logger.info("✅ Connected to SQLite Database at: " + dbPath);
  }
});

// Enable Foreign Key Support
db.exec("PRAGMA foreign_keys = ON;", (err) => {
  if (err) {
    logger.error("❌ Failed to enable foreign keys:", err.message);
  } else {
    logger.info("🔗 Foreign Key support enabled.");
  }
});
console.log("Database Path:", db.filename);

const migrations = [
  {
    version: 1,
    description: "Create BottomNote Table",
    script: `
        DROP TABLE IF EXISTS bottomnote;
        CREATE TABLE bottomnote (
            BID INTEGER PRIMARY KEY AUTOINCREMENT,
            BottomNote TEXT DEFAULT NULL
        );
        INSERT INTO bottomnote (BID, BottomNote) VALUES
        (2, 'CIN NO.L20100GJ1991PLC016763'),
        (3, '"WE INTEND TO CLAIM RODTEP BENEFIT FOR ALL EXPORT ITEM LISTED AS ABOVE IN INVOICE".'),
        (4, '"I/WE UNDERTAKE TO ABIDE BY PROVISIONS OF FOREIGN EXCHANGE MANAGEMENT ACT,1999,AS AMENDED FROM TIME TO TIME,INCLUDING REALIZATION / REPATRIATION OF FOREIGN EXCHANGE TO / FROM INDIA"'),
        (5, 'THIS EXPORT IS UNDER OBLIGATION AGAINST OUR QUANTITY BASED ADVANCE LICENCE APPLICATION SUBMITTED TO THE J.D.G.F.T,AHMEDABAD VIDE FILE NO. DATED. AUTHORISATION NO.'),
        (6, 'WEBSITE - www.alfaica.com'),
        (7, 'ADDITION - LCL CHARGE 250 +250 COST OF 3 SHEETS 9385 D57 + DHL CHARGE'),
        (8, 'BOX NOS. 5 TO 11 LINER FACE DOWN'),
        (9, 'FSC MIX CREDIT - SGS - COC - 010630'),
        (10, 'THE EXPORTER  (INR EX 0891012222 EC004) OF THE PRODUCTS COVERED BY THIS  DOCUMENT DECLARES THAT, EXCEPT WHERE OTHERWISE CLEARLY INDICATED, THESE PRODUCTS ARE OF INDIAN PREFERENTIAL ORIGIN ACCORDING TO RULES OF ORIGIN OF THE GENERALISED SYSTEM OF PREFERENCES OF THE EUROPEAN UNION & THAT THE ORIGIN CRITERION MET IS W.4823'),
        (11, 'GST NO. 24 AABCA 2800 Q1ZU'),
        (12, 'IGST PAYMENT - PAID / LUT - BOND');
      `,
  },
  {
    version: 2,
    description: "Create Company Table",
    script: `
      DROP TABLE IF EXISTS company;
  CREATE TABLE company (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyCode TEXT DEFAULT NULL,
    companyName TEXT DEFAULT NULL,
    entryDate TEXT DEFAULT NULL,
    currencyCode TEXT DEFAULT NULL,
    createdBy TEXT DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    isCurrentCompany INTEGER DEFAULT NULL,
    bankName TEXT DEFAULT NULL,
    bankAddressLine1 TEXT DEFAULT NULL,
    bankAddressLine2 TEXT DEFAULT NULL,
    bankCity TEXT DEFAULT NULL,
    bankPostalCode TEXT DEFAULT NULL,
    bankCountry TEXT DEFAULT NULL,
    swiftCode TEXT DEFAULT NULL,
    accountNumber TEXT DEFAULT NULL,
    additionalNumber TEXT DEFAULT NULL,
    importExportCode TEXT DEFAULT NULL,
    bankState TEXT DEFAULT NULL,
    taxIdentificationNumber TEXT DEFAULT NULL,
    companyAddressLine1 TEXT DEFAULT NULL,
    companyAddressLine2 TEXT DEFAULT NULL,
    companyCity TEXT DEFAULT NULL,
    companyPostalCode TEXT DEFAULT NULL,
    companyCountry TEXT DEFAULT NULL,
    companyState TEXT DEFAULT NULL
  );
  
  INSERT INTO company (
    id, companyCode, companyName, entryDate, currencyCode, createdBy, remarks, isCurrentCompany, 
    bankName, bankAddressLine1, bankAddressLine2, bankCity, bankPostalCode, bankCountry, swiftCode, 
    accountNumber, additionalNumber, importExportCode, bankState, taxIdentificationNumber, 
    companyAddressLine1, companyAddressLine2, companyCity, companyPostalCode, companyCountry, companyState
  ) VALUES 
  (
    1, 'AL', 'ALFA ICA (I) LTD.', '08-11-0002', '$', 'admin', '', 0, 
    'STATE BANK OF INDIA', 'LAGHU UDYOG BRANCH', '', 'AHMEDABAD', '380014', 'INDIA', 
    'SBIN IN BB 598', '10204722953', '0020438-5700009', '0891012222', 'GUJARAT', 
    'AABCA2800Q', 'ALFA PALAZZO', 'NR SHIVRANJANI X ROAD, SATELLITE', 
    'AHMEDABAD', '380015', 'INDIA', 'GUJARAT'
  );
   `,
  },
  {
    version: 3,
    description: "Create Containers Table",
    script: `
        DROP TABLE IF EXISTS containers;
        CREATE TABLE containers (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          CName TEXT DEFAULT NULL,
          Ctype TEXT DEFAULT NULL,
          Width REAL DEFAULT NULL,
          Height REAL DEFAULT NULL,
          Weight REAL DEFAULT NULL,
          Length INTEGER DEFAULT NULL
        );
        INSERT INTO containers (ID, CName, Ctype, Width, Height, Weight, Length) VALUES 
        (4, 'BOX 100 KG', 'BOX', 1220, 55, 100, 2440),
        (5, 'BOX 110 KG', 'BOX', 1220, 55, 110, 2440),
        (6, 'BOX 20 KG', 'BOX 20 KG', 1220, 8, 20, 2440),
        (7, 'Box 2440x1220x3', 'BOX', 1220, 3, 60, 2440),
        (8, 'BOX 60 KG', 'BOX', 1220, 55, 60, 2440),
        (9, 'BOX 70 KG', 'BOX', 1220, 55, 70, 2440),
        (10, 'DRUM 20 KG', 'DRUM 20 KG', 1220, 8, 20, 2440),
        (11, 'BOX 150', 'BOX', 1220, 0.7, 150, 2440),
        (12, 'BOX 115', 'BOX', 1220, 0.6, 115, 2440);
      `,
  },
  {
    version: 4,
    description: "Create currency Table",
    script: `
      DROP TABLE IF EXISTS currency;
      CREATE TABLE currency (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currencyName TEXT DEFAULT NULL,
        currencyChar TEXT DEFAULT NULL,
        currencyCountry TEXT DEFAULT NULL
      );
      INSERT INTO currency (id, currencyName, currencyChar, currencyCountry) VALUES 
      (1, NULL, 'SIN $', NULL),
      (2, 'AUD', 'AUD $', NULL),
      (3, 'euro', 'EURO', NULL),
      (4, 'INR', 'Rs', 'India'),
      (5, 'USD', 'US $', NULL),
      (6, 'GBP', 'GBP', 'U.K.');
    `,
  },
];

// Ensure Migrations Table Exists
db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          version INTEGER UNIQUE NOT NULL,
          description TEXT NOT NULL,
          applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
  `);

db.all("SELECT version FROM migrations", (err, rows) => {
  if (err) {
    logger.error("❌ Error Fetching Migrations:", err.message);
    return;
  }
  console.log(rows);
  const appliedVersions = rows.map((row) => row.version);
  console.log(appliedVersions);
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    migrations.forEach((migration) => {
      if (!appliedVersions.includes(migration.version)) {
        db.exec(migration.script, (err) => {
          if (err) {
            logger.error(
              `❌ Migration ${migration.version} Failed:`,
              err.message
            );
          } else {
            logger.info(
              `✅ Migration ${migration.version}: ${migration.description}`
            );
            db.run(
              "INSERT INTO migrations (version, description) VALUES (?, ?)",
              [migration.version, migration.description]
            );
          }
        });
      }
    });
    db.run("COMMIT");
  });
});
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error("Error fetching tables:", err.message);
    return;
  }
  console.log(
    "Tables in the database:",
    rows.map((row) => row.name)
  );
});

module.exports = db;

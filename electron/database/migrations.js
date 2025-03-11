const db = require("./database");
const logger = require("../logger");

// Migration scripts (starting with BottomNote and Company tables)
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
        containerName TEXT DEFAULT NULL,
        containerType TEXT DEFAULT NULL,
        Width REAL DEFAULT NULL,
        Height REAL DEFAULT NULL,
        Weight REAL DEFAULT NULL,
        Length INTEGER DEFAULT NULL
      );
      INSERT INTO containers (ID, containerName, containerType, Width, Height, Weight, Length) VALUES 
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
    description: "Create Currency Table",
    script: `
      DROP TABLE IF EXISTS Currency;
      CREATE TABLE Currency (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currencyName TEXT DEFAULT NULL,
        currencyChar TEXT DEFAULT NULL,
        currencyCountry TEXT DEFAULT NULL
      );
      INSERT INTO Currency (id, currencyName, currencyChar, currencyCountry) VALUES 
      (1, NULL, 'SIN $', NULL),
      (2, 'AUD', 'AUD $', NULL),
      (3, 'euro', 'EURO', NULL),
      (4, 'INR', 'Rs', 'India'),
      (5, 'USD', 'US $', NULL),
      (6, 'GBP', 'GBP', 'U.K.');
    `,
  },
  {
    version: 5,
    description: "Create Users Table",
    script: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
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

// Function to Apply Migrations
function applyMigrations() {
  db.all("SELECT version FROM migrations", (err, rows) => {
    if (err) {
      logger.error("❌ Error Fetching Migrations:", err.message);
      return;
    }

    const appliedVersions = rows.map((row) => row.version);

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      migrations.forEach((migration) => {
        if (!appliedVersions.includes(migration.version)) {
          db.run(migration.script, (err) => {
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
}

module.exports = { applyMigrations };

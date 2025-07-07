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
        CREATE TABLE IF NOT EXISTS bottomnote (
            bottomNoteId INTEGER PRIMARY KEY AUTOINCREMENT,
            bottomNote TEXT DEFAULT NULL
        );
        INSERT INTO bottomnote (bottomNoteId, bottomNote) VALUES
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
      CREATE TABLE IF NOT EXISTS company (
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
    'AABCA2800Q', 'ALFA PALAZZO', 'NEAR SHIVRANJANI X ROAD, SATELLITE', 
    'AHMEDABAD', '380015', 'INDIA', 'GUJARAT'
  );
   `,
  },
  {
    version: 3,
    description: "Create Containers Table",
    script: `
     CREATE TABLE IF NOT EXISTS containers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  containerName TEXT DEFAULT NULL,
  containerType TEXT DEFAULT NULL,
  width REAL DEFAULT NULL,
  height REAL DEFAULT NULL,
  weight REAL DEFAULT NULL,
  length INTEGER DEFAULT NULL,
  lengthInch INTEGER DEFAULT NULL,
  widthInch INTEGER DEFAULT NULL,
  heightInch INTEGER DEFAULT NULL
);

INSERT INTO containers (
  id, containerName, containerType, length, width, height, weight,
  lengthInch, widthInch, heightInch
) VALUES
(4, 'BOX 100 KG', 'BOX', 2440, 1220, 55, 100, 96, 48, 2),
(5, 'BOX 110 KG', 'BOX', 2440, 1220, 55, 110, 96, 48, 2),
(6, 'BOX 20 KG', 'BOX 20 KG', 2440, 1220, 8, 20, 96, 48, 0),
(7, 'BOX 2440x1220x3', 'BOX', 2440, 1220, 3, 100, 101, 52, 15),
(8, 'BOX 60 KG', 'BOX', 2440, 1220, 55, 60, 96, 48, 2),
(9, 'BOX 70 KG', 'BOX', 2440, 1220, 55, 70, 96, 48, 2),
(10, 'DRUM 20 KG', 'DRUM 20 KG', 2440, 1220, 8, 20, 96, 48, 0),
(11, 'BOX 150', 'BOX', 2440, 1220, 0.7, 100, 101, 52, 11),
(12, 'BOX 115', 'BOX', 2440, 1220, 0.6, 100, 101, 52, 13),
(13, 'BOX 12', 'BOX', 3050, 1300, 12, 100, 125, 55, 15),
(14, 'BOX 0.8', 'BOX', 1200, 2440, 1, 100, 47, 96, 0),
(15, 'BOX 1.0', 'BOX', 2440, 1220, 1, 100, 101, 52, 13),
(16, 'BOX 2440X1000X10', 'BOX', 1200, 2440, 10, 1000, 47, 96, 0),
(17, 'BOX 2440X1220X0.8', 'BOX', 2440, 1220, 0.8, 100, 101, 52, 13),
(18, 'BOX 2400X1200X3', 'BOX', 2400, 1200, 3, 100, 99, 51, 15),
(19, 'BOX 2700X1200X4.5', '', 2700, 1200, 4.5, 100, 111, 51, 14),
(20, 'BOX 2400X1200X4.5', '', 2400, 1200, 4.5, 100, 99, 51, 14),
(21, 'BOX 2440X1220X4.5', '', 2440, 1220, 4.5, 100, 101, 52, 14),
(22, 'BOX 2410X1205X2.7', '', 2410, 1205, 2.7, 100, 99, 51, 14),
(23, 'BOX 3050X1300X0.6', '', 3050, 1300, 0.6, 100, 125, 55, 13);
      `,
  },
  {
    version: 4,
    description: "Create Currency Table",
    script: `
      CREATE TABLE IF NOT EXISTS Currency (
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
    description: "Create System Parameter",
    script: `
      CREATE TABLE IF NOT EXISTS systemparameter (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parameterName TEXT DEFAULT NULL,
        parameterValue TEXT DEFAULT NULL
      );
      INSERT INTO systemparameter (id, parameterName, parameterValue) VALUES 
      (1, 'SystemVersion', '2'),
      (2, 'WtConstant', '1.41'),
      (3, 'BoxHMargin', '3'),
      (4, 'BoxLWMargin', '5');
    `,
  },
  {
    version: 6,
    description: "Create Instruction Table",
    script: `
        CREATE TABLE IF NOT EXISTS instruction (
            BID INTEGER PRIMARY KEY AUTOINCREMENT,
            Instruction TEXT DEFAULT NULL
        );
        INSERT INTO instruction (BID, Instruction) VALUES
        (14,'ALL SHEETS TO BE PRODUCED WITH OVERLAY.'),(15,'SHEETS SHOULD PASS BOILING WATER NEMA LD TEST PLUS 70 MINUTES EN438 TEST.'),(16,'STUFFING SHOULD BE AS PER PLAN AND PHOTOGRAPHS SHOULD BE SUPPLIED WITH B/L.'),(17,'GUIDING ROPE & SPACER SHOULD BE PUT IN THE CONTAINER AND STAKING OF PALLETS INSIDE THE CONTAINER SHOULD NOT BE MORE THAN 10 PALLETS ONE OVER THE OTHER AS DISCUSSED.'),(18,'\"MADE IN INDIA\" SHOULD BE MENTIONED ON EACH & EVERY LABEL FOR PALLETS.'),(19,'IMPORTED KRAFT PAPER TO BE USED FOR BACKING FOR ALL THE SHEETS.'),(20,'BOX NOS 1 to 17 -  MARK GW.'),(21,'PACKED IN STRONG WOODEN BOX.'),(22,'BOX NOS - 1 - 2   - MARK FIP  BOX NOS - 3 - 7   - MARK SICIL  BOX NOS - 8     - MARK IDW  BOX NOS - 9 - 18 - MARK ICAP (50% FACE UP - 50% FACE DOWN).'),(23,'THE QUALITY OF SANDING AND THE BACKSIDE APPEARANCE SHOULD BE VERY GOOD.'),(24,'PACKING IN DRUM.'),(25,'LOGO - \"DECOTON BY TONELLI\"'),(26,'YELLOW STICKER TO BE PASTED ON 9287NEW ABOVE THE FILM.'),(27,'ON SL21 - SR - PF - PUT STICKER ON THE FILM.'),(28,'LOGO - \"DIAMOND\" AND \"VACO\" TO BE PUT ON ALL SHEETS.'),(29,'1. CC - ONLY TWO LAYERS OF 5021 BELOW DECOR PAPER.  2.  PACKING IN DRUMS.'),(30,'LOGO \"REAROLAM\" PRINTED ON THE BACKSIDE OF ALL THE HPL.'),(31,'ALL OMEGA BRAND LAMINATES TO BE PRODUCED WITH INDIAN KRAFT PAPER.'),(32,'PLEASE INFORM THE REFERENCE NO.'),(33,'ALL LABORATORY GRADE LAMINATES TO BE COOKED AT 5 DEGREE HIGHER TEMPERATURE.'),(34,'FILM TO BE GIVEN ON ITEMS MENTIONED ABOVE.'),(35,'1. Bangle type support.  2. Fumigated Box.  3. 4x8 on Bottom + strong packing box of 85mm height & 1300x3050 on top.'),(36,'PUT CODE NUMBER STICKER ON THE FILM OF ALL THE SHEETS SO THAT CUSTOMERS DONOT HAVE ANY CONFUSION.'),(37,'COMPACTS WITH BLACK CORE & 1 MM WHITE LINE IN THE CENTRE.'),(38,'PLEASE ENSURE STRICTLY THAT THERE ARE NO OUTSIDE PARTICLES BETWEEN LAMINATES AND FILM.'),(39,'CUT PIECES TO BE ADDED AS PER CUSTOMERS REQUIREMENT.  '),(40,'IMP. - PUT NUMBER OF CRATES IN B/L - NOT NUMBER OF HPL.'),(41,'MENTION GW ON THE SIDE OF THE BOXES.'),(42,'1. BACKSIDE PRINTING VACO / DIAMOND AS PER PREVIOUS INSTRUCTION.  2. MARK NUMBER OF SHEETS AND DESIGN ON THE BOXES.'),(43,'TG (TOUGH GLOSSY) ARE STD. GRADE (NOT PF).'),(44,'BOX NOS 1 - 6      - MARK ALU  BOX NOS 7 - 8      - MARK ROMIG   BOX NOS 9 - 16     - MARK SUD '),(45,'PLEASE SIGN & CONFIRM PROFORMA INVOICE BY FAX IMMEDIATELY.'),(46,'BOX NOS 1 to 5, 10 to 13 - MARK COLORNO  BOX NOS 6 to 9          - MARK BRAGA'),(47,'BOX NOS 1 to 13, 16 - MARK GW  BOX NOS 14 & 15    - MARK MLM'),(48,'ALL OMEGA LAMINATES FACE DOWN.  '),(49,'1. TWO SHEETS EACH - B GRADE - IN BOX NO. 1  2. QC OF FOIL SHEETS SHOULD BE VERY STRICT.'),(50,'1. 1MM HQL WITH ENSO BACK.  2. PRINT TOPPAL AT BACK.  3. IPPC MARKING TO BE DONE.  4. ALL ITEMS THREE REJECT SHEETS IN SEPARATE BOX.  '),(51,'BOX NOS 1 to 15 - MARK  ISP'),(52,'BOX NOS 1 to 13 - MARK CAPS'),(53,'BOX NOS 1 to 16 - MARK ICAP'),(54,'BOX NOS  1 to 11  - MARK IDS  BOX NOS 12 to 16  - MARK GW'),(55,'TWO SHEETS EACH - B GRADE - ON TOP OF EVERY BOX.'),(56,'BOX NOS . 1 to 12   -  MARK ICAP  BOX NOS. 13 to17   -  MARK FIP  '),(57,'BOX NOS 1 to 8 - MARK COLORNO  BOX NOS 9 to 16 - MARK ICAP'),(58,'BOX NOS 1 to 5      - MARK GW  BOX NOS 6 to 17     - MARK SHORE'),(59,'BOX NOS 1 to  8  -  MARK  GW  BOX NOS 9 to 14  -  MARK  MLM  BOX NOS 15 & 16  -  MARK  SHORE'),(60,'EURO 250, ADDITION IS FOR LICENCE OPERATION.  DELIVERY HAS ALREADY BEEN MADE. PLEASE EXPEDITE PAYMENT.'),(61,'BY AIR IN TWO DRUMS'),(62,'BOX NOS 1-8, 11, 12-16 - MARK GW  BOX NOS 9, 10         - MARK MLM  (BOX NOS 12 - 16 - ALL FACE UP).'),(63,'BOX NOS 1 to 12  - MARK  REARO  (ALL LAMINATES FACE DOWN)  BOX NOS 13 to 16 -  MARK  GW     ( ALL LAMINATES FACE UP)  BOX NO. 17       - MARK  GW'),(64,'SAMPLE CHIPS TO GO IN SAME PARCEL'),(65,'INTERNAL FREIGHT BY ALFA.  SEA FREIGHT BY KUENE & NAGEL - PAYABLE BY THE CUSTOMER.'),(66,'1. PRINTING TO BE DONE AS USUAL.  2. BOXES WITH BOTTOM TWO LAYERS OF PLYWOOD WITH EXACT 6CM CHEVRON.'),(67,'1. FREIGHT COMPENSATION - 500    FELIXSTOWE FREIGHT     - 250'),(68,'1. BOX NOS. 1 TO 9 GW  2. BOX NOS. 10 & 11 REARO(FACEUP)'),(69,'1 .BOX NOS. 1TO 9 GW  2. BOX NOS.10 & 11 REARO (FACEUP)'),(70,'BOX NOS 1 to 18 - MARK GW'),(71,'BOX NOS.1 TO 10 - MARK REARO (ALL LAMINATES FACE UP)'),(72,'BOX NOS. 1 TO 10 - MARK REARO (ALL LAMINATES FACE UP)  BOX NOS.      11 - MARK REARO (ALL LAMINATES FACE DOWN)  BOX NOS. 12 TO 19 - MARK GW'),(73,'500 SWATCHES WITH HOLE AND 50 PCS OF A4 SIZE SAMPLES FOR 6926 ER2 AND 6928 ER2'),(74,'BOX NOS. 1 - 16 MARK GW  BOX NOS.  17,18,19  - MARK MLM'),(75,'PHENOLIC QUALITY GOOD SURFACE'),(76,'1. BOX NOS.1 TO 6  MARK MLM     BOX NOS. 7 TO 18 MARK REARO     FOR REARO - FACE LAMINATES : FACE UP                    OMEGA LAMINATES : FACE DOWN'),(77,'QUANTITY +/- 5% .  '),(78,'OMEGA LAMINATES ALL PACKING FACE UP  BOX NOS. 8 TO 10  -  MARK GW  BOX NOS 11 TO 18 -  MARK STARBANK'),(79,'DELIVERY BY AIR IN TWO DRUMS.'),(80,'BOX NOS  1 to 8   - MARK  GW  BOX NOS  9       - MARK  SHORE  BOX NOS 10 to 16  - MARK  STAR'),(81,'BOX NOS. 1 TO 9 MARK BAARS  BOX NOS 10 & 11 MARK PLASTICA'),(82,'TWO SHEETS EACH FOR SAMPLES-EXACT SAME COLOUR & FINISH'),(83,'ALL LAMINATES FACE UP  BOX NOS. 1 TO 6  MARK REARO  BOX NOS.7 TO 14  MARK STARBANK'),(84,'BOX NOS. 1 TO 10  -  MARK GW            11 TO 18  -  MARK MLM'),(85,'DELIVERIES FROM CHINA  FORM A OF INDIA'),(86,'NO MINUS, PLUS 5MM LENGTH & WIDTH'),(87,'NO.2 STICKERS ON NEW GRAPHITE 9196 D29.'),(88,'BOX NOS 1 - 16 = MARK  GW'),(89,'1. FOR BETTER LOOK OF COMPACT ALL BACKSIDE BALANCE PAPER SHOULD VE ALFA ICA PRINTED ON ANY STOCKLOT PAPERS.'),(90,'1. 15 SHEETS @ 14 = US$ 210/-     AIR FREIGHT      US$ 510/-                        _________       TOTAL          US$720/-'),(91,'1. BOX NOS.1 TO 10 MARK REARO (FACE LAMINATES FACE UP / OMEGA WHITE   FACE DOWN)  2. BOX NOS. 11 TO 17 MARK STARBANK(ALL FACE UP)'),(92,'1. BOX NOS. 1 TO 15 MARK GW'),(93,'ORDER NO.789386'),(94,'1. ACCURACY WHEN CUTTING THE EDGES2. TWO BARCODE STICKERS ON EACH COMPACTS3. NO.4 WARNING LABELS (3 LINES) TO BE STICKED ON EACH COMPACT ABOVE THE FILM4. COMPACT MUST BE WATERPROOF AS TO BE USED IN THE SHOWERS.5. NO.2 STICKERS ON NEW GRAPHITE 9196 D29.'),(96,'FACE LAMINATES FACE UP .  /   OMEGA WHITE FACE DOWN.'),(97,'1. ASW P.O NO. 2388788 TO BE MARKED ON BOX NOS 1 TO 12.2. LAMINATES TO BE CUT IN ALIGNMENT TO THE SIZE.3. FILM TO BE APPLIED ONLY ON DESIGN SIDE OF COMPACTS.4. PACKING LIST TO BE PUT IN A PLASTIC BAG AND TO BE PASTED ON SIDE OF EACH BOX.5. COMPACT 2.7 MM TO BE PRODUCED WITH NEW FORMULATION 32.'),(98,'6848 COLOURS TO BE SELECTED AND PACKED SERIALLY FROM DARK TO LIGHT ON TOP.'),(99,'1. PALLETS IN THE CONTAINER SHOULD NOT HAVE ANY MOVEMENT WHILE CONTAINER IS IN TRANSIT.2. THE PALLETS SHOULD BE STRONG ENOUGH TO WITHSTAND MULTIPLE HANDLING.3. THERE SHOULD BE THICK PE FILM WRAPPED AROUND THE SHEETS WHEN KEPT IN PALLET.4. THE PALLETS SHOULD BE STRAPPED PROPERLY WITH METAL STRAPS.5. THE PALLETS SHOULD NOT HAVE PRODRUCTING NAILS WHICH MIGHT DAMAGE THE SHEETS PACKED INSIDE.'),(100,'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE'),(101,'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.'),(102,'DELIVERY ADDRESS : THE POTTER GROUP ELY BULK,QUEEN ADELADE,CAMBS,CB74UB'),(104,'SHEETS TO BE BARCODED ON THE BACK AS PER GUNNERSEN ARTWORK'),(105,'FUMIGATION WITH METHYL BROMIDE'),(106,'ISPM 15 - ISPM PACKING DECLARATION REQUIRED'),(107,'PACKING DECLARATION & NEWLY MANUFACTURERS PRODUCT CERTIFICATE REQUIREDWITH ORIGINAL DOCUMENTS ON LETTER HEAD.'),(108,'TWO SHEETS EACH - B GRADE - ON TOP OF EVERY BOX'),(109,'1.ALL CRATES TO BE BRANDED - BRISBANE - COTC / B10087652. SHEETS TO BE BARCODED ON THE BACK AS PER GUNNERSEN ARTWORK3. FUMIGATION WITH METHYL BROMIDE4. ISPM 15 - ISPM PACKING DECLARATION REQUIRED5. PACKING DECLARATION & NEWLY MANUFACTURERS PRODUCT CERTIFICATE REQUIRED WITH ORIGINAL DOCUMENTS ON LETTER HEAD.'),(110,'1. NOTIFY -     SHENZHEN HONGTAIYUAN TIMBER CO.LTD    TEL - 86 135104957222. WING YUE TRADING LTD    TEL - 852 2687 5972'),(111,'1. CERTIFICATE OF ORIGIN & FUMIGATION CERTIFICATE ARE REQUIRED2. THERE SHOULD BE IPPC MARK ON ALL WOODEN BOXES.3. CARGO TO BE RELEASED ON SURRENDER  BILL OF LADING TO CONSIGNEE'),(112,'1. KRAFT PAPER USED FOR 1MM LAMINATE WILL BE A GRADE ENSO KRAFT2. ABSOLUTE NO PRINT OF ALFA ICA EVEN ON WOODEN BOX LABELS3. ADD 2-3 SHEETS B GRADE OF ALL THE ITEMS EXTRA ON TOP OF EACH BOX.'),(113,'FSC CODE - SGS - C0C - 010630'),(114,'\"THE PRODUCT IS ACTUALLY MATT FINISH AS APPROVED BY IDS\"'),(115,'DELIVERY ADDRESS : ROSYTH , CALEDONIA HEIGHTS , ADMIRALTY PARK , ROSYTH,FIFE,KY112YW.'),(116,'1.  1MM HQL WITH ENSO KRAFT2. PRINT TOPPAL AT BACK3. IPPC MARKING TO BE DONE4. ADD 2-3 SHEETS B GRADE OF ALL THE ITEMS EXTRA ON TOP OF EACH BOX'),(117,'ETS  - 05/08/2017  -   ETA  -  10/09/2017'),(118,'50% FACE UP  &  50% FACE DOWN'),(119,'16MM COMPACT TOLERANCE ON THICKNESS : NO NEGATIVE TOLERANCE ALLOWED. THICKNESS VARIATION WITHIN ONE SHEET NOT TO EXCEED 0.3MM.'),(120,'DELIVERY ADDRESS : WEST MIDLANDS WAREHOUSE, BERMUDA PARK INDUSTRIAL ESTATE, ST.DAVIDS WAY, NUNEATON,WEST MIDLANDS,CV107SD.'),(121,'DELIVERY ADRESS : BONDING SHOP PARKHOUSE,PARKHOUSE INTERCHANGE,PARKHOUSE IND ESTATE,NEW CASTLE UNDER LYME,STAFFS,ST5 7FB.'),(122,'AGREED FREIGHT INCREASE SURCHARGE PER MONTH APPLICABLE. '),(123,'DELIVERY ADDRESS : GILBRAITH TRANSTORE BOLTON ROAD FREIGHT TERMINAL IRON STREET BLACKBURN BB2 3QQ');
        `,
  },
  {
    version: 7,
    description: "Create Customer Table",
    script: `
      CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT DEFAULT NULL,
          phone TEXT DEFAULT NULL,
          email TEXT DEFAULT NULL,
          contactPerson TEXT DEFAULT NULL,
          designation TEXT DEFAULT NULL,
          otherPhone TEXT DEFAULT NULL,
          url TEXT DEFAULT NULL,
          fax TEXT DEFAULT NULL,
          remark TEXT DEFAULT NULL,
          address TEXT DEFAULT NULL,
          city TEXT DEFAULT NULL,
          state TEXT DEFAULT NULL,
          zip TEXT DEFAULT NULL,
          country TEXT DEFAULT NULL,
          buyerAddress TEXT DEFAULT NULL,
          buyerCity TEXT DEFAULT NULL,
          buyerState TEXT DEFAULT NULL,
          buyerZipcode TEXT DEFAULT NULL,
          buyerCountry TEXT DEFAULT NULL,
          bankName TEXT DEFAULT NULL,
          bankBranch TEXT DEFAULT NULL,
          bankCity TEXT DEFAULT NULL,
          bankAddress TEXT DEFAULT NULL,
          bankState TEXT DEFAULT NULL,
          bankZip TEXT DEFAULT NULL,
          bankCountry TEXT DEFAULT NULL
      );
      INSERT INTO customers (id, name, email, designation, contactPerson, phone, fax, otherPhone, remark, url, address, city, state, country, zip, buyerAddress, buyerCity, buyerState, buyerZipcode, buyerCountry, bankName, bankBranch, bankCountry, bankState, bankZip, bankCity, bankAddress) VALUES 
(4, 'CROSSWATER LTD T/A SHOWERWALL PARKHOUSE INTERCHANGE', 'wendycleary@crosswater.co.uk', '', '', '+44 345 873 8840', '', '', '', '', 'PARKHOUSE INDUSTRIAL ESTATE', 'NEWCASTLE-UNDER-LYME', '', 'U.K.', 'ST5 7FB', 'DENHOLM GOOD LOGISTIC LTDTAMAR HOUSE ', 'SALTASH', 'CORNWALL', 'PL12 6LX', 'U.K.', '', '', '', '', '', '', ''),
(5, 'FOREST ONE AUSTRALIA PTY LTD', '', '', '', '', '', '', '', '', '601 VICTORIA STREETABBORTSFORD VIC 3067P.O.BOX 3010 ', 'BURNLEY ', 'NORTH ', 'AUSTRALIA', 'VIC 3121', 'FOREST ONE AUSTRALIA PTY LTD14-16 GREENLINK ROAD', 'BERRINBA ', '', 'QLD 4117', 'AUSTRALIA', '', '', '', '', '', '', ''),
(6, 'FLETCHER BUILDING LTD', '', '', '', '', '', '', '', '', '810 GREAT SOUTH ROAD', 'PENROSE ', 'AUCKLAND', 'NEWZEALAND', '', 'LAMINEX NZ-AUCKLAND31 ROCKRIDGE AVE', 'PENROSE', 'AUCKLAND ', '1061', 'NEWZEALAND', '', '', '', '', '', '', ''),
(7, 'THE LAMINEX GROUP', '', '', '', '', '', '', '', '', '90-94 TRAM ROAD', 'DONCASTER', '', 'AUSTRALIA', 'VIC 3108', 'THE LAMINEX GROUP130 SHARPS ROAD', 'MELBOURNE AIRPORT', 'PRECINCT', '', 'VIC 3045', '', '', '', '', '', '', ''),
(8, 'MAZONIT Y.C.R.L. LTD', '', '', '', '', '', '', '', '', '', 'KIBBUTZ', 'EINAT', 'ISRAEL', '48805', '', '', '', '', '', '', '', '', '', '', '', '');
`,
  },
  {
    version: 8,
    description: "Create Invoice Master",
    script: `CREATE TABLE IF NOT EXISTS invoiceMaster (
    invoiceId INTEGER PRIMARY KEY AUTOINCREMENT,
    customerOrderNo TEXT DEFAULT NULL,
    invoiceDate TEXT DEFAULT NULL,
    invoiceSerial TEXT DEFAULT NULL,
    invoicePiNo TEXT DEFAULT NULL,
    customerId INTEGER DEFAULT NULL,
    customerName TEXT DEFAULT NULL,
    customerAddress TEXT DEFAULT NULL,
    customerCity TEXT DEFAULT NULL,
    customerZip TEXT DEFAULT NULL,
    customerState TEXT DEFAULT NULL,
    customerCountry TEXT DEFAULT NULL,
    buyerAddress TEXT DEFAULT NULL,
    buyerCity TEXT DEFAULT NULL,
    buyerZip TEXT DEFAULT NULL,
    buyerState TEXT DEFAULT NULL,
    buyerCountry TEXT DEFAULT NULL,
    currency TEXT DEFAULT NULL,
    status TEXT DEFAULT NULL,
    discountType TEXT DEFAULT NULL,
    discountValue TEXT DEFAULT NULL,
    additionalChargeType TEXT DEFAULT NULL,
    additionalChargeValue TEXT DEFAULT NULL,
    reference TEXT DEFAULT NULL,
    totalQuantity TEXT DEFAULT NULL,
    totalAmount TEXT DEFAULT NULL,
    totalSquareMeters TEXT DEFAULT NULL,
    rounding TEXT DEFAULT NULL,
    netAmount TEXT DEFAULT NULL,
    deliveryTerms TEXT DEFAULT NULL,
    deliveryDetails TEXT DEFAULT NULL,
    shippingDetails TEXT DEFAULT NULL,
    transportationMode TEXT DEFAULT NULL,
    specialInstruction TEXT DEFAULT NULL,
    deliveryAt TEXT DEFAULT NULL,
    paymentTerms TEXT DEFAULT NULL,
    portOfDischarge TEXT DEFAULT NULL,
    dispatchTerms TEXT DEFAULT NULL,
    bankName TEXT DEFAULT NULL,
    bankBranch TEXT DEFAULT NULL,
    bankCity TEXT DEFAULT NULL,
    swiftNumber TEXT DEFAULT NULL,
    comments TEXT DEFAULT NULL,
    calculationType INTEGER DEFAULT NULL,
    bankAddress TEXT DEFAULT NULL,
    fsc TEXT DEFAULT NULL
);

INSERT INTO invoiceMaster (
    invoiceId, customerOrderNo, invoiceDate, invoiceSerial, invoicePiNo, customerId,
    customerName, customerAddress, customerCity, customerZip, customerState, customerCountry,
    buyerAddress, buyerCity, buyerZip, buyerState, buyerCountry, currency,
    status, discountType, discountValue, additionalChargeType, additionalChargeValue,
    reference, totalQuantity, totalAmount, totalSquareMeters, rounding, netAmount,
    deliveryTerms, deliveryDetails, shippingDetails, transportationMode,specialInstruction, deliveryAt, paymentTerms, portOfDischarge,
    dispatchTerms, deliveryAt, bankName, bankBranch, bankCity, swiftNumber, comments, calculationType,
    bankAddress, fsc
) VALUES
(20, '2488637', '2016-06-06', '49', '2488637/49', 11,
'INTERNATIONAL DECORATIVE SURFACES', 'ST.DAVIDS WAY, BERMUDA PARKNUNEATON WARWICKSHIRECV10 7SD', '', '', '', '',
'NOTIFY - NEPTUNE SHIPPING AGENCYHIGHER SHERWELL , SEVENSTONESCALLINGTON,CORNWALL,PL178H', '', '', '', '', 'GBP',
NULL, 'None', '', 'None', '',
'', '5600', '32280.0', '16670.080', '0.00', '32280',
'CIF', 'JULY 01, 2016', '', 'Sea','', 'ICD', 'ON 60 DAYS D.A. - L.C.', 'FELIXSTOWE',
'FELIXSTOWE (U.K)', 'FORTIS BANK S.A. / N.V.BRUSSELS', '', '', '', NULL, 2,
'ALL BELGIAN OFFICESBRUSSELS', ''),

(23, '2487600', '2016-06-10', '52', '2487600/52', 11,
'INTERNATIONAL DECORATIVE SURFACES', 'ST.DAVIDS WAY, BERMUDA PARKNUNEATON WARWICKSHIRECV10 7SD', '', '', '', '',
'NOTIFY - NEPTUNE SHIPPING AGENCYHIGHER SHERWELL , SEVENSTONESCALLINGTON,CORNWALL,PL178H', '', '', '', '', 'GBP',
NULL, 'None', '', 'Flat', '400',
'ADDITION - FREIGHT CHARGES', '3240', '39036.0', '9644.8324', '0.00', '39036',
'CIF', 'JULY 25, 2016', '','Sea','', 'ON 60 DAYS D.A. - L.C.', 'GRANGEMOUTH',
'GRANGEMOUTH (U.K)', 'FORTIS BANK S.A. / N.V.BRUSSELS', '', '', '', NULL, 2,
'ALL BELGIAN OFFICESBRUSSELS', ''),

(24, 'CW', '2024-11-30', 'S1', 'CW130', 4,
'CROSSWATER LTD T/A SHOWERWALL PARKHOUSE INTERCHANGE', 'PARKHOUSE INDUSTRIAL ESTATE', 'NEWCASTLE-UNDER-LYME', 'ST5 7FB', '', 'U.K.',
'DENHOLM GOOD LOGISTIC LTDTAMAR HOUSE ', 'SALTASH', 'PL12 6LX', 'CORNWALL', 'U.K.', 'GBP',
'', 'flat', '507', '', '0',
'', '5200', '62157', '15479.36', '0', '61650',
'CIF', 'MARCH 30, 2025', NULL, 'Sea','', 'BY T.T. – 50% ADVANCE ON 3/4th WEEK OF DECEMBER 50% ON RECEIPT OF DOCUMENTS', 'LIVERPOOL',
NULL, '', '', '', '', '', 'Per Sheet',
'', 'FSC MIX CREDIT SGSHK – COC  - 400076'),

(25, 'COTC-B1120204/145', '2025-01-13', '', 'COTC-B1120204/145', 5,
'FOREST ONE AUSTRALIA PTY LTD', '601 VICTORIA STREETABBORTSFORD VIC 3067P.O.BOX 3010 ', 'BURNLEY ', 'VIC 3121', 'NORTH ', 'AUSTRALIA',
'FOREST ONE AUSTRALIA PTY LTD14-16 GREENLINK ROAD', 'BERRINBA ', 'QLD 4117', '', 'AUSTRALIA', 'USD',
'', '', '0', 'flat', '500',
'', '1600', '76320', '4608', '0', '76820',
'CIF', 'FEBRUARY 14, 2025', NULL, 'Sea','', 'BY T.T.', 'BRISBANE',
NULL, '', '', '', '', '', 'Per Sheet',
'', ''),

(26, 'DPPL/149', '2025-01-17', 'SI2', 'PI2', 6,
'FLETCHER BUILDING LTD', '810 GREAT SOUTH ROAD', 'PENROSE ', '', 'AUCKLAND', 'NEWZEALAND',
'LAMINEX NZ-AUCKLAND31 ROCKRIDGE AVE', 'PENROSE', '1061', 'AUCKLAND ', 'NEWZEALAND', 'USD',
'', '', '0', 'flat', '450',
'', '840', '56209.2', '2497.25', '-0.2', '56659',
'CIF', 'MARCH 30, 2025', NULL, 'Sea','', 'BY T.T.', 'AUCKLAND',
NULL, '', '', '', '', '', 'Per Sheet',
'', ''),

(27, 'DPPL/168', '2025-03-06', 'SR3', 'PI3', 7,
'THE LAMINEX GROUP', '90-94 TRAM ROAD', 'DONCASTER', 'VIC 3108', '', 'AUSTRALIA',
'THE LAMINEX GROUP130 SHARPS ROAD', 'MELBOURNE AIRPORT', '', 'PRECINCT', 'VIC 3045', 'USD',
'', '', '0', 'flat', '1300',
'', '3693', '70762.92', '12106.41', '0.08', '72063',
'CIF', 'MARCH 31 , 2025', 'FCL - 20 FT', 'Sea','', 'BY T.T.', 'MELBOURNE',
NULL, '', '', '', '', '', 'Per Sheet',
'', ''),

(28, '16320 / 141/REV', '2025-01-08', 'Serial 16320', '16320 / 141/REV', 8,
'MAZONIT Y.C.R.L. LTD', '', 'KIBBUTZ', '48805', 'EINAT', 'ISRAEL',
'', '', '', '', '', 'USD',
'', '', '0', 'flat', '3750',
'', '2846', '51132.6', '8669.62', '0.4', '54883',
'CFR', NULL, NULL, 'Sea','', 'BY T.T.', 'ASHDOD',
NULL, '', '', '', '', '', 'Per Sheet',
'', '');
`,
  },
  {
    version: 9,
    description: "Create InvoiceDetails Table",
    script: `
      CREATE TABLE IF NOT EXISTS invoiceDetails (
        invoiceDetailId INTEGER PRIMARY KEY AUTOINCREMENT,
        invoiceId INTEGER DEFAULT NULL,
          customerId INTEGER DEFAULT NULL,
        containerType TEXT DEFAULT NULL,
        containerTo TEXT DEFAULT NULL,
        containerFrom TEXT DEFAULT NULL,
        length TEXT DEFAULT NULL,
        width TEXT DEFAULT NULL,
        thickness TEXT DEFAULT NULL,
        squareMeter TEXT DEFAULT NULL,
        materialGrade TEXT DEFAULT NULL,
        brandName TEXT DEFAULT NULL,
        materialQuality TEXT DEFAULT NULL,
        finishType TEXT DEFAULT NULL,
        thicknessDetail TEXT DEFAULT NULL,
        quantity TEXT DEFAULT NULL,
        rate TEXT DEFAULT NULL,
        remarks TEXT DEFAULT NULL,
        designType TEXT DEFAULT NULL,
        prefixCode TEXT DEFAULT NULL,
        grossWeight INTEGER DEFAULT NULL,
        netWeight INTEGER DEFAULT NULL,
        boxType TEXT DEFAULT NULL,
        tableIndex INTEGER DEFAULT NULL
      );
INSERT INTO invoiceDetails (invoiceDetailId, invoiceId, customerId, containerType, containerTo, containerFrom, length, width, thickness, squareMeter, materialGrade, brandName, materialQuality, finishType, thicknessDetail, quantity, rate, remarks, designType, prefixCode, grossWeight, netWeight, boxType, tableIndex) VALUES(68, 20, 1, 'BOX 150', '8', '1', '2440', '1220', '0.7', '9525.7600', 'SHPAWHGLZZZZ30007', '', NULL, 'GL+F', 'Single Side', '3200', '7.14', NULL, '5203', '49', 10602, 1, '101 X 52 X 14', 1),(69, 20, 1, 'BOX 150', '14', '9', '2440', '1220', '0.7', '7144.3200', 'ALBAWHITZMAZ30070', '', NULL, 'MT', 'Single Side', '2400', '3.93', NULL, '5002', '49', 7951, 1, '101 X 52 X 14', 2),(72, 22, 1, 'BOX 135', '18', '1', '3050', '1300', '0.6', '17842.5', 'WHITE ', 'BALANCE', NULL, 'MT', 'Single Side', '4500', '1.6', NULL, '5002', '9181', 17525, 1, '125 X 55 X 9', 1),(73, 22, 1, 'BOX 135', '19', '19', '3050', '1300', '0.6', '317.2', 'PF', '', NULL, 'GL+F', 'Single Side', '80', '3.55', NULL, '5101', '9181', 0, 1, '', 2),(74, 22, 1, 'BOX 135', '19', '19', '3050', '1300', '0.6', '79.3', 'PF', '', NULL, 'T.C.+F', 'Single Side', '20', '3.55', NULL, '6825', '9181', 0, 1, '', 3),(118, 24, 4, 'BOX 150', NULL, '1', '2440', '1220', '0.7', '1190.72', 'SHPAAQICZZZZ30007', '', NULL, 'GL+F', 'Single Side', '400', '10.50', '', '5010', '130', '', 1175, '', 0),(119, 24, 4, 'BOX 150', NULL, '2', '2440', '1220', '0.7', '893.04', 'SHPAAQICZZZZ30007', '', NULL, 'GL+F', 'Single Side', '300', '10.50', '', '5010', '130', '', 881, '', 1),(120, 24, 4, 'BOX 150', NULL, '3', '2440', '1220', '0.7', '595.36', 'SHLABICZAGLC30007', '', NULL, 'GL+F', 'Single Side', '200', '9.00', '', '7206', '130', '', 588, '', 2),(121, 24, 4, 'BOX 150', NULL, '4', '2440', '1220', '0.7', '1190.72', 'SHLABISTZGLZ30007', '', NULL, 'GL+F', 'Single Side', '400', '13.20', '', '5101 F75', '130', '', 1175, '', 3),(122, 24, 4, 'BOX 150', NULL, '5', '2440', '1220', '0.7', '595.36', 'SHLABISTZGLZ30007', '', NULL, 'GL+F', 'Single Side', '200', '13.20', '', '5101 F75', '130', '', 588, '', 4),(123, 24, 4, 'BOX 150', NULL, '6', '2440', '1220', '0.7', '893.04', 'SHLABRMAZGLC30007', '', NULL, 'GL+F', 'Single Side', '300', '10.50', '', '9339', '130', '', 881, '', 5),(124, 24, 4, 'BOX 150', NULL, '7', '2440', '1220', '0.7', '893.04', 'SHLACAMAZGLZ30007', '', NULL, 'GL+F', 'Single Side', '300', '9.00', '', '7221', '130', '', 881, '', 6),(125, 24, 4, 'BOX 150', NULL, '8', '2440', '1220', '0.7', '595.36', 'SHALUNAZGLZ30007', '', NULL, 'GL+F', 'Single Side', '200', '13.20', '', '5101 F125', '130', '', 588, '', 7),(126, 24, 4, 'BOX 150', NULL, '9', '2440', '1220', '0.7', '1190.72', 'SHLAOPBTZ00330008', '', NULL, 'D105', 'Single Side', '400', '10.71', '', '8213', '130', '', 1175, '', 8),(127, 24, 4, 'BOX 150', NULL, '10', '2440', '1220', '0.7', '297.68', 'SHLAOPBTZ00330008', '', NULL, 'D105', 'Single Side', '100', '10.71', '', '8213', '130', '', 294, '', 9),(128, 24, 4, 'BOX 150', NULL, '12', '2440', '1220', '0.7', '595.36', 'SHLASLSIZMAZ30008', '', NULL, 'D96', 'Single Side', '200', '10.50', '', '9205', '130', '', 588, '', 11),(129, 24, 4, 'BOX 2440X1220X0.8', NULL, '13', '2440', '1220', '0.8', '893.04', 'SHPA9393ZYSZ30008', '', NULL, 'S3', 'Single Side', '300', '24.51', '', '9393(NON FSC)', '130', '', 1007, '', 12),(130, 24, 4, 'BOX 2440X1220X0.8', NULL, '15', '2440', '1220', '0.8', '893.04', 'SHPA9396ZZZZ30008', '', NULL, 'S6', 'Single Side', '300', '24.51', '', '9396 (NON FSC)', '130', '', 1007, '', 14),(131, 24, 4, 'BOX 2440X1220X0.8', '18', '16', '2440', '1220', '0.8', '3572.16', 'ALBAWHITZMAN30080', '', NULL, 'MT', 'Single Side', '1200', '5.01', '', '5002', '130', '', 4029, '', 15),(132, 24, 4, 'BOX 150', NULL, '11', '2440', '1220', '0.7', '297.68', 'SHLAGTZ00430008', '', NULL, 'D105', 'Single Side', '100', '10.71', '', '8217', '130', '', 294, '', 10),(133, 24, 4, 'BOX 2440X1220X0.8', NULL, '14', '2440', '1220', '0.8', '893.04', 'SHPA9399ZZZZ30008', '', NULL, 'S6', 'Single Side', '300', '24.51', '', '9399(NON FSC)', '130', '', 1007, '', 13),(134, 25, 5, 'BOX 2400X1200X3', NULL, '1', '2400', '1200', '3', '288', 'CONCRETE', '', NULL, 'WHITE MT', 'Double Side', '100', '47.70', '', '9253 D96+F ', '145', '', 1218, '', 0),(135, 25, 5, 'BOX 2400X1200X3', '12', '5', '2400', '1200', '3', '2304', 'NEWYORK', 'WHITE TILE', NULL, 'WHITE MT', 'Double Side', '800', '47.70', '', '5203 D87+F ', '145', '', 9746, '', 3),(136, 25, 5, 'BOX 2400X1200X3', NULL, '4', '2400', '1200', '3', '288', 'IRON AGE', '', NULL, 'WHITE MT', 'Double Side', '100', '47.70', '', '7253 GL+F', '145', '', 1218, '', 2),(137, 25, 5, 'BOX 2400X1200X3', '15', '14', '2400', '1200', '3', '576', 'SLATE', '', NULL, 'WHITE MT', 'Double Side', '200', '47.70', '', '9249 D96+F', '145', '', 2436, '', 5),(138, 25, 5, 'BOX 2400X1200X3', NULL, '16', '2400', '1200', '3', '288', 'WHITE', 'MARBLE', NULL, 'WHITE MT', 'Double Side', '100', '47.70', '', '9254 GL+F ', '145', '', 1218, '', 6),(139, 25, 5, 'BOX 2400X1200X3', NULL, '13', '2400', '1200', '3', '288', 'PUMICE', '', NULL, 'WHITE MT', 'Double Side', '100', '47.70', '', '9326 D96+F ', '145', '', 1218, '', 4),(140, 25, 5, 'BOX 2400X1200X3', '3', '2', '2400', '1200', '3', '576', 'DESIGNER', 'WHITE TILE', NULL, 'WHITE MT', 'Double Side', '200', '47.70', '', '5203 D79+F ', '145', '', 2436, '', 1),(141, 26, 6, 'BOX 2700X1200X4.5', '2', '1', '2700', '1200', '4.5', '388.8', '9590298', '2886759', NULL, 'WHITE MT+F-FR', 'Double Side', '120', '72.81', '', 'POLAR WHITE GL+F ', 'NZ 149', '', 2467, '', 0),(142, 26, 6, 'BOX 2400X1200X4.5', '8', '3', '2400', '1200', '4.5', '1036.8', '9590287', '2886759', NULL, 'WHITE MT+F-FR', 'Double Side', '360', '63.75', '', 'CONCRETE 9253 D96+F ', 'NZ 149', '', 6578, '', 1),(143, 26, 6, 'BOX 2440X1220X4.5', '10', '9', '2440', '1220', '4.5', '357.22', '9590210', '2886759', NULL, 'WHITE MT+F-FR', 'Double Side', '120', '67.93', '', 'POLAR WHITE D69+F ', 'NZ 149', '', 2267, '', 2),(144, 26, 6, 'BOX 2440X1220X4.5', NULL, '11', '2440', '1220', '4.5', '178.61', '9590265', '2886759', NULL, 'WHITE MT+F-FR', 'Double Side', '60', '69.05', '', 'BLACK D87+F', 'NZ 149', '', 1133, '', 3),(145, 26, 6, 'BOX 2440X1220X4.5', '14', '12', '2440', '1220', '4.5', '535.82', '9590276', '2886759', NULL, 'WHITE MT+F-FR', 'Double Side', '180', '67.93', '', 'POLAR WHITE D90+F', 'NZ 149', '', 3400, '', 4),(146, 27, 7, 'BOX 2410X1205X2.7', '2', '1', '2410', '1205', '2.7', '580.81', '959019', '3840550', NULL, 'WHITE MT+F', 'Double Side', '200', '49.70', '', 'POLAR WHITE D69+F ', 'VIC 168', '', 2211, '', 0),(147, 27, 7, 'BOX 115', NULL, '17', '2440', '1220', '0.6', '872.2', '879484', '3840550', NULL, 'ER+F', 'Double Side', '293', '10.44', '', 'BLACK 5071', 'VIC 168', '', 738, '', 4),(148, 27, 7, 'BOX 115', '16', '14', '2440', '1220', '0.6', '3572.16', '879479', '3840550', NULL, 'ER', 'Double Side', '1200', '9.12', '', 'WHITE 5102', 'VIC 168', '', 3022, '', 3),(149, 27, 7, 'BOX 3050X1300X0.6', '13', '11', '3050', '1300', '0.6', '4758', '879480', '3840550', NULL, 'ER', 'Double Side', '1200', '12.15', '', 'WHITE 5102', 'VIC 168', '', 4025, '', 2),(150, 27, 7, 'BOX 2410X1205X2.7', '10', '3', '2410', '1205', '2.7', '2323.24', '988839', '3840550', NULL, 'WHITE MT', 'Double Side', '800', '40.30', '', 'WHITE GL+F', 'VIC 168', '', 8845, '', 1),(151, 28, 8, 'BOX 12', '6', '1', '3050', '1300', '12', '594.75', '', '', NULL, 'MT', 'Double Side', '150', '127', '', '5102 + 5102', '141', '', 10063, '', 0),(152, 28, 8, 'BOX 2440x1220x3', NULL, '9', '2440', '1220', '3', '297.68', '', '', NULL, 'MT', 'Double Side', '100', '26.25', '', '5102 + 5102', '', '', 1259, '', 2),(153, 28, 8, 'BOX 150', NULL, '10', '2440', '1220', '0.7', '440.57', '6939', '', NULL, 'D54', 'Double Side', '148', '11', '', '6939', '141', '', 435, '', 3),(154, 28, 8, 'BOX 150', NULL, '10', '2440', '1220', '0.7', '428.66', '8919', '', NULL, 'D54', 'Double Side', '144', '10.75', '', '6976', '141', '', 423, '', 4),(155, 28, 8, 'BOX 150', NULL, '11', '2440', '1220', '0.7', '910.9', '3303', '', NULL, 'SU', 'Double Side', '306', '7.50', '', '5101', '141', '', 899, '', 5),(156, 28, 8, 'BOX 150', NULL, '12', '2440', '1220', '0.7', '893.04', '3309', '', NULL, 'SU', 'Double Side', '300', '7.75', '', '5024', '141', '', 881, '', 6),(157, 28, 8, 'BOX 12', '8', '7', '3050', '1300', '12', '198.25', '', '', NULL, 'MT', 'Double Side', '50', '127', '', '5024 + 5024', '141', '', 3354, '', 1),(158, 28, 8, 'BOX 150', NULL, '13', '2440', '1220', '0.7', '193.49', '6944', '', NULL, 'D54', 'Double Side', '65', '11', '', '6944', '141', '', 191, '', 7),(159, 28, 8, 'BOX 150', NULL, '13', '2440', '1220', '0.7', '452.47', '6959', '', NULL, 'D54', 'Double Side', '152', '11', '', '6959', '141', '', 447, '', 8),(160, 28, 8, 'BOX 150', NULL, '13', '2440', '1220', '0.7', '357.22', '5224', '', NULL, 'T.C.', 'Double Side', '120', '0', '', '5224', '141', '', 353, '', 9),(161, 28, 8, 'BOX 150', NULL, '14', '2440', '1220', '0.7', '922.81', '3111', 'EXTRA MT', NULL, 'MT', 'Single Side', '310', '7.50', '', '5203', '141', '', 911, '', 10),(162, 28, 8, 'BOX 2440X1220X0.8', NULL, '15', '2440', '1220', '0.8', '907.92', '3209', '', NULL, 'D35', 'Single Side', '305', '10.50', '', '5102', '141', '', 1024, '', 11),(163, 28, 8, 'BOX 2440X1220X0.8', NULL, '16', '2440', '1220', '0.8', '148.84', '5071', '', NULL, 'D44+F', 'Single Side', '50', '12', '', '5071', '141', '', 168, '', 13),(164, 28, 8, 'BOX 2440X1220X0.8', NULL, '16', '2440', '1220', '0.8', '178.61', '9326', '', NULL, 'D105', 'Single Side', '60', '12.5', '', '9326', '141', '', 201, '', 14),(165, 28, 8, 'BOX 2440X1220X0.8', NULL, '17', '2440', '1220', '0.8', '175.63', '9351', '', NULL, 'D105', 'Single Side', '59', '12.5', '', '9351', '141', '', 198, '', 15),(166, 28, 8, 'BOX 2440X1220X0.8', NULL, '16', '2440', '1220', '0.8', '497.13', '6030', '', NULL, 'D180', 'Single Side', '167', '16.30', '', '6030', '141', '', 561, '', 12),(167, 28, 8, 'BOX 2440X1220X0.8', NULL, '17', '2440', '1220', '0.8', '297.68', '5223', '', NULL, 'D189+F', 'Single Side', '100', '0', '', '5223', '141', '', 336, '', 16),(168, 28, 8, 'BOX 2440X1220X0.8', NULL, '17', '2440', '1220', '0.8', '29.77', '5223', '', NULL, 'D189+F', 'Single Side', '10', '15', '', '5223', '141', '', 34, '', 17),(169, 28, 8, 'BOX 115', NULL, '18', '2440', '1220', '0.6', '446.52', '3727', '', NULL, 'SU+F', 'Single Side', '150', '7.25', '', '5033', '141', '', 378, '', 18),(170, 28, 8, 'BOX 1.0', NULL, '18', '2440', '1220', '1', '297.68', '', '', NULL, '7SE', 'Single Side', '100', '13.50', '', '6968', '141', '', 420, '', 19);

    `,
  },
  {
    version: 10,
    description: "Create Invoice Instructions",
    script: `CREATE TABLE IF NOT EXISTS invoiceInstruction (
  invoiceId INTEGER DEFAULT NULL,
  instructionId INTEGER DEFAULT NULL,
  invoiceInstruction TEXT DEFAULT NULL,
  instructionIndex INTEGER DEFAULT NULL
);

INSERT INTO invoiceInstruction (
  invoiceId,
  instructionId,
  invoiceInstruction,
  instructionIndex
) VALUES 
  (22, 14, 'ALL SHEETS TO BE PRODUCED WITH OVERLAY.', 1),
  (22, 15, 'SHEETS SHOULD PASS BOILING WATER NEMA LD TEST PLUS 70 MINUTES EN438 TEST.', 2),
  (22, 16, 'STUFFING SHOULD BE AS PER PLAN AND PHOTOGRAPHS SHOULD BE SUPPLIED WITH B/L.', 3),
  (24, 58, 'BOX NOS 1 to 5      - MARK GW  BOX NOS 6 to 17     - MARK SHORE', 0),
  (24, 100, 'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE', 1),
  (24, 101, 'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.', 2),
  (25, 100, 'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE', 0),
  (25, 101, 'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.', 1),
  (25, 122, 'AGREED FREIGHT INCREASE SURCHARGE PER MONTH APPLICABLE. ', 2),
  (25, 109, '1.ALL CRATES TO BE BRANDED - BRISBANE - COTC / B1008765\n2. SHEETS TO BE BARCODED ON THE BACK AS PER GUNNERSEN ARTWORK\n3. FUMIGATION WITH METHYL BROMIDE\n4. ISPM 15 - ISPM PACKING DECLARATION REQUIRED\n5. PACKING DECLARATION & NEWLY MANUFACTURERS PRODUCT CERTIFICATE REQUIRED WITH ORIGINAL DOCUMENTS ON LETTER HEAD.', 3),
  (26, 100, 'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE', 0),
  (26, 101, 'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.', 1),
  (26, 122, 'AGREED FREIGHT INCREASE SURCHARGE PER MONTH APPLICABLE. ', 2),
  (27, 100, 'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE', 0),
  (27, 101, 'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.', 1),
  (27, 122, 'AGREED FREIGHT INCREASE SURCHARGE PER MONTH APPLICABLE. ', 2);
`,
  },
  {
    version: 11,
    description: "Create invoiceBottomNote",
    script: `CREATE TABLE IF NOT EXISTS invoiceBottomNote (
  invoiceId INTEGER DEFAULT NULL,
  bottomNoteId INTEGER DEFAULT NULL,
  bottomNote TEXT DEFAULT NULL,
  bottomNoteIndex INTEGER DEFAULT NULL,
  PRIMARY KEY (invoiceId, bottomNoteId)
);
INSERT INTO invoiceBottomNote (
  invoiceId,
  bottomNoteId,
  bottomNote,
  bottomNoteIndex
) VALUES
  (24, 8, 'BOX NOS. 5 TO 11 LINER FACE DOWN', 0),
  (24, 5, 'THIS EXPORT IS UNDER OBLIGATION AGAINST OUR QUANTITY BASED ADVANCE LICENCE APPLICATION SUBMITTED TO THE J.D.G.F.T,AHMEDABAD VIDE FILE NO. DATED. AUTHORISATION NO.', 1),
  (24, 10, 'THE EXPORTER  (INR EX 0891012222 EC004) OF THE PRODUCTS COVERED BY THIS  DOCUMENT DECLARES THAT, EXCEPT WHERE OTHERWISE CLEARLY INDICATED, THESE PRODUCTS ARE OF INDIAN PREFERENTIAL ORIGIN ACCORDING TO RULES OF ORIGIN OF THE GENERALISED SYSTEM OF PREFERENCES OF THE EUROPEAN UNION & THAT THE ORIGIN CRITERION MET IS W.4823', 2),
  (25, 11, 'GST NO. 24 AABCA 2800 Q1ZU', 0),
  (25, 12, 'IGST PAYMENT - PAID / LUT - BOND', 1),
  (25, 5, 'THIS EXPORT IS UNDER OBLIGATION AGAINST OUR QUANTITY BASED ADVANCE LICENCE APPLICATION SUBMITTED TO THE J.D.G.F.T,AHMEDABAD VIDE FILE NO. DATED. AUTHORISATION NO.', 4),
  (25, 4, '"I/WE UNDERTAKE TO ABIDE BY PROVISIONS OF FOREIGN EXCHANGE MANAGEMENT ACT,1999,AS AMENDED FROM TIME TO TIME,INCLUDING REALIZATION / REPATRIATION OF FOREIGN EXCHANGE TO / FROM INDIA"', 5),
  (25, 2, 'CIN NO.L20100GJ1991PLC016763', 2),
  (25, 6, 'WEBSITE - www.alfaica.com', 3),
  (26, 11, 'GST NO. 24 AABCA 2800 Q1ZU', 0),
  (26, 5, 'THIS EXPORT IS UNDER OBLIGATION AGAINST OUR QUANTITY BASED ADVANCE LICENCE APPLICATION SUBMITTED TO THE J.D.G.F.T,AHMEDABAD VIDE FILE NO. DATED. AUTHORISATION NO.', 4),
  (26, 4, '"I/WE UNDERTAKE TO ABIDE BY PROVISIONS OF FOREIGN EXCHANGE MANAGEMENT ACT,1999,AS AMENDED FROM TIME TO TIME,INCLUDING REALIZATION / REPATRIATION OF FOREIGN EXCHANGE TO / FROM INDIA"', 5),
  (26, 12, 'IGST PAYMENT - PAID / LUT - BOND', 1),
  (26, 2, 'CIN NO.L20100GJ1991PLC016763', 2),
  (26, 6, 'WEBSITE - www.alfaica.com', 3),
  (27, 11, 'GST NO. 24 AABCA 2800 Q1ZU', 0),
  (27, 12, 'IGST PAYMENT - PAID / LUT - BOND', 1),
  (27, 3, '"WE INTEND TO CLAIM RODTEP BENEFIT FOR ALL EXPORT ITEM LISTED AS ABOVE IN INVOICE".', 4),
  (27, 6, 'WEBSITE - www.alfaica.com', 3),
  (27, 2, 'CIN NO.L20100GJ1991PLC016763', 2),
  (28, 11, 'GST NO. 24 AABCA 2800 Q1ZU', 0),
  (28, 12, 'IGST PAYMENT - PAID / LUT - BOND', 1),
  (28, 2, 'CIN NO.L20100GJ1991PLC016763', 2),
  (28, 5, 'THIS EXPORT IS UNDER OBLIGATION AGAINST OUR QUANTITY BASED ADVANCE LICENCE APPLICATION SUBMITTED TO THE J.D.G.F.T,AHMEDABAD VIDE FILE NO. DATED. AUTHORISATION NO.', 4),
  (28, 4, '"I/WE UNDERTAKE TO ABIDE BY PROVISIONS OF FOREIGN EXCHANGE MANAGEMENT ACT,1999,AS AMENDED FROM TIME TO TIME,INCLUDING REALIZATION / REPATRIATION OF FOREIGN EXCHANGE TO / FROM INDIA"', 5),
  (28, 6, 'WEBSITE - www.alfaica.com', 3);
`,
  },
  {
    version: 12,
    description: "Create Final Invoice Table",
    script: `CREATE TABLE IF NOT EXISTS finalinvoice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoiceId INTEGER DEFAULT NULL,
  customerName TEXT DEFAULT NULL,
  buyerName TEXT DEFAULT NULL,
  buyerAddress TEXT DEFAULT NULL,
  buyerCity TEXT DEFAULT NULL,
  buyerZip TEXT DEFAULT NULL,
  buyerState TEXT DEFAULT NULL,
  buyerCountry TEXT DEFAULT NULL,
  consigneeName TEXT DEFAULT NULL,
  consigneeAddress TEXT DEFAULT NULL,
  consigneeCity TEXT DEFAULT NULL,
  consigneeZip TEXT DEFAULT NULL,
  consigneeState TEXT DEFAULT NULL,
  consigneeCountry TEXT DEFAULT NULL,
  bankName TEXT DEFAULT NULL,
  bankAddress TEXT DEFAULT NULL,
  bankCity TEXT DEFAULT NULL,
  bankZip TEXT DEFAULT NULL,
  bankState TEXT DEFAULT NULL,
  bankCountry TEXT DEFAULT NULL,
  bankAsConsignee INTEGER DEFAULT 0,
  termsOfDp TEXT DEFAULT NULL,
  deliveryTerms TEXT DEFAULT NULL,
  precarriage TEXT DEFAULT NULL,
  vesselNo TEXT DEFAULT NULL,
  portOfDischarge TEXT DEFAULT NULL,
  originOfGoods TEXT DEFAULT NULL,
  receiptPlace TEXT DEFAULT NULL,
  loadingPort TEXT DEFAULT NULL,
  finalDestination TEXT DEFAULT NULL,
  dischargeTerms TEXT DEFAULT NULL,
  privateRemark TEXT DEFAULT NULL,
  bottomNote TEXT DEFAULT NULL,
  bankShortName TEXT DEFAULT NULL,
  branchName TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  panNo TEXT DEFAULT NULL,
  adCode TEXT DEFAULT NULL,
  acCode TEXT DEFAULT NULL,
  iec TEXT DEFAULT NULL,
  comment TEXT DEFAULT NULL,
  invoiceDate TEXT DEFAULT NULL,
  finalInvoice TEXT DEFAULT NULL
);
INSERT INTO finalinvoice (invoiceId, customerName, buyerName, buyerAddress, buyerCity, buyerZip, buyerState, buyerCountry, consigneeName, consigneeAddress, consigneeCity, consigneeZip, consigneeState, consigneeCountry, bankName, bankAddress, bankCity, bankZip, bankState, bankCountry, bankAsConsignee, termsOfDp, deliveryTerms, precarriage, vesselNo, portOfDischarge, originOfGoods, receiptPlace, loadingPort, finalDestination, dischargeTerms, privateRemark, bottomNote, bankShortName, branchName, city, panNo, adCode, acCode, iec, comment, invoiceDate, finalInvoice) VALUES (24, 'CROSSWATER LTD T/A SHOWERWALL PARKHOUSE INTERCHANGE', '', 'DENHOLM GOOD LOGISTIC LTD\nTAMAR HOUSE ', 'SALTASH', 'PL12 6LX', 'CORNWALL', 'U.K.', 'CROSSWATER LTD T/A SHOWERWALL PARKHOUSE INTERCHANGE', 'PARKHOUSE INDUSTRIAL ESTATE', 'NEWCASTLE-UNDER-LYME', 'ST5 7FB', '', 'U.K.', '', '', '', '', '', '', 0, 'BY T.T. – 50% ADVANCE ON 3/4th WEEK OF DECEMBER\n                50 % ON RECEIPT OF DOCUMENTS', 'CIF', 'B/L - MEDUVW882850', 'MSC PALOMA – V. IS501A', 'LIVERPOOL', 'INDIA', 'KHODIYAR', 'MUNDRA / PIPAVAV', 'U.K.', '', 'CROSSWATER   /   CW/130  /  LIVERPOOL   /   U.K.', '', '', '', '', '', '', '', '', '', '2024-12-31', 'EXP/2024-25/113'),(25, 'FOREST ONE AUSTRALIA PTY LTD', '', 'FOREST ONE AUSTRALIA PTY LTD\n14-16 GREENLINK ROAD', 'BERRINBA ', 'QLD 4117', '', 'AUSTRALIA', 'FOREST ONE AUSTRALIA PTY LTD', '601 VICTORIA STREET\nABBORTSFORD VIC 3067\nP.O.BOX 3010 ', 'BURNLEY ', 'VIC 3121', 'NORTH ', 'AUSTRALIA', '', '', '', '', '', '', 0, 'BY T.T.', 'CIF', 'B/L - CMN0112356', 'STRATFORD / V. 0FBDUE1NL', 'BRISBANE', 'INDIA', 'ICD - AHMEDABAD', 'MUNDRA / PIPAVAV', 'AUSTRALIA', '', 'FOREST ONE   /   COTC-B1120204/145   /   BRISBANE  /   AUSTRALIA', '', '', '', '', '', '', '', '', '', '2025-02-27', 'EXP/2024-25/137'),(26, 'FLETCHER BUILDING LTD', '', 'LAMINEX NZ-AUCKLAND\n31 ROCKRIDGE AVE\n', 'PENROSE', '1061', 'AUCKLAND ', 'NEWZEALAND', 'FLETCHER BUILDING LTD', '810 GREAT SOUTH ROAD', 'PENROSE ', '', 'AUCKLAND', 'NEWZEALAND', '', '', '', '', '', '', 0, 'BY T.T', 'CIF', 'B/L - CMN0112389', 'ATLANTA/ V. 0KCB0E1NL', 'AUCKLAND', 'INDIA', 'ICD - AHMEDABAD', 'MUNDRA / PIPAVAV', 'NEWZEALAND', '', 'THE LAMINEX GROUP   /    DPPL/149   /    AUCKLAND   /   NEWZEALAND', '', '', '', '', '', '', '', '', '', '2025-03-07', 'EXP/2024-25/141'),(27, 'THE LAMINEX GROUP', '', 'THE LAMINEX GROUP\n130 SHARPS ROAD', 'MELBOURNE AIRPORT', '', 'PRECINCT', 'VIC 3045', 'THE LAMINEX GROUP', '90-94 TRAM ROAD', 'DONCASTER', 'VIC 3108', '', 'AUSTRALIA', '', '', '', '', '', '', 0, 'BY T.T.', 'CIF', 'B/L - CMN0112487', 'HAMBURG / V. 0FBE2E1NL', 'MELBOURNE', 'INDIA', 'ICD - AHMEDABAD', 'MUNDRA / PIPAVAV', 'AUSTRALIA', '', 'THE LAMINEX GROUP   /    DPPL/168   /   MELBOURNE  /   AUSTRALIA', '', '', '', '', '', '', '', '', '', '2025-03-28', 'EXP/2024-25/151'),(28, 'MAZONIT Y.C.R.L. LTD', '', '', '', '', '', '', 'MAZONIT Y.C.R.L. LTD', '', 'KIBBUTZ', '48805', 'EINAT', 'ISRAEL', '', '', '', '', '', '', 0, 'BY T.T.', 'CFR', 'BL - MEDUVO248904', 'MSC REGULUS - IS504A', 'ASHDOD', 'INDIA', 'ICD - AHMEDABAD', 'MUNDRA / PIPAVAV', 'ISRAEL', '', 'MAZONIT    /     MAZO-16320/141   /    ASHDOD   /   ISRAEL', '', '', '', '', '', '', '', '', '', '2025-01-28', '16320 / 141/REV');
 `,
  },
  {
    version: 13,
    description: "update invoice master",
    script: `ALTER TABLE invoiceMaster ADD transportationMode INTEGER DEFAULT NULL`,
  },
  {
    version: 14,
    description: "update invoice master",
    script: `ALTER TABLE invoiceMaster ADD deliveryAt INTEGER DEFAULT NULL`,
  },
  {
    version: 15,
    description: "update invoice master",
    script: `ALTER TABLE invoiceMaster ADD specialInstruction TEXT DEFAULT NULL`,
  },
  {
    version: 16,
    description: "Add new fields to company table",
    script: `
      ALTER TABLE company ADD telephone TEXT DEFAULT NULL;
      ALTER TABLE company ADD email TEXT DEFAULT NULL;
      ALTER TABLE company ADD website TEXT DEFAULT NULL;
      ALTER TABLE company ADD remark2 TEXT DEFAULT NULL;
    `,
  },
  {
    version: 17,
    description: "Add logoPath to Company Table",
    script: `
      ALTER TABLE company ADD COLUMN logoPath TEXT DEFAULT NULL;
    `,
  },
];
// db.run("DELETE FROM migrations WHERE version = ?", [13]);
// db.run("ALTER TABLE invoiceMaster ADD transportationMode INTEGER DEFAULT NULL");
// Ensure Migrations Table Exists
db.run(
  `
  CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER UNIQUE NOT NULL,
      description TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      logger.error("❌ Error Creating Migrations Table:", err.message);
      return;
    }

    db.all("SELECT version FROM migrations", (err, rows) => {
      if (err) {
        logger.error("❌ Error Fetching Migrations:", err.message);
        return;
      }

      console.log(rows);
      const appliedVersions = rows.map((row) => row.version);

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        migrations.forEach((migration) => {
          if (!appliedVersions.includes(migration.version)) {
            db.exec(migration.script, (err) => {
              if (err) {
                logger.error(`❌ Migration ${migration.version} Failed:`, err);
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
);

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

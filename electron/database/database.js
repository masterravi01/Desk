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
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          containerName TEXT DEFAULT NULL,
          containerType TEXT DEFAULT NULL,
          width REAL DEFAULT NULL,
          height REAL DEFAULT NULL,
          weight REAL DEFAULT NULL,
          length INTEGER DEFAULT NULL
        );
        INSERT INTO containers (id, containerName, containerType, width, height, weight, length) VALUES 
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
    description: "Create System Parameter",
    script: `
      DROP TABLE IF EXISTS systemparameter;
      CREATE TABLE systemparameter (
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
        DROP TABLE IF EXISTS instruction;
        CREATE TABLE instruction (
            BID INTEGER PRIMARY KEY AUTOINCREMENT,
            Instruction TEXT DEFAULT NULL
        );
        INSERT INTO instruction (BID, Instruction) VALUES
        (14,'ALL SHEETS TO BE PRODUCED WITH OVERLAY.'),(15,'SHEETS SHOULD PASS BOILING WATER NEMA LD TEST PLUS 70 MINUTES EN438 TEST.'),(16,'STUFFING SHOULD BE AS PER PLAN AND PHOTOGRAPHS SHOULD BE SUPPLIED WITH B/L.'),(17,'GUIDING ROPE & SPACER SHOULD BE PUT IN THE CONTAINER AND STAKING OF PALLETS INSIDE THE CONTAINER SHOULD NOT BE MORE THAN 10 PALLETS ONE OVER THE OTHER AS DISCUSSED.'),(18,'\"MADE IN INDIA\" SHOULD BE MENTIONED ON EACH & EVERY LABEL FOR PALLETS.'),(19,'IMPORTED KRAFT PAPER TO BE USED FOR BACKING FOR ALL THE SHEETS.'),(20,'BOX NOS 1 to 17 -  MARK GW.'),(21,'PACKED IN STRONG WOODEN BOX.'),(22,'BOX NOS - 1 - 2   - MARK FIP  BOX NOS - 3 - 7   - MARK SICIL  BOX NOS - 8     - MARK IDW  BOX NOS - 9 - 18 - MARK ICAP (50% FACE UP - 50% FACE DOWN).'),(23,'THE QUALITY OF SANDING AND THE BACKSIDE APPEARANCE SHOULD BE VERY GOOD.'),(24,'PACKING IN DRUM.'),(25,'LOGO - \"DECOTON BY TONELLI\"'),(26,'YELLOW STICKER TO BE PASTED ON 9287NEW ABOVE THE FILM.'),(27,'ON SL21 - SR - PF - PUT STICKER ON THE FILM.'),(28,'LOGO - \"DIAMOND\" AND \"VACO\" TO BE PUT ON ALL SHEETS.'),(29,'1. CC - ONLY TWO LAYERS OF 5021 BELOW DECOR PAPER.  2.  PACKING IN DRUMS.'),(30,'LOGO \"REAROLAM\" PRINTED ON THE BACKSIDE OF ALL THE HPL.'),(31,'ALL OMEGA BRAND LAMINATES TO BE PRODUCED WITH INDIAN KRAFT PAPER.'),(32,'PLEASE INFORM THE REFERENCE NO.'),(33,'ALL LABORATORY GRADE LAMINATES TO BE COOKED AT 5 DEGREE HIGHER TEMPERATURE.'),(34,'FILM TO BE GIVEN ON ITEMS MENTIONED ABOVE.'),(35,'1. Bangle type support.  2. Fumigated Box.  3. 4x8 on Bottom + strong packing box of 85mm height & 1300x3050 on top.'),(36,'PUT CODE NUMBER STICKER ON THE FILM OF ALL THE SHEETS SO THAT CUSTOMERS DONOT HAVE ANY CONFUSION.'),(37,'COMPACTS WITH BLACK CORE & 1 MM WHITE LINE IN THE CENTRE.'),(38,'PLEASE ENSURE STRICTLY THAT THERE ARE NO OUTSIDE PARTICLES BETWEEN LAMINATES AND FILM.'),(39,'CUT PIECES TO BE ADDED AS PER CUSTOMERS REQUIREMENT.  '),(40,'IMP. - PUT NUMBER OF CRATES IN B/L - NOT NUMBER OF HPL.'),(41,'MENTION GW ON THE SIDE OF THE BOXES.'),(42,'1. BACKSIDE PRINTING VACO / DIAMOND AS PER PREVIOUS INSTRUCTION.  2. MARK NUMBER OF SHEETS AND DESIGN ON THE BOXES.'),(43,'TG (TOUGH GLOSSY) ARE STD. GRADE (NOT PF).'),(44,'BOX NOS 1 - 6      - MARK ALU  BOX NOS 7 - 8      - MARK ROMIG   BOX NOS 9 - 16     - MARK SUD '),(45,'PLEASE SIGN & CONFIRM PROFORMA INVOICE BY FAX IMMEDIATELY.'),(46,'BOX NOS 1 to 5, 10 to 13 - MARK COLORNO  BOX NOS 6 to 9          - MARK BRAGA'),(47,'BOX NOS 1 to 13, 16 - MARK GW  BOX NOS 14 & 15    - MARK MLM'),(48,'ALL OMEGA LAMINATES FACE DOWN.  '),(49,'1. TWO SHEETS EACH - B GRADE - IN BOX NO. 1  2. QC OF FOIL SHEETS SHOULD BE VERY STRICT.'),(50,'1. 1MM HQL WITH ENSO BACK.  2. PRINT TOPPAL AT BACK.  3. IPPC MARKING TO BE DONE.  4. ALL ITEMS THREE REJECT SHEETS IN SEPARATE BOX.  '),(51,'BOX NOS 1 to 15 - MARK  ISP'),(52,'BOX NOS 1 to 13 - MARK CAPS'),(53,'BOX NOS 1 to 16 - MARK ICAP'),(54,'BOX NOS  1 to 11  - MARK IDS  BOX NOS 12 to 16  - MARK GW'),(55,'TWO SHEETS EACH - B GRADE - ON TOP OF EVERY BOX.'),(56,'BOX NOS . 1 to 12   -  MARK ICAP  BOX NOS. 13 to17   -  MARK FIP  '),(57,'BOX NOS 1 to 8 - MARK COLORNO  BOX NOS 9 to 16 - MARK ICAP'),(58,'BOX NOS 1 to 5      - MARK GW  BOX NOS 6 to 17     - MARK SHORE'),(59,'BOX NOS 1 to  8  -  MARK  GW  BOX NOS 9 to 14  -  MARK  MLM  BOX NOS 15 & 16  -  MARK  SHORE'),(60,'EURO 250, ADDITION IS FOR LICENCE OPERATION.  DELIVERY HAS ALREADY BEEN MADE. PLEASE EXPEDITE PAYMENT.'),(61,'BY AIR IN TWO DRUMS'),(62,'BOX NOS 1-8, 11, 12-16 - MARK GW  BOX NOS 9, 10         - MARK MLM  (BOX NOS 12 - 16 - ALL FACE UP).'),(63,'BOX NOS 1 to 12  - MARK  REARO  (ALL LAMINATES FACE DOWN)  BOX NOS 13 to 16 -  MARK  GW     ( ALL LAMINATES FACE UP)  BOX NO. 17       - MARK  GW'),(64,'SAMPLE CHIPS TO GO IN SAME PARCEL'),(65,'INTERNAL FREIGHT BY ALFA.  SEA FREIGHT BY KUENE & NAGEL - PAYABLE BY THE CUSTOMER.'),(66,'1. PRINTING TO BE DONE AS USUAL.  2. BOXES WITH BOTTOM TWO LAYERS OF PLYWOOD WITH EXACT 6CM CHEVRON.'),(67,'1. FREIGHT COMPENSATION - 500    FELIXSTOWE FREIGHT     - 250'),(68,'1. BOX NOS. 1 TO 9 GW  2. BOX NOS. 10 & 11 REARO(FACEUP)'),(69,'1 .BOX NOS. 1TO 9 GW  2. BOX NOS.10 & 11 REARO (FACEUP)'),(70,'BOX NOS 1 to 18 - MARK GW'),(71,'BOX NOS.1 TO 10 - MARK REARO (ALL LAMINATES FACE UP)'),(72,'BOX NOS. 1 TO 10 - MARK REARO (ALL LAMINATES FACE UP)  BOX NOS.      11 - MARK REARO (ALL LAMINATES FACE DOWN)  BOX NOS. 12 TO 19 - MARK GW'),(73,'500 SWATCHES WITH HOLE AND 50 PCS OF A4 SIZE SAMPLES FOR 6926 ER2 AND 6928 ER2'),(74,'BOX NOS. 1 - 16 MARK GW  BOX NOS.  17,18,19  - MARK MLM'),(75,'PHENOLIC QUALITY GOOD SURFACE'),(76,'1. BOX NOS.1 TO 6  MARK MLM     BOX NOS. 7 TO 18 MARK REARO     FOR REARO - FACE LAMINATES : FACE UP                    OMEGA LAMINATES : FACE DOWN'),(77,'QUANTITY +/- 5% .  '),(78,'OMEGA LAMINATES ALL PACKING FACE UP  BOX NOS. 8 TO 10  -  MARK GW  BOX NOS 11 TO 18 -  MARK STARBANK'),(79,'DELIVERY BY AIR IN TWO DRUMS.'),(80,'BOX NOS  1 to 8   - MARK  GW  BOX NOS  9       - MARK  SHORE  BOX NOS 10 to 16  - MARK  STAR'),(81,'BOX NOS. 1 TO 9 MARK BAARS  BOX NOS 10 & 11 MARK PLASTICA'),(82,'TWO SHEETS EACH FOR SAMPLES-EXACT SAME COLOUR & FINISH'),(83,'ALL LAMINATES FACE UP  BOX NOS. 1 TO 6  MARK REARO  BOX NOS.7 TO 14  MARK STARBANK'),(84,'BOX NOS. 1 TO 10  -  MARK GW            11 TO 18  -  MARK MLM'),(85,'DELIVERIES FROM CHINA  FORM A OF INDIA'),(86,'NO MINUS, PLUS 5MM LENGTH & WIDTH'),(87,'NO.2 STICKERS ON NEW GRAPHITE 9196 D29.'),(88,'BOX NOS 1 - 16 = MARK  GW'),(89,'1. FOR BETTER LOOK OF COMPACT ALL BACKSIDE BALANCE PAPER SHOULD VE ALFA ICA PRINTED ON ANY STOCKLOT PAPERS.'),(90,'1. 15 SHEETS @ 14 = US$ 210/-     AIR FREIGHT      US$ 510/-                        _________       TOTAL          US$720/-'),(91,'1. BOX NOS.1 TO 10 MARK REARO (FACE LAMINATES FACE UP / OMEGA WHITE   FACE DOWN)  2. BOX NOS. 11 TO 17 MARK STARBANK(ALL FACE UP)'),(92,'1. BOX NOS. 1 TO 15 MARK GW'),(93,'ORDER NO.789386'),(94,'1. ACCURACY WHEN CUTTING THE EDGES\n2. TWO BARCODE STICKERS ON EACH COMPACTS\n3. NO.4 WARNING LABELS (3 LINES) TO BE STICKED ON EACH COMPACT ABOVE THE FILM\n4. COMPACT MUST BE WATERPROOF AS TO BE USED IN THE SHOWERS.\n5. NO.2 STICKERS ON NEW GRAPHITE 9196 D29.'),(96,'FACE LAMINATES FACE UP .  /   OMEGA WHITE FACE DOWN.'),(97,'1. ASW P.O NO. 2388788 TO BE MARKED ON BOX NOS 1 TO 12.\n2. LAMINATES TO BE CUT IN ALIGNMENT TO THE SIZE.\n3. FILM TO BE APPLIED ONLY ON DESIGN SIDE OF COMPACTS.\n4. PACKING LIST TO BE PUT IN A PLASTIC BAG AND TO BE PASTED ON SIDE OF EACH BOX.\n5. COMPACT 2.7 MM TO BE PRODUCED WITH NEW FORMULATION 32.\n'),(98,'6848 COLOURS TO BE SELECTED AND PACKED SERIALLY FROM DARK TO LIGHT ON TOP.'),(99,'1. PALLETS IN THE CONTAINER SHOULD NOT HAVE ANY MOVEMENT WHILE CONTAINER IS IN TRANSIT.\n2. THE PALLETS SHOULD BE STRONG ENOUGH TO WITHSTAND MULTIPLE HANDLING.\n3. THERE SHOULD BE THICK PE FILM WRAPPED AROUND THE SHEETS WHEN KEPT IN PALLET.\n4. THE PALLETS SHOULD BE STRAPPED PROPERLY WITH METAL STRAPS.\n5. THE PALLETS SHOULD NOT HAVE PRODRUCTING NAILS WHICH MIGHT DAMAGE THE SHEETS PACKED INSIDE.'),(100,'DATE OF DELIVERY IS TENTATIVE SUBJECT TOFORCE MAJEURE CLAUSE'),(101,'FOR ANY DEFECT IN HPL OUR LIABILITY WILL BE CONFIRMED TO REPLACEMENT OF OUR PRODUCTS ONLY.'),(102,'DELIVERY ADDRESS : THE POTTER GROUP ELY BULK,QUEEN ADELADE,CAMBS,CB74UB'),(104,'SHEETS TO BE BARCODED ON THE BACK AS PER GUNNERSEN ARTWORK'),(105,'FUMIGATION WITH METHYL BROMIDE'),(106,'ISPM 15 - ISPM PACKING DECLARATION REQUIRED'),(107,'PACKING DECLARATION & NEWLY MANUFACTURERS PRODUCT CERTIFICATE REQUIRED\nWITH ORIGINAL DOCUMENTS ON LETTER HEAD.'),(108,'TWO SHEETS EACH - B GRADE - ON TOP OF EVERY BOX'),(109,'1.ALL CRATES TO BE BRANDED - BRISBANE - COTC / B1008765\n2. SHEETS TO BE BARCODED ON THE BACK AS PER GUNNERSEN ARTWORK\n3. FUMIGATION WITH METHYL BROMIDE\n4. ISPM 15 - ISPM PACKING DECLARATION REQUIRED\n5. PACKING DECLARATION & NEWLY MANUFACTURERS PRODUCT CERTIFICATE REQUIRED WITH ORIGINAL DOCUMENTS ON LETTER HEAD.'),(110,'1. NOTIFY - \n    SHENZHEN HONGTAIYUAN TIMBER CO.LTD\n    TEL - 86 13510495722\n2. WING YUE TRADING LTD\n    TEL - 852 2687 5972'),(111,'1. CERTIFICATE OF ORIGIN & FUMIGATION CERTIFICATE ARE REQUIRED\n2. THERE SHOULD BE IPPC MARK ON ALL WOODEN BOXES.\n3. CARGO TO BE RELEASED ON SURRENDER  BILL OF LADING TO CONSIGNEE'),(112,'1. KRAFT PAPER USED FOR 1MM LAMINATE WILL BE A GRADE ENSO KRAFT\n2. ABSOLUTE NO PRINT OF ALFA ICA EVEN ON WOODEN BOX LABELS\n3. ADD 2-3 SHEETS B GRADE OF ALL THE ITEMS EXTRA ON TOP OF EACH BOX.'),(113,'FSC CODE - SGS - C0C - 010630\n'),(114,'\"THE PRODUCT IS ACTUALLY MATT FINISH AS APPROVED BY IDS\"'),(115,'DELIVERY ADDRESS : ROSYTH , CALEDONIA HEIGHTS , ADMIRALTY PARK , ROSYTH,FIFE,KY112YW.'),(116,'1.  1MM HQL WITH ENSO KRAFT\n2. PRINT TOPPAL AT BACK\n3. IPPC MARKING TO BE DONE\n4. ADD 2-3 SHEETS B GRADE OF ALL THE ITEMS EXTRA ON TOP OF EACH BOX\n'),(117,'ETS  - 05/08/2017  -   ETA  -  10/09/2017'),(118,'50% FACE UP  &  50% FACE DOWN'),(119,'16MM COMPACT TOLERANCE ON THICKNESS : NO NEGATIVE TOLERANCE ALLOWED. THICKNESS VARIATION WITHIN ONE SHEET NOT TO EXCEED 0.3MM.'),(120,'DELIVERY ADDRESS : WEST MIDLANDS WAREHOUSE, BERMUDA PARK INDUSTRIAL ESTATE, ST.DAVIDS WAY, NUNEATON,WEST MIDLANDS,CV107SD.'),(121,'DELIVERY ADRESS : BONDING SHOP PARKHOUSE,PARKHOUSE INTERCHANGE,PARKHOUSE IND ESTATE,NEW CASTLE UNDER LYME,STAFFS,ST5 7FB.'),(122,'AGREED FREIGHT INCREASE SURCHARGE PER MONTH APPLICABLE. '),(123,'DELIVERY ADDRESS : GILBRAITH TRANSTORE BOLTON ROAD FREIGHT TERMINAL IRON STREET BLACKBURN BB2 3QQ');
        `,
  },
  {
    version: 7,
    description: "Create Customer Table",
    script: `
      DROP TABLE IF EXISTS customers;
      CREATE TABLE customers (
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
      INSERT INTO customers (id, name, email, designation, contactPerson, phone, fax, otherPhone, remark, url, address, city, state, country, zip, buyerAddress, buyerCity, buyerState, buyerZipcode, buyerCountry, bankName, bankBranch, bankCountry, bankState, bankZip, bankCity, bankAddress) VALUES (2,'milangohil','milangohil22@gmail.com','programmer','9974798207','9327071693','557766','12345679','this is test','www.milangohil.com','navazapa','mahuva','gujarat','india','364290','pune','mumbai','india mumbai','364242','india mumbai','SBI','darbad gadh','bank country','bank state','bank zip 569565','bank mahuva','add darbad gadg');`,
  },
  {
    version: 8,
    description: "Create Invoice Master",
    script: `DROP TABLE IF EXISTS invoiceMaster;
CREATE TABLE invoiceMaster (
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
    paymentTerms TEXT DEFAULT NULL,
    portOfDischarge TEXT DEFAULT NULL,
    dispatchTerms TEXT DEFAULT NULL,
    bankName TEXT DEFAULT NULL,
    bankBranch TEXT DEFAULT NULL,
    bankCity TEXT DEFAULT NULL,
    swiftNumber TEXT DEFAULT NULL,
    comments TEXT DEFAULT NULL,
    calculationType INTEGER DEFAULT NULL,
    bankAddress TEXT DEFAULT NULL
);

INSERT INTO invoiceMaster (
    invoiceId, customerOrderNo, invoiceDate, invoiceSerial, invoicePiNo, customerId,
    customerName, customerAddress, customerCity, customerZip, customerState, customerCountry,
    buyerAddress, buyerCity, buyerZip, buyerState, buyerCountry, currency,
    status, discountType, discountValue, additionalChargeType, additionalChargeValue,
    reference, totalQuantity, totalAmount, totalSquareMeters, rounding, netAmount,
    deliveryTerms, deliveryDetails, shippingDetails, paymentTerms, portOfDischarge,
    dispatchTerms, bankName, bankBranch, bankCity, swiftNumber, comments, calculationType,
    bankAddress
) VALUES 
(
    20, '2488637', '06-06-2016', '49', '2488637/49', 11,
    'INTERNATIONAL DECORATIVE SURFACES', 'ST.DAVIDS WAY, BERMUDA PARK\nNUNEATON WARWICKSHIRE\nCV10 7SD',
    '', '', '', '',
    'NOTIFY - NEPTUNE SHIPPING AGENCY\nHIGHER SHERWELL , SEVENSTONES\nCALLINGTON,CORNWALL,PL178H',
    '', '', '', '', 'GBP',
    NULL, 'None', '', 'None', '',
    '', '5600', '32280.0', '16670.080', '0.00', '32280',
    'CIF', 'JULY 01, 2016', '', 'ON 60 DAYS D.A. - L.C.', 'FELIXSTOWE',
    'FELIXSTOWE (U.K)', 'FORTIS BANK S.A. / N.V.BRUSSELS', '', '', '',
    NULL, 2, 'ALL BELGIAN OFFICES\nBRUSSELS'
),
(
    23, '2487600', '10-06-2016', '52', '2487600/52', 11,
    'INTERNATIONAL DECORATIVE SURFACES', 'ST.DAVIDS WAY, BERMUDA PARK\nNUNEATON WARWICKSHIRE\nCV10 7SD',
    '', '', '', '',
    'NOTIFY - NEPTUNE SHIPPING AGENCY\nHIGHER SHERWELL , SEVENSTONES\nCALLINGTON,CORNWALL,PL178H',
    '', '', '', '', 'GBP',
    NULL, 'None', '', 'Flat', '400',
    'ADDITION - FREIGHT CHARGES', '3240', '39036.0', '9644.8324', '0.00', '39036',
    'CIF', 'JULY 25, 2016', '', 'ON 60 DAYS D.A. - L.C.', 'GRANGEMOUTH',
    'GRANGEMOUTH (U.K)', 'FORTIS BANK S.A. / N.V.BRUSSELS', '', '', '',
    NULL, 2, 'ALL BELGIAN OFFICES\nBRUSSELS'
);`,
  },
  {
    version: 9,
    description: "Create InvoiceDetails Table",
    script: `
      DROP TABLE IF EXISTS invoiceDetails;

      CREATE TABLE invoiceDetails (
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
        subWeight INTEGER DEFAULT NULL
      );

      INSERT INTO invoiceDetails (
        invoiceDetailId, invoiceId,customerId, containerType, containerTo, containerFrom, length, width, thickness,
        squareMeter, materialGrade, brandName, materialQuality, finishType, thicknessDetail, 
        quantity, rate, remarks, designType, prefixCode, grossWeight, netWeight, boxType, subWeight
      ) VALUES
      (68, 20,1, 'BOX 150', '8', 1, '2440', '1220', '0.7', '9525.7600', 'SHPAWHGLZZZZ30007', '', NULL, 'GL+F', 'Single Side', '3200', '7.14', NULL, '5203', '49', 10602, 1, '101 X 52 X 14', 1),
      (69, 20,1, 'BOX 150', '14', 9, '2440', '1220', '0.7', '7144.3200', 'ALBAWHITZMAZ30070', '', NULL, 'MT', 'Single Side', '2400', '3.93', NULL, '5002', '49', 7951, 1, '101 X 52 X 14', 2),
      (72, 22,1, 'BOX 135', '18', 1, '3050', '1300', '0.6', '17842.5', 'WHITE ', 'BALANCE', NULL, 'MT', 'Single Side', '4500', '1.6', NULL, '5002', '9181', 17525, 1, '125 X 55 X 9', 1),
      (73, 22,1, 'BOX 135', '19', 19, '3050', '1300', '0.6', '317.2', 'PF', '', NULL, 'GL+F', 'Single Side', '80', '3.55', NULL, '5101', '9181', 0, 1, '', 2),
      (74, 22,1, 'BOX 135', '19', 19, '3050', '1300', '0.6', '79.3', 'PF', '', NULL, 'T.C.+F', 'Single Side', '20', '3.55', NULL, '6825', '9181', 0, 1, '', 3);

    `,
  },
  {
    version: 10,
    description: "Create Invoice Instructions",
    script: `DROP TABLE IF EXISTS invoiceInstruction;

CREATE TABLE invoiceInstruction (
  invoiceId INTEGER DEFAULT NULL,
  instructionId INTEGER DEFAULT NULL,
  invoiceInstruction TEXT DEFAULT NULL
);

INSERT INTO invoiceInstruction (
  invoiceId,
  instructionId,
  invoiceInstruction
) VALUES 
  (22, 14, 'ALL SHEETS TO BE PRODUCED WITH OVERLAY.'),
  (22, 15, 'SHEETS SHOULD PASS BOILING WATER NEMA LD TEST PLUS 70 MINUTES EN438 TEST.'),
  (22, 16, 'STUFFING SHOULD BE AS PER PLAN AND PHOTOGRAPHS SHOULD BE SUPPLIED WITH B/L.');
`,
  },
  {
    version: 11,
    description: "Create invoiceBottomNote",
    script: `DROP TABLE IF EXISTS invoiceBottomNote;

CREATE TABLE invoiceBottomNote (
  invoiceId INTEGER DEFAULT NULL,
  bottomNoteId INTEGER DEFAULT NULL,
  bottomNote TEXT DEFAULT NULL,
  PRIMARY KEY (invoiceId, bottomNoteId)
);
`,
  },
  {
    version: 13,
    description: "Create Final Invoice Table",
    script: `
      DROP TABLE IF EXISTS finalinvoice;
      CREATE TABLE finalinvoice (
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
  
      `,
  },
];

// db.run("DELETE FROM migrations WHERE version = ?", [13]);
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

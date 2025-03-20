const db = require("../database");

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const isSelectQuery = query.trim().toUpperCase().startsWith("SELECT");

    if (isSelectQuery) {
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error(`Query Error: ${err.message}`);
          console.error(`Failed Query: ${query}`);
          console.error(`Parameters: ${JSON.stringify(params)}`);
          reject(err);
        } else {
          resolve(rows); // Return data for SELECT queries
        }
      });
    } else {
      db.run(query, params, function (err) {
        if (err) {
          console.error(`Query Error: ${err.message}`);
          console.error(`Failed Query: ${query}`);
          console.error(`Parameters: ${JSON.stringify(params)}`);
          reject(err);
        } else {
          if (query.trim().toUpperCase().startsWith("INSERT")) {
            resolve(this.lastID); // Return last inserted ID for INSERT
          } else if (
            query.trim().toUpperCase().startsWith("UPDATE") ||
            query.trim().toUpperCase().startsWith("DELETE")
          ) {
            resolve(this.changes); // Return number of affected rows for UPDATE/DELETE
          } else {
            resolve(true); // Default for other queries
          }
        }
      });
    }
  });
}

function insertInvoice({ invoiceMaster, invoiceDetails, invoiceInstruction }) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const masterInsertQuery = `INSERT INTO invoiceMaster (
        customerOrderNo, invoiceDate, invoiceSerial, invoicePiNo, customerId,
        customerName, customerAddress, customerCity, customerZip, customerState,
        customerCountry, buyerAddress, buyerCity, buyerZip, buyerState,
        buyerCountry, currency, status, discountType, discountValue,
        additionalChargeType, additionalChargeValue, reference, totalQuantity,
        totalAmount, totalSquareMeters, rounding, netAmount, deliveryTerms,
        deliveryDetails, shippingDetails, paymentTerms, portOfDischarge,
        dispatchTerms, bankName, bankBranch, bankCity, swiftNumber,
        comments, calculationType, bankAddress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

      runQuery(masterInsertQuery, [
        invoiceMaster.customerOrderNo ?? null,
        invoiceMaster.invoiceDate ?? null,
        invoiceMaster.invoiceSerial ?? null,
        invoiceMaster.invoicePiNo ?? null,
        invoiceMaster.customerId ?? null,
        invoiceMaster.customerName ?? null,
        invoiceMaster.customerAddress ?? null,
        invoiceMaster.customerCity ?? null,
        invoiceMaster.customerZip ?? null,
        invoiceMaster.customerState ?? null,
        invoiceMaster.customerCountry ?? null,
        invoiceMaster.buyerAddress ?? null,
        invoiceMaster.buyerCity ?? null,
        invoiceMaster.buyerZip ?? null,
        invoiceMaster.buyerState ?? null,
        invoiceMaster.buyerCountry ?? null,
        invoiceMaster.currency ?? null,
        invoiceMaster.status ?? null,
        invoiceMaster.discountType ?? null,
        invoiceMaster.discountValue ?? null,
        invoiceMaster.additionalChargeType ?? null,
        invoiceMaster.additionalChargeValue ?? null,
        invoiceMaster.reference ?? null,
        invoiceMaster.totalQuantity ?? null,
        invoiceMaster.totalAmount ?? null,
        invoiceMaster.totalSquareMeters ?? null,
        invoiceMaster.rounding ?? null,
        invoiceMaster.netAmount ?? null,
        invoiceMaster.deliveryTerms ?? null,
        invoiceMaster.deliveryDetails ?? null,
        invoiceMaster.shippingDetails ?? null,
        invoiceMaster.paymentTerms ?? null,
        invoiceMaster.portOfDischarge ?? null,
        invoiceMaster.dispatchTerms ?? null,
        invoiceMaster.bankName ?? null,
        invoiceMaster.bankBranch ?? null,
        invoiceMaster.bankCity ?? null,
        invoiceMaster.swiftNumber ?? null,
        invoiceMaster.comments ?? null,
        invoiceMaster.calculationType ?? null,
        invoiceMaster.bankAddress ?? null,
      ])
        .then((invoiceId) => {
          const detailPromises = Array.isArray(invoiceDetails)
            ? invoiceDetails.map((detail) =>
                runQuery(
                  `INSERT INTO invoiceDetails (
                invoiceId,customerId, containerType, containerTo, containerFrom, length,
                width, thickness, squareMeter, materialGrade, brandName,
                materialQuality, finishType, thicknessDetail, quantity, rate,
                remarks, designType, prefixCode, grossWeight, netWeight, boxType, subWeight
              ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    invoiceId,
                    detail.customerId ?? null,
                    detail.containerType ?? null,
                    detail.containerTo ?? null,
                    detail.containerFrom ?? null,
                    detail.length ?? null,
                    detail.width ?? null,
                    detail.thickness ?? null,
                    detail.squareMeter ?? null,
                    detail.materialGrade ?? null,
                    detail.brandName ?? null,
                    detail.materialQuality ?? null,
                    detail.finishType ?? null,
                    detail.thicknessDetail ?? null,
                    detail.quantity ?? null,
                    detail.rate ?? null,
                    detail.remarks ?? null,
                    detail.designType ?? null,
                    detail.prefixCode ?? null,
                    detail.grossWeight ?? null,
                    detail.netWeight ?? null,
                    detail.boxType ?? null,
                    detail.subWeight ?? null,
                  ]
                )
              )
            : [];

          const instructionPromises = Array.isArray(invoiceInstruction)
            ? invoiceInstruction.map((instruction) =>
                runQuery(
                  `INSERT INTO invoiceInstruction (
                invoiceId, instructionId, invoiceInstruction
              ) VALUES (?, ?, ?)`,
                  [
                    invoiceId,
                    instruction.instructionId ?? null,
                    instruction.invoiceInstruction ?? null,
                  ]
                )
              )
            : [];

          return Promise.all([...detailPromises, ...instructionPromises])
            .then(() => {
              db.run("COMMIT", (commitErr) => {
                if (commitErr)
                  return reject(`Commit Error: ${commitErr.message}`);
                resolve({
                  invoiceId,
                  message: "Invoice created successfully!",
                });
              });
            })
            .catch((error) => {
              db.run("ROLLBACK", () => {
                reject(`Transaction failed: ${error}`);
              });
            });
        })
        .catch((error) => {
          db.run("ROLLBACK", () => {
            reject(`Transaction failed: ${error}`);
          });
        });
    });
  });
}

function updateInvoice({ invoiceMaster, invoiceDetails, invoiceInstruction }) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const masterUpdateQuery = `UPDATE invoiceMaster SET 
          customerOrderNo = ?, invoiceDate = ?, invoiceSerial = ?, invoicePiNo = ?, customerId = ?,
          customerName = ?, customerAddress = ?, customerCity = ?, customerZip = ?, customerState = ?,
          customerCountry = ?, buyerAddress = ?, buyerCity = ?, buyerZip = ?, buyerState = ?,
          buyerCountry = ?, currency = ?, status = ?, discountType = ?, discountValue = ?,
          additionalChargeType = ?, additionalChargeValue = ?, reference = ?, totalQuantity = ?,
          totalAmount = ?, totalSquareMeters = ?, rounding = ?, netAmount = ?, deliveryTerms = ?,
          deliveryDetails = ?, shippingDetails = ?, paymentTerms = ?, portOfDischarge = ?,
          dispatchTerms = ?, bankName = ?, bankBranch = ?, bankCity = ?, swiftNumber = ?,
          comments = ?, calculationType = ?, bankAddress = ? WHERE invoiceId = ?`;

      runQuery(masterUpdateQuery, [
        invoiceMaster.customerOrderNo ?? null,
        invoiceMaster.invoiceDate ?? null,
        invoiceMaster.invoiceSerial ?? null,
        invoiceMaster.invoicePiNo ?? null,
        invoiceMaster.customerId ?? null,
        invoiceMaster.customerName ?? null,
        invoiceMaster.customerAddress ?? null,
        invoiceMaster.customerCity ?? null,
        invoiceMaster.customerZip ?? null,
        invoiceMaster.customerState ?? null,
        invoiceMaster.customerCountry ?? null,
        invoiceMaster.buyerAddress ?? null,
        invoiceMaster.buyerCity ?? null,
        invoiceMaster.buyerZip ?? null,
        invoiceMaster.buyerState ?? null,
        invoiceMaster.buyerCountry ?? null,
        invoiceMaster.currency ?? null,
        invoiceMaster.status ?? null,
        invoiceMaster.discountType ?? null,
        invoiceMaster.discountValue ?? null,
        invoiceMaster.additionalChargeType ?? null,
        invoiceMaster.additionalChargeValue ?? null,
        invoiceMaster.reference ?? null,
        invoiceMaster.totalQuantity ?? null,
        invoiceMaster.totalAmount ?? null,
        invoiceMaster.totalSquareMeters ?? null,
        invoiceMaster.rounding ?? null,
        invoiceMaster.netAmount ?? null,
        invoiceMaster.deliveryTerms ?? null,
        invoiceMaster.deliveryDetails ?? null,
        invoiceMaster.shippingDetails ?? null,
        invoiceMaster.paymentTerms ?? null,
        invoiceMaster.portOfDischarge ?? null,
        invoiceMaster.dispatchTerms ?? null,
        invoiceMaster.bankName ?? null,
        invoiceMaster.bankBranch ?? null,
        invoiceMaster.bankCity ?? null,
        invoiceMaster.swiftNumber ?? null,
        invoiceMaster.comments ?? null,
        invoiceMaster.calculationType ?? null,
        invoiceMaster.bankAddress ?? null,
        invoiceMaster.invoiceId,
      ])
        .then(() => {
          const invoiceId = invoiceMaster.invoiceId;
          // Fetch existing records
          Promise.all([
            runQuery(
              "SELECT invoiceDetailId FROM invoiceDetails WHERE invoiceId = ?",
              [invoiceId]
            ).then((data) => (Array.isArray(data) ? data : [])),
            runQuery(
              "SELECT instructionId FROM invoiceInstruction WHERE invoiceId = ?",
              [invoiceId]
            ).then((data) => (Array.isArray(data) ? data : [])),
          ]).then(([oldDetails, oldInstructions]) => {
            const oldDetailIds = oldDetails.map((d) => d.invoiceDetailId);
            const newDetailIds = invoiceDetails
              .map((d) => d.invoiceDetailId)
              .filter(Boolean);

            const oldInstructionIds = oldInstructions.map(
              (i) => i.instructionId
            );
            const newInstructionIds = invoiceInstruction
              .map((i) => i.instructionId)
              .filter(Boolean);

            // Delete removed records
            const deleteDetailPromises = oldDetailIds
              .filter((id) => !newDetailIds.includes(id))
              .map((id) =>
                runQuery(
                  "DELETE FROM invoiceDetails WHERE invoiceDetailId = ?",
                  [id]
                )
              );

            const deleteInstructionPromises = oldInstructionIds
              .filter(
                (oldInstructionId) =>
                  !newInstructionIds.includes(oldInstructionId)
              )
              .map((oldInstructionId) => {
                console.log(oldInstructionId);
                return runQuery(
                  "DELETE FROM invoiceInstruction WHERE invoiceId = ? AND instructionId = ?",
                  [invoiceId, oldInstructionId]
                );
              });

            // Insert or update records
            const upsertDetailPromises = (invoiceDetails || []).map((detail) =>
              detail.invoiceDetailId
                ? runQuery(
                    `UPDATE invoiceDetails SET
                      customerId = ?,containerType = ?, containerTo = ?, containerFrom = ?, length = ?,
                      width = ?, thickness = ?, squareMeter = ?, materialGrade = ?, brandName = ?,
                      materialQuality = ?, finishType = ?, thicknessDetail = ?, quantity = ?, rate = ?,
                      remarks = ?, designType = ?, prefixCode = ?, grossWeight = ?, netWeight = ?,
                      boxType = ?, subWeight = ? WHERE invoiceDetailId = ?`,
                    [
                      detail.customerId ?? null,
                      detail.containerType ?? null,
                      detail.containerTo ?? null,
                      detail.containerFrom ?? null,
                      detail.length ?? null,
                      detail.width ?? null,
                      detail.thickness ?? null,
                      detail.squareMeter ?? null,
                      detail.materialGrade ?? null,
                      detail.brandName ?? null,
                      detail.materialQuality ?? null,
                      detail.finishType ?? null,
                      detail.thicknessDetail ?? null,
                      detail.quantity ?? null,
                      detail.rate ?? null,
                      detail.remarks ?? null,
                      detail.designType ?? null,
                      detail.prefixCode ?? null,
                      detail.grossWeight ?? null,
                      detail.netWeight ?? null,
                      detail.boxType ?? null,
                      detail.subWeight ?? null,
                      detail.invoiceDetailId,
                    ]
                  )
                : runQuery(
                    `INSERT INTO invoiceDetails (
                      invoiceId,customerId, containerType, containerTo, containerFrom, length,
                      width, thickness, squareMeter, materialGrade, brandName,
                      materialQuality, finishType, thicknessDetail, quantity, rate,
                      remarks, designType, prefixCode, grossWeight, netWeight, boxType, subWeight
                    ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      invoiceId,
                      detail.customerId ?? null,
                      detail.containerType ?? null,
                      detail.containerTo ?? null,
                      detail.containerFrom ?? null,
                      detail.length ?? null,
                      detail.width ?? null,
                      detail.thickness ?? null,
                      detail.squareMeter ?? null,
                      detail.materialGrade ?? null,
                      detail.brandName ?? null,
                      detail.materialQuality ?? null,
                      detail.finishType ?? null,
                      detail.thicknessDetail ?? null,
                      detail.quantity ?? null,
                      detail.rate ?? null,
                      detail.remarks ?? null,
                      detail.designType ?? null,
                      detail.prefixCode ?? null,
                      detail.grossWeight ?? null,
                      detail.netWeight ?? null,
                      detail.boxType ?? null,
                      detail.subWeight ?? null,
                    ]
                  )
            );

            const upsertInstructionPromises = (invoiceInstruction || []).map(
              (instruction) =>
                instruction.instructionId && instruction.invoiceId
                  ? runQuery(
                      `UPDATE invoiceInstruction SET invoiceInstruction = ?
                        WHERE invoiceId = ? AND instructionId = ?`,
                      [
                        instruction.invoiceInstruction ?? null,
                        invoiceId,
                        instruction.instructionId ?? null,
                      ]
                    )
                  : runQuery(
                      `INSERT INTO invoiceInstruction (
                          invoiceId, instructionId, invoiceInstruction
                        ) VALUES (?, ?, ?)`,
                      [
                        invoiceId,
                        instruction.instructionId ?? null,
                        instruction.invoiceInstruction ?? null,
                      ]
                    )
            );

            return Promise.all([
              ...deleteDetailPromises,
              ...deleteInstructionPromises,
              ...upsertDetailPromises,
              ...upsertInstructionPromises,
            ])
              .then(() => {
                db.run("COMMIT", (commitErr) => {
                  if (commitErr)
                    return reject(`Commit Error: ${commitErr.message}`);
                  resolve({
                    invoiceId,
                    message: "Invoice updated successfully!",
                  });
                });
              })
              .catch((error) => {
                db.run("ROLLBACK", () =>
                  reject(`Transaction failed: ${error}`)
                );
              });
          });
        })
        .catch((error) => {
          db.run("ROLLBACK", () => reject(`Transaction failed: ${error}`));
        });
    });
  });
}

function deleteInvoice(invoiceId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // Delete invoice details
      runQuery("DELETE FROM invoiceDetails WHERE invoiceId = ?", [invoiceId])
        .then(() =>
          // Delete invoice instructions
          runQuery("DELETE FROM invoiceInstruction WHERE invoiceId = ?", [
            invoiceId,
          ])
        )
        .then(() =>
          // Delete invoice master
          runQuery("DELETE FROM invoiceMaster WHERE invoiceId = ?", [invoiceId])
        )
        .then(() => {
          db.run("COMMIT", (commitErr) => {
            if (commitErr) return reject(`Commit Error: ${commitErr.message}`);
            resolve({ message: "Invoice deleted successfully!" });
          });
        })
        .catch((error) => {
          db.run("ROLLBACK", () => {
            reject(`Transaction failed: ${error}`);
          });
        });
    });
  });
}

async function getInvoice(invoiceId) {
  try {
    const queries = {
      invoiceMasterQuery: `SELECT * FROM invoiceMaster WHERE invoiceId = ?`,
      invoiceDetailsQuery: `SELECT * FROM invoiceDetails WHERE invoiceId = ?`,
      invoiceInstructionQuery: `SELECT * FROM invoiceInstruction WHERE invoiceId = ?`,
      invoiceFinalQuery: `SELECT * FROM finalinvoice WHERE invoiceId = ?`,
      invoiceBottomNoteQuery: `SELECT * FROM invoiceBottomNote WHERE invoiceId = ?`,
    };

    // Run queries in parallel for better performance
    const [
      invoiceMaster,
      invoiceDetails,
      invoiceInstruction,
      finalInvoice,
      invoiceBottomNote,
    ] = await Promise.all([
      runQuery(queries.invoiceMasterQuery, [invoiceId]),
      runQuery(queries.invoiceDetailsQuery, [invoiceId]),
      runQuery(queries.invoiceInstructionQuery, [invoiceId]),
      runQuery(queries.invoiceFinalQuery, [invoiceId]),
      runQuery(queries.invoiceBottomNoteQuery, [invoiceId]),
    ]);

    if (!invoiceMaster) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    return {
      invoiceMaster,
      invoiceDetails,
      invoiceInstruction,
      finalInvoice,
      invoiceBottomNote,
    };
  } catch (error) {
    console.error(`❌ Error fetching invoice data: ${error.message}`);
    throw new Error(`Failed to fetch invoice: ${error.message}`);
  }
}

// Add a new final invoice
async function addFinalInvoice({ invoice, invoiceBottomNotes = [] }) {
  try {
    await runQuery("BEGIN TRANSACTION");
    console.log(invoice, invoiceBottomNotes);
    const query = `
      INSERT INTO finalinvoice (
        invoiceId, customerName, buyerName, buyerAddress, buyerCity, buyerZip,
        buyerState, buyerCountry, consigneeName, consigneeAddress, consigneeCity,
        consigneeZip, consigneeState, consigneeCountry, bankName, bankAddress,
        bankCity, bankZip, bankState, bankCountry, bankAsConsignee, termsOfDp,
        deliveryTerms, precarriage, vesselNo, portOfDischarge, originOfGoods,
        receiptPlace, loadingPort, finalDestination, dischargeTerms, privateRemark,
        bottomNote, bankShortName, branchName, city, panNo, adCode, acCode, iec,
        comment, invoiceDate, finalInvoice
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
    `;

    await runQuery(query, [
      invoice.invoiceId,
      invoice.customerName,
      invoice.buyerName,
      invoice.buyerAddress,
      invoice.buyerCity,
      invoice.buyerZip,
      invoice.buyerState,
      invoice.buyerCountry,
      invoice.consigneeName,
      invoice.consigneeAddress,
      invoice.consigneeCity,
      invoice.consigneeZip,
      invoice.consigneeState,
      invoice.consigneeCountry,
      invoice.bankName,
      invoice.bankAddress,
      invoice.bankCity,
      invoice.bankZip,
      invoice.bankState,
      invoice.bankCountry,
      invoice.bankAsConsignee,
      invoice.termsOfDp,
      invoice.deliveryTerms,
      invoice.precarriage,
      invoice.vesselNo,
      invoice.portOfDischarge,
      invoice.originOfGoods,
      invoice.receiptPlace,
      invoice.loadingPort,
      invoice.finalDestination,
      invoice.dischargeTerms,
      invoice.privateRemark,
      invoice.bottomNote,
      invoice.bankShortName,
      invoice.branchName,
      invoice.city,
      invoice.panNo,
      invoice.adCode,
      invoice.acCode,
      invoice.iec,
      invoice.comment,
      invoice.invoiceDate,
      invoice.finalInvoice,
    ]);

    const insertBottomNotePromises = Array.isArray(invoiceBottomNotes)
      ? invoiceBottomNotes.map((bottomnote) =>
          runQuery(
            `INSERT INTO invoiceBottomNote (
              invoiceId, bottomNoteId, bottomNote
            ) VALUES (?, ?, ?)`,

            [
              invoice.invoiceId,
              bottomnote.bottomNoteId ?? null,
              bottomnote.bottomNote ?? null,
            ]
          )
        )
      : [];

    await Promise.all(insertBottomNotePromises);

    await runQuery("COMMIT");

    return {
      invoiceId: invoice.invoiceId,
      message: "Invoice final added successfully!",
    };
  } catch (error) {
    await runQuery("ROLLBACK");
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

// Update an existing final invoice
async function updateFinalInvoice({ invoice, invoiceBottomNotes = [] }) {
  try {
    await runQuery("BEGIN TRANSACTION");

    // ✅ Step 1: Update Invoice Details
    const query = `
      UPDATE finalinvoice SET
        customerName = ?, buyerName = ?, buyerAddress = ?, buyerCity = ?, buyerZip = ?, 
        buyerState = ?, buyerCountry = ?, consigneeName = ?, consigneeAddress = ?, 
        consigneeCity = ?, consigneeZip = ?, consigneeState = ?, consigneeCountry = ?, 
        bankName = ?, bankAddress = ?, bankCity = ?, bankZip = ?, bankState = ?, 
        bankCountry = ?, bankAsConsignee = ?, termsOfDp = ?, deliveryTerms = ?, 
        precarriage = ?, vesselNo = ?, portOfDischarge = ?, originOfGoods = ?, 
        receiptPlace = ?, loadingPort = ?, finalDestination = ?, dischargeTerms = ?, 
        privateRemark = ?, bottomNote = ?, bankShortName = ?, branchName = ?, city = ?, 
        panNo = ?, adCode = ?, acCode = ?, iec = ?, comment = ?, invoiceDate = ?, 
        finalInvoice = ?
      WHERE invoiceId = ?
    `;

    await runQuery(query, [
      invoice.customerName ?? null,
      invoice.buyerName ?? null,
      invoice.buyerAddress ?? null,
      invoice.buyerCity ?? null,
      invoice.buyerZip ?? null,
      invoice.buyerState ?? null,
      invoice.buyerCountry ?? null,
      invoice.consigneeName ?? null,
      invoice.consigneeAddress ?? null,
      invoice.consigneeCity ?? null,
      invoice.consigneeZip ?? null,
      invoice.consigneeState ?? null,
      invoice.consigneeCountry ?? null,
      invoice.bankName ?? null,
      invoice.bankAddress ?? null,
      invoice.bankCity ?? null,
      invoice.bankZip ?? null,
      invoice.bankState ?? null,
      invoice.bankCountry ?? null,
      invoice.bankAsConsignee ?? null,
      invoice.termsOfDp ?? null,
      invoice.deliveryTerms ?? null,
      invoice.precarriage ?? null,
      invoice.vesselNo ?? null,
      invoice.portOfDischarge ?? null,
      invoice.originOfGoods ?? null,
      invoice.receiptPlace ?? null,
      invoice.loadingPort ?? null,
      invoice.finalDestination ?? null,
      invoice.dischargeTerms ?? null,
      invoice.privateRemark ?? null,
      invoice.bottomNote ?? null,
      invoice.bankShortName ?? null,
      invoice.branchName ?? null,
      invoice.city ?? null,
      invoice.panNo ?? null,
      invoice.adCode ?? null,
      invoice.acCode ?? null,
      invoice.iec ?? null,
      invoice.comment ?? null,
      invoice.invoiceDate ?? null,
      invoice.finalInvoice ?? null,
      invoice.invoiceId ?? null,
    ]);

    // ✅ Step 2: Handle Bottom Notes
    // Get existing bottom notes
    const existingBottomNotes = await runQuery(
      `SELECT bottomNoteId FROM invoiceBottomNote WHERE invoiceId = ?`,
      [invoice.invoiceId]
    );

    const existingNoteIds = existingBottomNotes.map(
      (note) => note.bottomNoteId
    );

    // Filter notes to delete (those that are no longer present)
    const notesToDelete = existingNoteIds.filter(
      (oldNoteId) =>
        !invoiceBottomNotes.some(
          (newNote) => newNote.bottomNoteId === oldNoteId
        )
    );

    // Delete old notes if needed
    const deletePromises = notesToDelete.map((noteId) =>
      runQuery(`DELETE FROM invoiceBottomNote WHERE bottomNoteId = ?`, [noteId])
    );

    // Upsert (Insert or Update) Bottom Notes
    const upsertPromises = invoiceBottomNotes.map((bottomnote) =>
      runQuery(
        `INSERT INTO invoiceBottomNote (
          invoiceId, bottomNoteId, bottomNote
        ) VALUES (?, ?, ?)
        ON CONFLICT(invoiceId,bottomNoteId) DO UPDATE SET
          bottomNote = excluded.bottomNote`,
        [
          invoice.invoiceId,
          bottomnote.bottomNoteId ?? null,
          bottomnote.bottomNote ?? null,
        ]
      )
    );

    // Run both delete and upsert operations
    await Promise.all([...deletePromises, ...upsertPromises]);

    await runQuery("COMMIT");

    return {
      invoiceId: invoice.invoiceId,
      message: "Invoice updated successfully!",
    };
  } catch (error) {
    await runQuery("ROLLBACK");
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

async function deleteFinalInvoice(invoiceId) {
  try {
    await runQuery("BEGIN TRANSACTION");

    // Step 1: Delete from finalinvoice
    await runQuery("DELETE FROM finalinvoice WHERE invoiceId = ?", [invoiceId]);

    // Step 2: Delete from invoiceBottomNote
    await runQuery("DELETE FROM invoiceBottomNote WHERE invoiceId = ?", [
      invoiceId,
    ]);

    // Step 3: Commit the transaction
    await runQuery("COMMIT");

    return { message: "Invoice final deleted successfully!" };
  } catch (error) {
    await runQuery("ROLLBACK");
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

async function getInvoiceDetails({ materialGrade, customerId }) {
  try {
    const result = await runQuery(
      `
        SELECT * FROM invoiceDetails 
        WHERE materialGrade = ? AND customerId = ? 
        ORDER BY invoiceDetailId DESC 
        LIMIT 1
    `,
      [materialGrade, customerId]
    );

    if (result && Object.keys(result).length != 0) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching invoice details data: ${error.message}`);
    throw new Error(`Failed to fetch invoice details: ${error.message}`);
  }
}

module.exports = {
  insertInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoice,
  addFinalInvoice,
  updateFinalInvoice,
  deleteFinalInvoice,
  getInvoiceDetails,
};

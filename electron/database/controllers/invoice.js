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
        customerCountry, billingAddress, billingCity, billingZip, billingState,
        billingCountry, currency, status, discountType, discountValue,
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
        invoiceMaster.billingAddress ?? null,
        invoiceMaster.billingCity ?? null,
        invoiceMaster.billingZip ?? null,
        invoiceMaster.billingState ?? null,
        invoiceMaster.billingCountry ?? null,
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
                invoiceId, containerType, containerTo, containerFrom, length,
                width, thickness, squareMeter, materialGrade, brandName,
                materialQuality, finishType, thicknessDetail, quantity, rate,
                remarks, designType, prefixCode, grossWeight, netWeight, boxType, subWeight
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    invoiceId,
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
          customerCountry = ?, billingAddress = ?, billingCity = ?, billingZip = ?, billingState = ?,
          billingCountry = ?, currency = ?, status = ?, discountType = ?, discountValue = ?,
          additionalChargeType = ?, additionalChargeValue = ?, reference = ?, totalQuantity = ?,
          totalAmount = ?, totalSquareMeters = ?, rounding = ?, netAmount = ?, deliveryTerms = ?,
          deliveryDetails = ?, shippingDetails = ?, paymentTerms = ?, portOfDischarge = ?,
          dispatchTerms = ?, bankName = ?, bankBranch = ?, bankCity = ?, swiftNumber = ?,
          comments = ?, calculationType = ?, bankAddress = ? WHERE invId = ?`;

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
        invoiceMaster.billingAddress ?? null,
        invoiceMaster.billingCity ?? null,
        invoiceMaster.billingZip ?? null,
        invoiceMaster.billingState ?? null,
        invoiceMaster.billingCountry ?? null,
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
        invoiceMaster.invId,
      ])
        .then(() => {
          const invoiceId = invoiceMaster.invId;
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
                      containerType = ?, containerTo = ?, containerFrom = ?, length = ?,
                      width = ?, thickness = ?, squareMeter = ?, materialGrade = ?, brandName = ?,
                      materialQuality = ?, finishType = ?, thicknessDetail = ?, quantity = ?, rate = ?,
                      remarks = ?, designType = ?, prefixCode = ?, grossWeight = ?, netWeight = ?,
                      boxType = ?, subWeight = ? WHERE invoiceDetailId = ?`,
                    [
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
                      invoiceId, containerType, containerTo, containerFrom, length,
                      width, thickness, squareMeter, materialGrade, brandName,
                      materialQuality, finishType, thicknessDetail, quantity, rate,
                      remarks, designType, prefixCode, grossWeight, netWeight, boxType, subWeight
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      invoiceId,
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
          runQuery("DELETE FROM invoiceMaster WHERE invId = ?", [invoiceId])
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

function getInvoice(invoiceId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const invoiceMasterQuery = `
          SELECT * FROM invoiceMaster WHERE invId = ?
        `;

      const invoiceDetailsQuery = `
          SELECT * FROM invoiceDetails WHERE invoiceId = ?
        `;

      const invoiceInstructionQuery = `
          SELECT * FROM invoiceInstruction WHERE invoiceId = ?
        `;

      db.get(invoiceMasterQuery, [invoiceId], (err, invoiceMaster) => {
        if (err) return reject(`Error fetching invoice master: ${err.message}`);
        if (!invoiceMaster)
          return reject(`Invoice with ID ${invoiceId} not found`);

        db.all(invoiceDetailsQuery, [invoiceId], (err, invoiceDetails) => {
          if (err)
            return reject(`Error fetching invoice details: ${err.message}`);

          db.all(
            invoiceInstructionQuery,
            [invoiceId],
            (err, invoiceInstruction) => {
              if (err)
                return reject(
                  `Error fetching invoice instructions: ${err.message}`
                );

              resolve({
                invoiceMaster,
                invoiceDetails,
                invoiceInstruction,
              });
            }
          );
        });
      });
    });
  });
}

module.exports = {
  insertInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoice,
};

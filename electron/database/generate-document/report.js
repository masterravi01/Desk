const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const converter = require("number-to-words");
const { exec } = require("child_process"); // Import the exec function from child_process
libre.convertAsync = require("util").promisify(libre.convert);

const db = require("../database");
const { getInvoice } = require("../controllers/invoice");
const { getAllContainer } = require("../controllers/container");
const { getCurrencyByName } = require("../controllers/currency");
const { convertToCapitalize } = require("../utills/helper");
const { app } = require("electron");
const { getCompany } = require("../controllers/company");
const { getCustomer } = require("../controllers/customer");

function modifyCustomInvoiceData(data, totalAddition, totalDiscount, master) {
  try {
    data = data.map((container) => {
      const groupedInvoices = {};

      container.invoices.forEach((invoice) => {
        const rateKey = invoice.preRate;

        if (!groupedInvoices[rateKey]) {
          groupedInvoices[rateKey] = {
            ...invoice,
            quantity: 0,
            totalSq: 0,
            value: 0,
          };
        }

        groupedInvoices[rateKey].quantity += Number(invoice.quantity);
        groupedInvoices[rateKey].totalSq += Number(invoice.squareMeter);
        groupedInvoices[rateKey].value += Number(invoice.value);
      });

      return {
        ...container,
        invoices: Object.values(groupedInvoices),
      };
    });

    let maxInvoice = null;

    data.forEach((container) => {
      container.invoices.forEach((invoice) => {
        if (!maxInvoice || Number(invoice.value) > Number(maxInvoice.value)) {
          maxInvoice = invoice;
        }
      });
    });

    if (maxInvoice) {
      maxInvoice.value =
        Number(maxInvoice.value ?? "0") +
        Number(totalAddition ?? "0") -
        Number(totalDiscount ?? "0");
      maxInvoice.rate = toFixedToFour(
        maxInvoice.value / Number(maxInvoice.totalSq)
      );
    }

    data.forEach((item, index) => {
      item.invoices.forEach((invoice, idx) => {
        invoice.isFirst = idx === 0;
        invoice.value = toFixedToFour(invoice.value);
        invoice.totalSq = toFixedToFour(invoice.totalSq);
        invoice.rate = toFixedToFour(invoice.rate);
      });
      item.showThickness = true;
      if (
        index > 0 &&
        item.thicknessDetail == data[index - 1].thicknessDetail
      ) {
        item.showThickness = false;
      }
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

function calculateTotalBoxes(invoiceDetails) {
  try {
    let totalBox = 0;
    const seenContainers = new Set();
    invoiceDetails.forEach((invoice) => {
      const key = `${invoice.containerFrom}-${invoice.containerTo}`;
      if (!seenContainers.has(key)) {
        seenContainers.add(key);

        if (invoice.containerFrom && invoice.containerTo) {
          const from = Number(invoice.containerFrom);
          const to = Number(invoice.containerTo);
          if (!isNaN(from) && !isNaN(to) && to >= from) {
            totalBox += to - from + 1;
          }
        } else if (invoice.containerFrom && !invoice.containerTo) {
          const from = Number(invoice.containerFrom);
          if (!isNaN(from)) {
            totalBox += 1;
          }
        }
      }
    });

    return totalBox;
  } catch (error) {
    console.log(error);
  }
}

function AusNzPackingListRoundOf(
  totalNetWeight,
  totalGrossWeight,
  groupedInvoicesBySize
) {
  let toReduce = totalNetWeight % 100;
  totalNetWeight = Math.floor(totalNetWeight / 100) * 100; // Round down to nearest 100

  for (let group of groupedInvoicesBySize) {
    for (let invoice of group.invoices) {
      const currentWeight = Number(invoice.netWeight || 0);
      if (currentWeight === 0 || toReduce <= 0) continue;

      const reduceBy = Math.min(currentWeight, toReduce);
      invoice.netWeight = Number(currentWeight - reduceBy);
      toReduce -= reduceBy;

      if (toReduce <= 0) break;
    }
    if (toReduce <= 0) break;
  }

  toReduce = totalGrossWeight % 100;
  totalGrossWeight = Math.floor(totalGrossWeight / 100) * 100; // Round down to nearest 100

  for (let group of groupedInvoicesBySize) {
    for (let invoice of group.invoices) {
      const currentWeight = Number(invoice.grossWeight || 0);
      if (currentWeight === 0 || toReduce <= 0) continue;

      const reduceBy = Math.min(currentWeight, toReduce);
      invoice.grossWeight = Number(currentWeight - reduceBy);
      toReduce -= reduceBy;

      if (toReduce <= 0) break;
    }
    if (toReduce <= 0) break;
  }

  return [totalNetWeight, totalGrossWeight];
}

async function readInvoiceData(invoiceId, isCustom, country = "") {
  try {
    let {
      invoiceMaster = [],
      invoiceDetails = [],
      invoiceInstruction = [],
      finalInvoice = [],
      invoiceBottomNote = [],
    } = await getInvoice(invoiceId);
    let companyData = await getCompany(1);
    const master = invoiceMaster[0] || {};
    const final = finalInvoice[0] || {};

    const containers = await getAllContainer();
    const currency = await getCurrencyByName(master.currency);
    const customer = await getCustomer(master.customerId);
    const containerObj = {};
    containers.forEach((c) => {
      containerObj[c.containerName] = c;
    });

    let groupedInvoicesBySize = [];

    let totalBox = calculateTotalBoxes(invoiceDetails);

    invoiceDetails.forEach((invoice) => {
      const type = invoice.containerType;

      invoice.squareMeter = toFixedToFour(invoice.squareMeter);
      invoice.rate = toFixedToFour(invoice.rate);
      invoice.netWeight = invoice.netWeight.toFixed(0);
      invoice.preRate = invoice.rate;
      invoice.lwh = `${invoice?.length} X ${invoice?.width} X ${invoice?.thickness}`;

      const size = invoice.lwh;

      const quantity = Number(invoice?.quantity || 0);
      const rate = parseFloat(invoice?.rate || 0);
      invoice.value = parseFloat((quantity * rate).toFixed(2));

      let addedToExistingGroup = false;

      // Try adding to an existing group
      for (let i = groupedInvoicesBySize.length - 1; i >= 0; i--) {
        const group = groupedInvoicesBySize[i];

        if (group.containerSize === size) {
          const lastInvoice = group.invoices[group.invoices.length - 1];
          const lastTo =
            Number(lastInvoice.containerTo) ||
            Number(lastInvoice.containerFrom || 0);
          const currentFrom = Number(invoice.containerFrom || 0);

          if (currentFrom === lastTo || currentFrom === lastTo + 1) {
            group.invoices.push(invoice);
            addedToExistingGroup = true;
            break; // No need to check further
          }
        }
      }

      // Create a new group if not added to an existing one
      if (!addedToExistingGroup) {
        groupedInvoicesBySize.push({
          containerType: type,
          containerSize: size,
          thicknessDetail: `${(
            invoice.thicknessDetail ?? ""
          ).toUpperCase()} DECORATIVE LAMINATES WITH BARRIER PAPER`,
          width: invoice?.width ?? 0,
          height: invoice?.thickness ?? 0,
          length: invoice?.length ?? 0,
          invoices: [invoice],
        });
      }
    });

    let totalAddition =
      master.additionalChargeType === "percentage"
        ? (master.totalAmount * master.additionalChargeValue) / 100
        : master.additionalChargeType === "flat"
        ? master.additionalChargeValue
        : 0;
    let totalDiscount =
      master.discountType === "percentage"
        ? (master.totalAmount * master.discountValue) / 100
        : master.discountType === "flat"
        ? master.discountValue
        : 0;

    groupedInvoicesBySize.forEach((item, index) => {
      item.showThickness = true;
      if (
        index > 0 &&
        item.thicknessDetail == groupedInvoicesBySize[index - 1].thicknessDetail
      ) {
        item.showThickness = false;
      }
      if (isCustom || master.calculationType != "Per Sheet") {
        item.invoices.forEach((invoice) => {
          invoice.rate = toFixedToFour(
            Number(invoice.value) / Number(invoice.squareMeter)
          );
        });
      }
    });
    let fromMap = {};
    let totalGrossWeight = 0;
    let totalNetWeight = 0;

    groupedInvoicesBySize.forEach((item, boxIndex) => {
      item.invoices.forEach((inv, invIndex) => {
        totalNetWeight += Number(inv.netWeight || 0);
        const containerWeight = Number(
          containerObj[inv.containerType].weight || 0
        );
        if (inv.containerFrom && inv.containerTo) {
          const from = Number(inv.containerFrom);
          const to = Number(inv.containerTo);
          const totalBoxes = to - from + 1;
          const netWeight = Number(inv.netWeight || 0);
          const grossWeight = netWeight + containerWeight * totalBoxes;
          inv.grossWeight = grossWeight.toFixed(0);
          totalGrossWeight += Number(grossWeight);
          inv.sizeInch = mmToInch(
            inv?.length,
            inv?.width,
            inv?.thickness,
            inv?.quantity || 0,
            totalBoxes
          );
        } else {
          const fromKey = inv.containerFrom;
          if (fromMap[fromKey]) {
            const lastLocation = fromMap[fromKey];
            const lastInv =
              groupedInvoicesBySize[lastLocation.boxIndex].invoices[
                lastLocation.invIndex
              ];

            if (lastInv) {
              inv.grossWeight = (
                Number(lastInv.grossWeight) + Number(inv.netWeight)
              ).toFixed(0);
              lastInv.grossWeight = "";
              inv.sizeInch = mmToInch(
                inv?.length,
                inv?.width,
                inv?.thickness,
                Number(inv?.quantity) + Number(lastInv?.prevQuantity) || 0,
                1
              );
              inv.prevQuantity =
                Number(inv?.quantity) + Number(lastInv?.prevQuantity);
              lastInv.prevQuantity = 0;
              lastInv.sizeInch = "";
            }

            // Update location to current invoice
            fromMap[fromKey] = { boxIndex, invIndex };
            totalGrossWeight += Number(inv.netWeight);
          } else {
            // First time seeing this fromKey
            fromMap[fromKey] = { boxIndex, invIndex };
            const grossWeight = Number(inv.netWeight || 0) + containerWeight;
            inv.grossWeight = grossWeight.toFixed(0);
            totalGrossWeight += grossWeight;
            inv.sizeInch = mmToInch(
              inv?.length,
              inv?.width,
              inv?.thickness,
              inv?.quantity || 0,
              1
            );
            inv.prevQuantity = Number(inv?.quantity) || 0;
          }
        }
      });
    });

    let CIItems = modifyCustomInvoiceData(
      groupedInvoicesBySize,
      totalAddition,
      totalDiscount,
      master
    );

    const containerSummary = groupedInvoicesBySize.map((item) => {
      item.invoices.forEach((inv) => {
        inv.value = toFixedToFour(inv.value);
        inv.rate = toFixedToFour(inv.rate);
      });

      return {
        width: item.width,
        height: item.height,
        length: item.length,
        totalSqMtPerType: toFixedToFour(
          item.invoices.reduce(
            (sum, invoice) => sum + parseFloat(invoice.squareMeter),
            0
          )
        ),
        avgWeight: toFixedToFour(
          (item.width * item.height * item.length * 1410) / 1000000000
        ),
      };
    });

    if (country === "aus") {
      [totalNetWeight, totalGrossWeight] = AusNzPackingListRoundOf(
        totalNetWeight,
        totalGrossWeight,
        groupedInvoicesBySize
      );
    }

    let docData = {
      invoiceNo: final.finalInvoice ?? "",
      modifyInvNo: cleanSlashes(final.finalInvoice) ?? "",
      invoiceDate: formatDateToDDMMYYYY(final.invoiceDate) ?? "",
      buyersOrderNo: master.customerOrderNo ?? "",
      orderDate: formatDateToDDMMYYYY(master.invoiceDate) ?? "",
      invoicePiNo: master.invoicePiNo ?? "",
      fsc: master.fsc ?? "",

      consigneeName: final.consigneeName ?? master.customerName ?? "",
      consigneeAddress: final.consigneeAddress ?? master.customerAddress ?? "",
      consigneeCity: final.consigneeCity ?? master.customerCity ?? "",
      consigneeState: final.consigneeState ?? master.customerState ?? "",
      consigneeCountry: final.consigneeCountry ?? master.customerCountry ?? "",
      consigneeZip: final.consigneeZip ?? master.customerZip ?? "",
      consigneePhone: customer?.phone ?? "",
      consigneeEmail: customer?.email ?? "",

      buyerAddress: final.buyerAddress ?? master.buyerAddress ?? "",
      buyerCity: final.buyerCity ?? master.buyerCity ?? "",
      buyerName: final.buyerName ?? master.buyerName ?? "",
      buyerCountry: final.buyerCountry ?? master.buyerCountry ?? "",
      buyerState: final.buyerState ?? master.buyerState ?? "",
      buyerZip: final.buyerZip ?? master.buyerZip ?? "",

      originOfGoods: final.originOfGoods ?? "",
      finalDestination: final.finalDestination ?? "",
      termOfDeliveryAndPayment: final.termsOfDp ?? "",

      precarriageBy: final.precarriage ?? "",
      vesselNo: final.vesselNo ?? "",
      portOfDischarge: final.portOfDischarge ?? "",
      placeOfReceipt: final.receiptPlace ?? "",
      portOfLoading: final.loadingPort ?? "",

      dischargeTerms: final.dischargeTerms ?? "",

      // invoiceItems: invoiceDetails.map((detail) => ({
      //   sizeThickness: `${detail?.length ?? ""} x ${detail?.width ?? ""} x ${
      //     detail?.thickness ?? ""
      //   } MM`,
      //   designFinish: detail?.finishType ?? "",
      //   quantity: detail?.quantity ?? "",
      //   totalSqMt: detail?.squareMeter ?? "",
      //   price: detail?.rate ?? "",
      //   value: (
      //     parseFloat(detail?.quantity || "0") * parseFloat(detail?.rate || "0")
      //   ).toFixed(2),
      // })),
      invoiceDetails,
      invoiceItems: groupedInvoicesBySize,
      IPItems: groupedInvoicesBySize,
      CIItems,
      rounding: master.rounding ?? "0",
      totalQuantity: master.totalQuantity ?? "0",
      totalBox,
      totalGrossWeight,
      totalNetWeight,
      totalSqMt: toFixedToFour(master.totalSquareMeters),
      totalAmount: master.totalAmount ?? "0",
      netAmount: master.netAmount ?? "",
      netAmountWords: convertToCapitalize(
        converter.toWords(master.netAmount ?? 0)
      ),
      currencyChar: currency.currencyChar,
      totalDiscount,
      totalAddition,
      additionSumAmount: toFixedToFour(
        Number(totalAddition) +
          Number(master.totalAmount ?? "0") -
          Number(totalDiscount ?? "0")
      ),
      containerSummary,

      bankName: companyData.bankName ?? "",
      bankBranch: companyData.bankAddressLine1 ?? "",
      bankCity: companyData.bankCity ?? "",
      swiftNumber: companyData.swiftCode ?? "",
      bankAddress: companyData.bankAddressLine1 ?? "",
      panNo: companyData.taxIdentificationNumber ?? "",
      adCode: companyData.additionalNumber ?? "",
      acCode: companyData.accountNumber ?? "",
      iec: companyData.importExportCode ?? "",

      bottomNotes: invoiceBottomNote.map((note) => note?.bottomNote ?? ""),

      discountType: master.discountType ?? "",
      discountValue: master.discountValue ?? "",
      additionalChargeType: master.additionalChargeType ?? "",
      additionalChargeValue: master.additionalChargeValue ?? "",
      deliveryTerms: final.deliveryTerms ?? "",
      deliveryDetails: master.deliveryDetails ?? "",
      shippingDetails: master.shippingDetails ?? "ICD - AHD",
      transportationMode: master.transportationMode ?? "",
      paymentTerms: master.paymentTerms ?? "",
      dispatchTerms: master.dispatchTerms ?? "",
      calculationType: master.calculationType ?? "",

      invoiceInstructions: invoiceInstruction.map(
        (inst) => inst?.invoiceInstruction ?? ""
      ),

      privateRemark: final.privateRemark ?? "",
      bottomNotes: invoiceBottomNote,
      isAus: country === "aus",
      isUK: country === "uk",
      isGen: country === "",
      isCustom,
    };

    return docData;
  } catch (error) {
    console.log(error);
  }
}

async function generateInvoiceDocument(body) {
  try {
    const { invoiceId, format, type, document, country } = body;
    const isCustom = type === "custom";
    let data = await readInvoiceData(invoiceId, isCustom, country);

    let template;
    let fileName = "output";

    if (document == "invoice") {
      if (type == "custom") {
        template = "custom-invoice.docx";
        fileName = `INV ${invoiceId} (custom)`;
      } else {
        if (country == "uk") {
          template = "party-invoice-uk.docx";
        } else if (country == "aus") {
          template = "party-invoice-aus.docx";
        } else {
          template = "party-invoice.docx";
        }
        fileName = `INV ${invoiceId} (party)`;
      }
    } else {
      if (country == "uk") {
        template = "packing-uk.docx";
      } else if (country == "aus") {
        template = "packing-aus.docx";
      } else {
        template = "packing.docx";
      }
      if (type == "custom") {
        fileName = `PLIST ${invoiceId} (custom)`;
      } else {
        // template = "party-packing.docx";
        fileName = `PLIST ${invoiceId} (party)`;
      }
    }
    let outputPath = await generateWordDocument(data, template, fileName);
    if (format == "ms-word") {
      await openFileByPath(outputPath);
    } else {
      await convertToPdf(outputPath, fileName);
    }
  } catch (error) {
    console.log(error);
  }
}

async function generateWordDocument(data, template, fileName) {
  try {
    // Load the template file
    const content = fs.readFileSync(
      path.join(__dirname, `./templates/${template}`),
      "binary"
    );

    // Create a PizZip instance with the template content
    const zip = new PizZip(content);

    // Initialize the docxtemplater with the zip file
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document by replacing placeholders with data
    doc.render(data);

    // Generate the output document
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Save the output document
    const outputPath = path.join(app.getPath("documents"), `${fileName}.docx`);
    fs.writeFileSync(outputPath, buf);

    console.log("Word document generated successfully!");
    return outputPath;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

// Function to open the Word document
function openFileByPath(filePath) {
  try {
    const command =
      process.platform === "win32"
        ? `start "" "${filePath}"`
        : `open "${filePath}"`;
    exec(command, (err) => {
      if (err) {
        console.error("Failed to open Word document:", err);
      } else {
        console.log("Word document opened successfully!");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// Convert the generated Word document to PDF
async function convertToPdf(inputPath, fileName) {
  try {
    // const inputPath = "output.docx";
    const outputPath = path.join(app.getPath("documents"), `${fileName}.pdf`);

    // Read the generated Word document
    const docxBuffer = fs.readFileSync(inputPath);

    // Convert the Word document to PDF
    const pdfBuffer = await libre.convertAsync(docxBuffer, ".pdf", undefined);

    // Save the PDF
    try {
      fs.writeFileSync(outputPath, pdfBuffer);
    } catch (error) {
      if (error && error.code == "EBUSY") {
        throw new Error(
          "The document is currently open. Please close it and try again."
        );
      }
      throw new Error(error.message);
    }
    await openFileByPath(outputPath);
    console.log("PDF generated successfully!");
  } catch (error) {
    console.log(error);
  }
}

function toFixedToFour(value) {
  const num = Number(value);
  return isNaN(num) ? "0.0000" : num.toFixed(4);
}

async function generateOrderConfirmation(body) {
  try {
    const { invoiceId, country, format, type } = body;
    let data = await readInvoiceData(invoiceId, false, country);

    let template = "order-confirmation.docx";
    let fileName = `PI ${invoiceId}`;

    if (type == "opf") {
      template = "order-processing-form.docx";
      fileName = `OPF ${invoiceId}`;
    } else if (type == "contract") {
      template = "contract-review.docx";
      fileName = `Contract Review ${invoiceId}`;
    }

    let outputPath = await generateWordDocument(data, template, fileName);
    if (format == "ms-word") {
      await openFileByPath(outputPath);
    } else {
      await convertToPdf(outputPath, fileName);
    }
  } catch (error) {
    console.log(error);
  }
}

function mmToInch(length, width, thickness, quantity, totalBoxes) {
  try {
    length = Number(length);
    width = Number(width);
    thickness = Number(thickness);
    quantity = Number(quantity);
    const obj = {
      3050: "125",
      1300: "55",
      1240: "53",
      2440: "101",
      1220: "52",
      2400: "99",
      2410: "99",
      1200: "51",
      1205: "51",
      2700: "111",
    };

    // Use approximation factor (~24) and offset (+3) for practical inches
    const toApproxInch = (mm) => Math.round((mm / 25 + 3) / 5) * 5;

    const lengthInch = obj[length] ?? toApproxInch(length);
    const widthInch = obj[width] ?? toApproxInch(width);

    // Fix: typo in variable name 'thickess' → 'thickness'
    const heightInch = Math.round(
      (quantity * thickness) / (25 * totalBoxes) + 3
    );

    return `${lengthInch} X ${widthInch} X ${heightInch}"`;
  } catch (error) {
    console.log(error);
  }
}

function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function cleanSlashes(value) {
  if (value == "") return "";
  const parts = value.split("/");
  if (parts.length > 2) {
    parts.splice(1, 1);
  }
  return parts.join("/");
}

module.exports = {
  generateInvoiceDocument,
  generateOrderConfirmation,
};

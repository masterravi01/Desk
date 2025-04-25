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

function modifyCustomInvoiceData(data, totalAddition, totalDiscount, master) {
  data = data.map((container) => {
    const groupedInvoices = {};

    container.invoices.forEach((invoice) => {
      const rateKey = invoice.rate;

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
    maxInvoice.rate =
      maxInvoice.value /
      (master.calculationType == "Per Sheet"
        ? Number(maxInvoice.quantity)
        : Number(maxInvoice.totalSq));
  }

  data.forEach((item) => {
    item.invoices.forEach((invoice) => {
      invoice.value = toFixedToFour(invoice.value);
      invoice.totalSq = toFixedToFour(invoice.totalSq);
      invoice.rate = toFixedToFour(invoice.rate);
    });
  });

  return data;
}

function calculateTotalBoxes(invoiceDetails) {
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

  const fromOnlyMap = {};
  const defaultBoxWeight = 100;
  let totalNetWeight = 0;
  let totalGrossWeight = 0;

  invoiceDetails.forEach((item, index) => {
    if (item.containerFrom && !item.containerTo) {
      const key = item.containerFrom;
      if (!fromOnlyMap[key]) fromOnlyMap[key] = [];
      fromOnlyMap[key].push({ item, index });
    }
  });
  Object.values(fromOnlyMap).forEach((group) => {
    const totalNet = group.reduce(
      (sum, entry) => sum + Number(entry.item.netWeight || 0),
      0
    );
    const lastEntry = group[group.length - 1];
    lastEntry.item.grossWeight = (totalNet + defaultBoxWeight).toFixed(2);
  });
  invoiceDetails.forEach((item) => {
    totalNetWeight += Number(item.netWeight || 0);
    if (item.containerFrom && item.containerTo) {
      const from = Number(item.containerFrom);
      const to = Number(item.containerTo);
      const totalBoxes = to - from + 1;
      const netWeight = Number(item.netWeight || 0);
      const grossWeight = netWeight + defaultBoxWeight * totalBoxes;
      item.grossWeight = grossWeight.toFixed(2);
      totalGrossWeight += grossWeight;
    } else {
      totalGrossWeight += Number(item.grossWeight);
    }
  });

  return { totalBox, invoiceDetails, totalGrossWeight, totalNetWeight };
}

async function readInvoiceData(invoiceId) {
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

  let groupedInvoicesBySize = {};

  let details = calculateTotalBoxes(invoiceDetails);
  let { totalBox, totalNetWeight, totalGrossWeight } = details;
  invoiceDetails = details.invoiceDetails;
  invoiceDetails.forEach((invoice) => {
    const type = invoice.containerType;
    const container = containers.find((c) => c.containerName === type);
    invoice.squareMeter = toFixedToFour(invoice.squareMeter);
    invoice.rate = toFixedToFour(invoice.rate);
    invoice.lwh = `${container.length} X ${container.width} X ${container.height}`;
    if (!groupedInvoicesBySize[type]) {
      groupedInvoicesBySize[type] = {
        containerType: type,
        thicknessDetail: invoice.thicknessDetail,
        width: container.width ?? 0,
        height: container.height ?? 0,
        length: container.length ?? 0,
        lengthInch: container.lengthInch ?? 0,
        widthInch: container.widthInch ?? 0,
        heightInch: container.heightInch ?? 0,
        invoices: [],
      };
    }
    // invoice.value = (
    //   parseFloat((master.calculationType == 'Per Sheet' ? Number(invoice?.quantity || "0") : Number(invoice?.squareMeter  || "0") )) * parseFloat(invoice?.rate || "0")
    // ).toFixed(4);
    invoice.value =
      Number(invoice?.quantity || "0") *
      parseFloat(invoice?.rate || "0").toFixed(4);
    groupedInvoicesBySize[type].invoices.push(invoice);
  });
  groupedInvoicesBySize = Object.values(groupedInvoicesBySize);

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

  let docData = {
    invoiceNo: final.finalInvoice ?? "",
    invoiceDate: final.invoiceDate ?? "",
    buyersOrderNo: master.customerOrderNo ?? "",
    orderDate: master.invoiceDate ?? "",
    invoicePiNo: master.invoicePiNo ?? "",

    consigneeName: final.consigneeName ?? "",
    consigneeAddress: final.consigneeAddress ?? "",
    consigneeCity: final.consigneeCity ?? "",
    consigneeState: final.consigneeState ?? "",
    consigneeCountry: final.consigneeCountry ?? "",
    consigneeZip: final.consigneeZip ?? "",

    buyerAddress: final.buyerAddress ?? "",
    buyerCity: final.buyerCity ?? "",
    buyerName: final.buyerName ?? "",
    buyerCountry: final.buyerCountry ?? "",
    buyerState: final.buyerState ?? "",
    buyerZip: final.buyerZip ?? "",

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
    bankBranch: companyData.bankAddressLine2 ?? "",
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
    deliveryTerms: master.deliveryTerms ?? "",
    deliveryDetails: master.deliveryDetails ?? "",
    shippingDetails: master.shippingDetails ?? "",
    paymentTerms: master.paymentTerms ?? "",
    dispatchTerms: master.dispatchTerms ?? "",
    calculationType: master.calculationType ?? "",

    invoiceInstructions: invoiceInstruction.map(
      (inst) => inst?.invoiceInstruction ?? ""
    ),

    privateRemark: final.privateRemark ?? "",
    bottomNotes: invoiceBottomNote,
  };

  return docData;
}

async function generateInvoiceDocument(body) {
  const { invoiceId, format, type, document } = body;
  let data = await readInvoiceData(invoiceId);

  let template;
  let fileName = "output";

  if (document == "invoice") {
    if (type == "custom") {
      template = "custom-invoice.docx";
      fileName = `INV ${invoiceId} (custom)`;
    } else {
      template = "party-invoice.docx";
      fileName = `INV ${invoiceId} (party)`;
    }
  } else {
    if (type == "custom") {
      template = "custom-packing.docx";
      fileName = `PLIST ${invoiceId} (custom)`;
    } else {
      template = "party-packing.docx";
      fileName = `PLIST ${invoiceId} (party)`;
    }
  }
  let outputPath = await generateWordDocument(data, template, fileName);
  if (format == "ms-word") {
    openFileByPath(outputPath);
  } else {
    convertToPdf(outputPath, fileName);
  }
}

async function generateWordDocument(data, template, fileName) {
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
  try {
    fs.writeFileSync(outputPath, buf);
  } catch (error) {
    if (error && error.code == "EBUSY") {
      throw new Error(
        "The document is currently open. Please close it and try again."
      );
    }
    throw new Error(error.message);
  }

  console.log("Word document generated successfully!");
  return outputPath;
}

// Function to open the Word document
function openFileByPath(filePath) {
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
}

// Convert the generated Word document to PDF
async function convertToPdf(inputPath, fileName) {
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
  openFileByPath(outputPath);
  console.log("PDF generated successfully!");
}

function toFixedToFour(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : Number(num.toFixed(4));
}

async function generateOrderConfirmation(body) {
  const { invoiceId, country, format, type } = body;
  let data = await readInvoiceData(invoiceId);

  let template = "order-confirmation.docx";
  let fileName = `PI ${invoiceId}`;

  if (type == "opf") {
    template = "order-processing-form.docx";
    fileName = "OPF";
  }

  let outputPath = await generateWordDocument(data, template, fileName);
  if (format == "ms-word") {
    openFileByPath(outputPath);
  } else {
    convertToPdf(outputPath, fileName);
  }
}

module.exports = {
  generateInvoiceDocument,
  generateOrderConfirmation,
};

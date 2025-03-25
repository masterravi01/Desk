const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const { exec } = require("child_process"); // Import the exec function from child_process
libre.convertAsync = require("util").promisify(libre.convert);

const db = require("../database");
const { getInvoice } = require("../controllers/invoice");
const { getAllContainer } = require("../controllers/container");
const { getCurrencyByName } = require("../controllers/currency");

async function readInvoiceData(invoiceId) {
  const {
    invoiceMaster = [],
    invoiceDetails = [],
    invoiceInstruction = [],
    finalInvoice = [],
    invoiceBottomNote = [],
  } = await getInvoice(invoiceId);
  const master = invoiceMaster[0] || {};
  const final = finalInvoice[0] || {};

  const containers = await getAllContainer();
  const currency = await getCurrencyByName(master.currency);

  let groupedInvoices = {};
  let totalBox = 0;
  invoiceDetails.forEach((invoice) => {
    const type = invoice.containerType;

    if (!groupedInvoices[type]) {
      const container = containers.find((c) => c.containerName === type);

      groupedInvoices[type] = {
        containerType: type,
        width: container.width ?? 0,
        height: container.height ?? 0,
        length: container.length ?? 0,
        invoices: [],
      };
    }
    invoice.value = (
      parseFloat(invoice?.quantity || "0") * parseFloat(invoice?.rate || "0")
    ).toFixed(2);
    groupedInvoices[type].invoices.push(invoice);
    totalBox +=
      Number(invoice.containerTo ?? "0") - Number(invoice.containerFrom ?? "0");
  });

  groupedInvoices = Object.values(groupedInvoices);

  const containerSummary = groupedInvoices.map((item) => ({
    width: item.width,
    height: item.height,
    length: item.length,
    totalSqMtPerType: item.invoices.reduce(
      (sum, invoice) => sum + parseFloat(invoice.squareMeter),
      0
    ),
    avgWeight: (item.width * item.height * item.length * 1410) / 1000000000,
  }));

  let docData = {
    invoiceNo: final.finalInvoice ?? "",
    invoiceDate: final.invoiceDate ?? "",
    buyersOrderNo: master.customerOrderNo ?? "",
    orderDate: master.invoiceDate ?? "",

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
    invoiceItems: groupedInvoices,
    rounding: master.rounding ?? "0",
    totalQuantity: master.totalQuantity ?? "0",
    totalBox,
    totalSqMt: master.totalSquareMeters ?? "0",
    totalAmount: master.totalAmount ?? "0",
    netAmount: master.netAmount ?? "",
    currencyChar: currency.currencyChar,
    totalDiscount:
      master.discountType === "percentage"
        ? (master.totalAmount * master.discountValue) / 100
        : master.discountType === "flat"
        ? master.discountValue
        : 0,
    totalAddition:
      master.additionalChargeType === "percentage"
        ? (master.totalAmount * master.additionalChargeValue) / 100
        : master.additionalChargeType === "flat"
        ? master.additionalChargeValue
        : 0,

    containerSummary,

    bankName: final.bankName ?? "",
    bankBranch: final.branchName ?? "",
    bankCity: final.bankCity ?? "",
    swiftNumber: master.swiftNumber ?? "",
    bankAddress: final.bankAddress ?? "",
    panNo: final.panNo ?? "",
    adCode: final.adCode ?? "",
    acCode: final.acCode ?? "",
    iec: final.iec ?? "",

    bottomNotes: invoiceBottomNote.map((note) => note?.bottomNote ?? ""),

    discountType: master.discountType ?? "",
    discountValue: master.discountValue ?? "",
    additionalChargeType: master.additionalChargeType ?? "",
    additionalChargeValue: master.additionalChargeValue ?? "",
    deliveryTerms: master.deliveryTerms ?? "",
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
  const { invoiceId } = body;
  let data = await readInvoiceData(invoiceId);

  let template = "template.docx";
  await generateWordDocument(data, template);
}

async function generateWordDocument(data, template) {
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
  fs.writeFileSync("output.docx", buf);

  console.log("Word document generated successfully!");
  openWordDocument("output.docx");
}

// Function to open the Word document
function openWordDocument(filePath) {
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

// Open the generated Word document

// Convert the generated Word document to PDF
async function convertToPdf() {
  const inputPath = "output.docx";
  const outputPath = "output.pdf";

  // Read the generated Word document
  const docxBuffer = fs.readFileSync(inputPath);

  // Convert the Word document to PDF
  const pdfBuffer = await libre.convertAsync(docxBuffer, ".pdf", undefined);

  // Save the PDF
  fs.writeFileSync(outputPath, pdfBuffer);

  console.log("PDF generated successfully!");
}

// convertToPdf().catch((err) => {
//   console.error("Error converting to PDF:", err);
// });

module.exports = {
  generateInvoiceDocument,
};

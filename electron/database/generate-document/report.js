const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const { exec } = require("child_process"); // Import the exec function from child_process
libre.convertAsync = require("util").promisify(libre.convert);

const db = require("../database");
const { getInvoice } = require("../controllers/invoice");
const { app } = require("electron");

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

  let docData = {
    invoiceNo: final.finalInvoice ?? "",
    invoiceDate: final.invoiceDate ?? "",
    buyersOrderNo: master.customerOrderNo ?? "",
    orderDate: master.invoiceDate ?? "",

    consigneeName: final.consigneeName ?? "",
    consigneeCountry: final.consigneeCountry ?? "",

    buyerName: final.buyerName ?? "",
    buyerAddress: final.buyerAddress ?? "",

    originOfGoods: final.originOfGoods ?? "",
    finalDestination: final.finalDestination ?? "",
    termOfDeliveryAndPayment: final.termsOfDp ?? "",

    precarriageBy: final.precarriage ?? "",
    vesselNo: final.vesselNo ?? "",
    portOfDischarge: final.portOfDischarge ?? "",
    placeOfReceipt: final.receiptPlace ?? "",
    portOfLoading: final.loadingPort ?? "",

    dischargeTerms: final.dischargeTerms ?? "",

    invoiceDetails: invoiceDetails.map((detail) => ({
      sizeThickness: `${detail?.length ?? ""} x ${detail?.width ?? ""} x ${
        detail?.thickness ?? ""
      } MM`,
      designFinish: detail?.finishType ?? "",
      quantity: detail?.quantity ?? "",
      totalSquareMeters: detail?.squareMeter ?? "",
      price: detail?.rate ?? "",
      value: (
        parseFloat(detail?.quantity || "0") * parseFloat(detail?.rate || "0")
      ).toFixed(2),
    })),

    bankName: final.bankName ?? "",
    bankBranch: final.branchName ?? "",
    bankCity: final.bankCity ?? "",
    swiftNumber: master.swiftNumber ?? "",
    bankAddress: final.bankAddress ?? "",

    bottomNotes: invoiceBottomNote.map((note) => note?.bottomNote ?? ""),

    discountType: master.discountType ?? "",
    discountValue: master.discountValue ?? "",
    additionalChargeType: master.additionalChargeType ?? "",
    additionalChargeValue: master.additionalChargeValue ?? "",
    totalQuantity: master.totalQuantity ?? "",
    totalAmount: master.totalAmount ?? "",
    netAmount: master.netAmount ?? "",
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
  const outputPath = path.join(app.getPath("documents"), "output.docx");
  fs.writeFileSync(outputPath, buf);

  console.log("Word document generated successfully!");
  openWordDocument(outputPath);
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

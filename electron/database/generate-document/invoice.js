const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

// Load the template file
const content = fs.readFileSync("./templates/template.docx", "binary");

// Create a PizZip instance with the template content
const zip = new PizZip(content);

// Initialize the docxtemplater with the zip file
const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

// Define the data to replace placeholders
const data = {
  name: "John Doe",
  companyName: "Awesome Corp",
  signature: "Jane Smith",
  items: [
    {
      name: "Product A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
  ],
};

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

convertToPdf().catch((err) => {
  console.error("Error converting to PDF:", err);
});

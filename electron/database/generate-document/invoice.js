const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

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
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
      quantity: 2,
      price: "$10",
    },
    { name: "Product B", quantity: 5, price: "$25" },
    { name: "Product C", quantity: 1, price: "$5" },
    {
      name: "Product AProduct AProduct AProduct AProduct A",
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

console.log("Document generated successfully!");

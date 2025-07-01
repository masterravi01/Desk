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

function groupByContainerSize(data) {
  const map = new Map();

  data.forEach((item) => {
    const key = item.containerSize;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.invoices.push(...item.invoices);
    } else {
      map.set(key, { ...item, invoices: [...item.invoices] });
    }
  });

  return Array.from(map.values());
}

function modifyCustomInvoiceData(
  data,
  totalAddition,
  totalDiscount,
  master,
  country,
  customer
) {
  try {
    let sampleInvoice = [];
    data = groupByContainerSize(data);
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
            sampleDetails: "",
          };
        }

        groupedInvoices[rateKey].quantity += Number(invoice.quantity);
        groupedInvoices[rateKey].totalSq += Number(invoice.squareMeter);
        groupedInvoices[rateKey].value += Number(invoice.value);
        groupedInvoices[rateKey].sampleDetails += " " + invoice.brandName;
        groupedInvoices[rateKey].sampleDetails += " " + invoice.designType;
        groupedInvoices[rateKey].sampleDetails += " " + invoice.finishType;
        groupedInvoices[rateKey].sampleDetails += " " + invoice.materialGrade;
      });

      return {
        ...container,
        invoices: Object.values(groupedInvoices),
      };
    });
    let maxInvoice = null;

    data.forEach((container) => {
      if (
        container?.width == "0" &&
        container?.length == "0" &&
        container?.height == "0"
      )
        return;
      container.invoices.forEach((invoice) => {
        if (!maxInvoice || Number(invoice.rate) > Number(maxInvoice.rate)) {
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
        Number(maxInvoice.value ?? "0") / Number(maxInvoice.totalSq ?? "0")
      );
    }

    data.forEach((item, index) => {
      item.invoices.forEach((invoice, idx) => {
        invoice.isFirst = idx === 0;
        invoice.value = toFixedToTwo(Number(invoice.value ?? "0"));
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

      if (index == data.length - 1) {
        item.isLast = true;
        if (
          country === "aus" ||
          customer?.name?.trim() === "FOREST ONE AUSTRALIA PTY LTD"
        ) {
          item.commision = toFixedToTwo(
            Number(master.totalAmount ?? "0") * 0.05
          );
        }
      }
    });
    let diff = 0;
    data.forEach((item, index) => {
      item.invoices.forEach((invoice, idx) => {
        let postValue = 0;
        if (item?.width == "0" && item?.length == "0" && item?.height == "0") {
          sampleInvoice.push(invoice);
          postValue = toFixedToTwo(
            Number(invoice.quantity) * Number(invoice.rate)
          );
        } else {
          postValue = toFixedToTwo(
            Number(invoice.totalSq) * Number(invoice.rate)
          );
        }
        if (postValue != invoice.value) {
          diff += Number(
            toFixedToTwo(Number(postValue) - Number(invoice.value))
          );
          invoice.value = postValue;
        }
      });
    });
    if (sampleInvoice.length > 0) {
      data.pop();
    }
    return { CIItems: data, diff, sampleInvoice };
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

function modifyOC(items, customer) {
  try {
    items.forEach((inv) => {
      if (
        customer?.name?.trim() === "FOREST ONE AUSTRALIA PTY LTD" &&
        Number(inv.height) === 3
      ) {
        inv.extNotes = "ANTIBACTERIAL GRADE";
      }
    });

    for (let group of items) {
      for (let invoice of group.invoices) {
        const rate = Number(invoice.rate ?? "0");
        invoice.rate = rate.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          useGrouping: false,
        });

        invoice.value = toFixedToTwo(Number(invoice.value ?? "0"));
      }
    }

    return items;
  } catch (error) {
    console.log(error);
    return items;
  }
}
function formatRate(rate) {
  const num = Number(rate);
  if (isNaN(num)) return "0";

  if (Number.isInteger(num)) return num.toFixed(2);

  const decimalPart = num.toString().split(".")[1];
  if (decimalPart.length === 1) return num.toFixed(2);

  return num.toString(); // Convert 16.124 to "16.124" for consistency
}

function modifyIP(items, customer) {
  try {
    items.forEach((inv) => {
      if (
        customer?.name?.trim() === "FOREST ONE AUSTRALIA PTY LTD" &&
        Number(inv.height) === 3
      ) {
        inv.extNotes = "ANTIBACTERIAL GRADE";
      }
    });

    for (let group of items) {
      for (let invoice of group.invoices) {
        invoice.rate = toFixedToTwo(Number(invoice.rate ?? "0"));
        invoice.value = toFixedToTwo(Number(invoice.value ?? "0"));
      }
    }

    return items;
  } catch (error) {
    console.log(error);
    return items;
  }
}

function AusNzPackingListRoundOf(
  totalNetWeight,
  totalGrossWeight,
  groupedInvoicesBySize
) {
  let toReduce = totalNetWeight % 10;
  totalNetWeight = Math.floor(totalNetWeight / 10) * 10; // Round down to nearest 10

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

  toReduce = totalGrossWeight % 10;
  totalGrossWeight = Math.floor(totalGrossWeight / 10) * 10; // Round down to nearest 10

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

function sampleBoxPriceToFree(sampleBox) {
  sampleBox.forEach((item) => {
    if (Number(item.rate) === 0) {
      item.rate = "FREE";
    }
    if (Number(item.value) === 0) {
      item.value = "FREE";
    } else {
      item.value = toFixedToTwo(item.value);
    }
  });
}

async function readInvoiceData(invoiceId, isCustom, country = "", document) {
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
    let currency = await getCurrencyByName(master.currency);
    if (!currency)
      currency = {
        id: 1,
        currencyName: null,
        currencyChar: "SIN $",
        currencyCountry: null,
      };
    const customer = await getCustomer(master.customerId);
    const containerObj = {};
    containers.forEach((c) => {
      containerObj[c.containerName] = c;
    });
    if (master.specialInstruction && master.specialInstruction != "") {
      invoiceInstruction.unshift({
        invoiceInstruction: master.specialInstruction,
      });
    }

    let groupedInvoicesBySize = [];
    let sampleBox = [];

    let totalBox = calculateTotalBoxes(invoiceDetails);

    invoiceDetails.forEach((invoice) => {
      const type = invoice.containerType;

      invoice.netWeight = invoice.netWeight.toFixed(0);
      invoice.preRate = invoice.rate;
      invoice.lwh = `${invoice?.length} X ${invoice?.width} X ${invoice?.thickness}`;

      const size = invoice.lwh;

      const quantity = Number(invoice?.quantity || 0);
      const rate = parseFloat(invoice?.rate || 0);
      invoice.value = parseFloat(quantity * rate);

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
        if (
          invoice?.width == 0 &&
          invoice?.length == 0 &&
          invoice?.thickness == 0
        ) {
          sampleBox.push(invoice);
          if (sampleBox.length == 1) {
            sampleBox[0].isFirst = true;
          }
        }
        // } else {
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
        // }
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
          invoice.rate =
            Number(invoice.squareMeter) != 0
              ? Number(invoice.value) / Number(invoice.squareMeter)
              : invoice.rate;
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

    let { CIItems, diff, sampleInvoice } = modifyCustomInvoiceData(
      groupedInvoicesBySize,
      totalAddition,
      totalDiscount,
      master,
      country,
      customer
    );

    let totalSqMt = 0;
    const containerSummary = CIItems.map((item) => {
      const totalSqMtPerType = toFixedToFour(
        item.invoices.reduce(
          (sum, invoice) => sum + parseFloat(invoice.totalSq),
          0
        )
      );

      totalSqMt += Number(totalSqMtPerType ?? 0);

      return {
        width: item.width,
        height: item.height,
        length: item.length,
        totalSqMtPerType,
        avgWeight: toFixedToFour(
          (item.width * item.height * item.length * 1410) / 1000000000
        ),
      };
    });

    if (
      country === "aus" ||
      customer?.name?.trim() === "FOREST ONE AUSTRALIA PTY LTD"
    ) {
      [totalNetWeight, totalGrossWeight] = AusNzPackingListRoundOf(
        totalNetWeight,
        totalGrossWeight,
        groupedInvoicesBySize
      );
    }
    let additionSumAmount =
      Number(totalAddition ?? "0") +
      Number(master.totalAmount ?? "0") -
      Number(totalDiscount ?? "0");
    additionSumAmount = toFixedToTwo(
      isCustom ? additionSumAmount + diff : additionSumAmount
    );
    let rounding = isCustom
      ? toFixedToTwo(
          -(Number(additionSumAmount) - Number(master.netAmount ?? "0"))
        )
      : master.rounding;

    if (sampleBox.length > 0) {
      if (isCustom && document == "invoice") {
        sampleBox = sampleInvoice;
      } else {
        sampleBox =
          groupedInvoicesBySize[groupedInvoicesBySize.length - 1].invoices;
        groupedInvoicesBySize.pop();
      }
    }

    sampleBoxPriceToFree(sampleBox);

    let docData = {
      invoiceNo: final.finalInvoice ?? "",
      modifyInvNo: cleanSlashes(final.finalInvoice, "removeMiddle") ?? "",
      invoiceDate: formatDateToDDMMYYYY(final.invoiceDate) ?? "",
      buyersOrderNo: master.customerOrderNo ?? "",
      orderDate: formatDateToDDMMYYYY(master.invoiceDate) ?? "",
      invoicePiNo: master.invoicePiNo ?? "",
      fsc: master.fsc ?? "",

      consigneeName: final.consigneeName || master.customerName || "",
      consigneeAddress: final.consigneeAddress || master.customerAddress || "",
      consigneeCity: final.consigneeCity || master.customerCity || "",
      consigneeState: final.consigneeState || master.customerState || "",
      consigneeCountry: final.consigneeCountry || master.customerCountry || "",
      consigneeZip: final.consigneeZip || master.customerZip || "",
      consigneePhone: customer?.phone ?? "",
      consigneeEmail: customer?.email ?? "",

      buyerAddress: final.buyerAddress || master.buyerAddress || "",
      buyerCity: final.buyerCity || master.buyerCity || "",
      buyerName: final.buyerName || master.buyerName || "",
      buyerCountry: final.buyerCountry || master.buyerCountry || "",
      buyerState: final.buyerState || master.buyerState || "",
      buyerZip: final.buyerZip || master.buyerZip || "",

      originOfGoods: final.originOfGoods ?? "",
      finalDestination: final.finalDestination ?? "",
      termOfDeliveryAndPayment: final.termsOfDp ?? "",

      precarriageBy: final.precarriage ?? "",
      vesselNo: final.vesselNo ?? "",
      portOfDischarge: final.portOfDischarge || master.portOfDischarge || "",
      placeOfReceipt: final.receiptPlace ?? "",
      portOfLoading: final.loadingPort ?? "",

      dischargeTerms: final.dischargeTerms || master.dispatchTerms || "",
      dispatchTerms: final.dischargeTerms || master.dispatchTerms || "",

      invoiceDetails,
      invoiceItems: groupedInvoicesBySize,
      IPItems: modifyIP(
        JSON.parse(JSON.stringify(groupedInvoicesBySize)),
        customer
      ),
      OCItems: modifyOC(
        JSON.parse(JSON.stringify(groupedInvoicesBySize)),
        customer
      ),
      CIItems,
      sampleBox,
      isSampleBox: sampleBox?.length != 0,
      rounding: toFixedToTwo(rounding ?? "0"),
      totalQuantity: master.totalQuantity ?? "0",
      totalBox,
      totalGrossWeight,
      totalNetWeight,
      // totalSqMt: toFixedToFour(master.totalSquareMeters),
      totalSqMt: toFixedToFour(totalSqMt),
      totalAmount: toFixedToTwo(master.totalAmount ?? "0"),
      netAmount: toFixedToTwo(Number(master.netAmount ?? "0")),
      netAmountWords: convertToCapitalize(
        converter.toWords(master.netAmount ?? 0)
      ),
      currencyChar: currency.currencyChar,
      totalDiscount: toFixedToTwo(totalDiscount ?? "0"),
      totalAddition: toFixedToTwo(totalAddition ?? "0"),
      additionSumAmount: additionSumAmount,

      containerSummary,

      bankName: companyData.bankName ?? "",
      bankBranch: companyData.bankAddressLine1 ?? "",
      bankCity: companyData.bankCity ?? "",
      swiftNumber: companyData.swiftCode ?? "",
      bankAddress: companyData.bankAddressLine1 ?? "",

      bNameOC: master.bankName ?? "",
      bBranchOC: master.bankBranch ?? "",
      bAddressOC: master.bankAddress ?? "",
      bCityOC: master.bankCity ?? "",
      swiftNumberOC: master.swiftNumber ?? "",

      panNo: companyData.taxIdentificationNumber ?? "",
      adCode: companyData.additionalNumber ?? "",
      acCode: companyData.accountNumber ?? "",
      iec: companyData.importExportCode ?? "",

      bottomNotes: invoiceBottomNote.map((note) => note?.bottomNote ?? ""),

      discountType: master.discountType ?? "",
      discountValue: master.discountValue ?? "",
      additionalChargeType: master.additionalChargeType ?? "",
      additionalChargeValue: master.additionalChargeValue ?? "",
      deliveryTerms: final.deliveryTerms || master.deliveryTerms || "",
      deliveryDetails: master.deliveryDetails ?? "",
      shippingDetails: master.shippingDetails ?? "",
      transportationMode: master.transportationMode ?? "",
      deliveryAt: master.deliveryAt ?? "ICD - AHD",
      specialInstruction: master.specialInstruction ?? "",
      paymentTerms: master.paymentTerms ?? "",
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
    const { invoiceId, format, type, document, country, finalInvoice } = body;
    const isCustom = type === "custom";
    let data = await readInvoiceData(invoiceId, isCustom, country, document);

    let template;
    let fileName = "output";

    let invID = cleanSlashes(finalInvoice, "getLast");

    if (document == "invoice") {
      if (type == "custom") {
        template = "custom-invoice.docx";
        fileName = `INV ${invID} (custom)`;
      } else {
        if (country == "uk") {
          template = "party-invoice-uk.docx";
        } else if (country == "aus") {
          template = "party-invoice-aus.docx";
        } else {
          template = "party-invoice.docx";
        }
        fileName = `INV ${invID} (party)`;
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
        fileName = `PLIST ${invID} (custom)`;
      } else {
        // template = "party-packing.docx";
        fileName = `PLIST ${invID} (party)`;
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

function toFixedToTwo(value) {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}

async function generateOrderConfirmation(body) {
  try {
    const { invoiceId, country, format, type, invoicePiNo } = body;
    let data = await readInvoiceData(invoiceId, false, country);

    let piID = cleanSlashes(invoicePiNo, "getLast");
    let template = "order-confirmation.docx";
    let fileName = `PI ${piID}`;

    if (type == "opf") {
      template = "order-processing-form.docx";
      fileName = `OPF ${piID}`;
    } else if (type == "contract") {
      template = "contract-review.docx";
      fileName = `Contract Review ${piID}`;
    } else {
      if (country == "aus") {
        template = "order-confirmation-aus.docx";
      } else {
        template = "order-confirmation.docx";
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

function cleanSlashes(value, action) {
  if (!value || value == "") return "";
  if (action == "removeMiddle") {
    const parts = value.split("/");
    if (parts.length > 2) {
      parts.splice(1, 1);
    }
    return parts.join("/");
  } else {
    return value.split("/").pop();
  }
  return value;
}

module.exports = {
  generateInvoiceDocument,
  generateOrderConfirmation,
};

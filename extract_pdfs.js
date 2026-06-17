const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
  try {
    const buf = fs.readFileSync('d:/Jibble/Product Document/JIBBLE_30_DAY_PLAN.pdf');
    const parser = new PDFParse({ data: buf });
    const textResult = await parser.getText();
    fs.writeFileSync('d:/Jibble/Product Document/plan_text.txt', textResult.text, 'utf8');
    console.log("Successfully extracted 30 Day Plan PDF!");
  } catch (err) {
    console.error("Error extracting 30 Day Plan:", err);
  }

  try {
    const buf = fs.readFileSync('d:/Jibble/Product Document/JIBBLE-ADMIN-PANEL-PRD.pdf');
    const parser = new PDFParse({ data: buf });
    const textResult = await parser.getText();
    fs.writeFileSync('d:/Jibble/Product Document/admin_prd_text.txt', textResult.text, 'utf8');
    console.log("Successfully extracted Admin Panel PRD PDF!");
  } catch (err) {
    console.error("Error extracting Admin Panel PRD:", err);
  }
}

extract();

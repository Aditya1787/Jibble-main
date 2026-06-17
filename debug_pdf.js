const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  try {
    const buf = fs.readFileSync('d:/Jibble/Product Document/JIBBLE_30_DAY_PLAN.pdf');
    const parser = new PDFParse({ data: buf });
    console.log("PDF parser initialized!");
    const textResult = await parser.getText();
    console.log("Text size:", textResult.text.length);
    console.log("Preview:", textResult.text.substring(0, 300));
  } catch (e) {
    console.error("Test failed:", e);
  }
}
test();

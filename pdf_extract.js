const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function extract() {
  try {
    const parser = new PDFParse();
    const buf = fs.readFileSync('d:/Jibble/Product Document/PRODUCT REQUIREMENTS DOCUMENT JIBBLE.pdf');
    const data = await parser.parse(buf);
    const text = data.pages.map(p => p.Texts.map(t => decodeURIComponent(t.R.map(r=>r.T).join(''))).join(' ')).join('\n');
    fs.writeFileSync('d:/Jibble/Product Document/prd_text.txt', text, 'utf8');
    console.log('PRD done');
  } catch(e) { console.error('PRD error:', e.message); }

  try {
    const parser = new PDFParse();
    const buf = fs.readFileSync('d:/Jibble/Product Document/TECHNICAL REQUIREMENTS DOCUMENT.pdf');
    const data = await parser.parse(buf);
    const text = data.pages.map(p => p.Texts.map(t => decodeURIComponent(t.R.map(r=>r.T).join(''))).join(' ')).join('\n');
    fs.writeFileSync('d:/Jibble/Product Document/trd_text.txt', text, 'utf8');
    console.log('TRD done');
  } catch(e) { console.error('TRD error:', e.message); }
}

extract();

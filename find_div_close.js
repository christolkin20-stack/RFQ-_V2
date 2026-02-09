const fs = require('fs');
const code = fs.readFileSync('rfq/static/rfq/rfq.js', 'utf8');
const lines = code.split('\n');

// Find line 921 (view-quoting opens) and count div depth from there
const startLine = 920; // 0-indexed
let divDepth = 0;
let foundClose = false;

for (let i = startLine; i < Math.min(lines.length, 2000); i++) {
    const line = lines[i];
    // Count <div> and </div> in the line
    const opens = (line.match(/<div[\s>]/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;

    divDepth += opens - closes;

    if (i === startLine) {
        console.log(`Line ${i+1}: depth after = ${divDepth} | ${line.trim().substring(0, 60)}`);
    }

    if (divDepth === 0 && i > startLine) {
        console.log(`view-quoting closes at line ${i+1}: ${line.trim().substring(0, 60)}`);
        foundClose = true;
        break;
    }

    if (divDepth < 0) {
        console.log(`WARNING: Negative depth at line ${i+1}! depth=${divDepth}`);
        console.log(`  ${line.trim().substring(0, 80)}`);
        break;
    }
}

if (!foundClose) {
    console.log('view-quoting did NOT close within first 2000 lines from start!');
    console.log('Final div depth:', divDepth);
}

// Now check where view-supplier-detail starts and if it's INSIDE view-quoting
const supplierDetailLine = lines.findIndex(l => l.includes('id="view-supplier-detail"'));
if (supplierDetailLine > 0) {
    console.log(`\nview-supplier-detail is at line ${supplierDetailLine + 1}`);
}

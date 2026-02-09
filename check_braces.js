const fs = require('fs');
const code = fs.readFileSync('rfq/static/rfq/rfq.js', 'utf8');
const lines = code.split('\n');

let depth = 0;
let inSingleQuote = false;
let inDoubleQuote = false;
let inTemplate = 0;
let inBlockComment = false;
let prevChar = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        const nextCh = j < line.length - 1 ? line[j + 1] : '';

        if (inBlockComment) {
            if (ch === '*' && nextCh === '/') {
                inBlockComment = false;
                j++;
            }
            prevChar = ch;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && inTemplate === 0) {
            if (ch === '/' && nextCh === '/') break;
            if (ch === '/' && nextCh === '*') {
                inBlockComment = true;
                j++;
                prevChar = '*';
                continue;
            }
        }

        if (inSingleQuote) {
            if (ch === "'" && prevChar !== '\\') inSingleQuote = false;
            prevChar = (ch === '\\' && prevChar === '\\') ? '' : ch;
            continue;
        }
        if (inDoubleQuote) {
            if (ch === '"' && prevChar !== '\\') inDoubleQuote = false;
            prevChar = (ch === '\\' && prevChar === '\\') ? '' : ch;
            continue;
        }
        if (inTemplate > 0) {
            if (ch === '`') { inTemplate--; prevChar = ch; continue; }
            if (ch === '$' && nextCh === '{') { depth++; j++; prevChar = '{'; continue; }
            prevChar = ch;
            continue;
        }

        if (ch === '`') { inTemplate++; prevChar = ch; continue; }
        if (ch === "'") { inSingleQuote = true; prevChar = ch; continue; }
        if (ch === '"') { inDoubleQuote = true; prevChar = ch; continue; }

        if (ch === '{') depth++;
        if (ch === '}') depth--;

        prevChar = ch;
    }

    // Reset line-level state
    if (inSingleQuote || inDoubleQuote) {
        // Multi-line string - shouldn't happen outside templates
    }

    const lineNum = i + 1;

    if (lineNum === 3120) {
        console.log(`Line ${lineNum} (init start): depth=${depth}`);
    }
    if (lineNum === 22922) {
        console.log(`Line ${lineNum} (expected init end): depth=${depth}`);
    }
    if (lineNum === 22923) {
        console.log(`Line ${lineNum} (expected object end): depth=${depth}`);
    }

    // Show where depth drops to 2 or less between init start and expected end
    if (depth <= 2 && lineNum > 3120 && lineNum < 22920) {
        const trimmed = line.trim().substring(0, 80);
        if (trimmed.length > 0) {
            console.log(`*** Line ${lineNum}: depth=${depth} | ${trimmed}`);
        }
    }
}

console.log(`\nFinal depth: ${depth}`);

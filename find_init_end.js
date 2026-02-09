const fs = require('fs');
const code = fs.readFileSync('rfq/static/rfq/rfq.js', 'utf8');

// Find where 'init: function (container) {' starts
const initMatch = code.indexOf('init: function (container) {');
if (initMatch === -1) { console.log('init not found'); process.exit(1); }

const initBodyStart = initMatch + 'init: function (container) {'.length;
console.log('init body starts at char offset:', initBodyStart);

// Now count braces to find the matching closing brace
let depth = 0;
let pos = initBodyStart;
let inSingleStr = false;
let inDoubleStr = false;
let inTemplate = 0;
let inBlockComment = false;
let escape = false;

while (pos < code.length) {
    const ch = code[pos];
    const next = pos < code.length - 1 ? code[pos + 1] : '';

    // Handle block comments
    if (inBlockComment) {
        if (ch === '*' && next === '/') {
            inBlockComment = false;
            pos += 2;
            continue;
        }
        pos++;
        continue;
    }

    // Handle single-quoted strings
    if (inSingleStr) {
        if (escape) { escape = false; pos++; continue; }
        if (ch === '\\') { escape = true; pos++; continue; }
        if (ch === "'") { inSingleStr = false; }
        pos++;
        continue;
    }

    // Handle double-quoted strings
    if (inDoubleStr) {
        if (escape) { escape = false; pos++; continue; }
        if (ch === '\\') { escape = true; pos++; continue; }
        if (ch === '"') { inDoubleStr = false; }
        pos++;
        continue;
    }

    // Handle template literals
    if (inTemplate > 0) {
        if (escape) { escape = false; pos++; continue; }
        if (ch === '\\') { escape = true; pos++; continue; }
        if (ch === '`') { inTemplate--; pos++; continue; }
        if (ch === '$' && next === '{') {
            // Expression inside template - count the opening brace
            depth++;
            pos += 2;
            continue;
        }
        pos++;
        continue;
    }

    // Not in any string/comment context
    // Check for comment starts
    if (ch === '/' && next === '/') {
        // Line comment - skip to end of line
        while (pos < code.length && code[pos] !== '\n') pos++;
        continue;
    }
    if (ch === '/' && next === '*') {
        inBlockComment = true;
        pos += 2;
        continue;
    }

    // Check for string/template starts
    if (ch === "'") { inSingleStr = true; pos++; continue; }
    if (ch === '"') { inDoubleStr = true; pos++; continue; }
    if (ch === '`') { inTemplate++; pos++; continue; }

    // Count braces
    if (ch === '{') {
        depth++;
    }
    if (ch === '}') {
        if (depth === 0) {
            // This closes the init function!
            const before = code.substring(0, pos);
            const lineNum = before.split('\n').length;
            console.log('init function closes at line:', lineNum);
            console.log('Context around closing brace:');
            const start = Math.max(0, pos - 100);
            const end = Math.min(code.length, pos + 50);
            console.log(code.substring(start, end));
            break;
        }
        depth--;
    }
    pos++;
}

if (pos >= code.length) {
    console.log('ERROR: Reached end of file without finding init closing brace!');
    console.log('Remaining depth:', depth);
}

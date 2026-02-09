// Minimal DOM mock to test rfq.js runtime
const fs = require('fs');

// Simple DOM element mock
class MockElement {
    constructor(tag, id, className) {
        this.tagName = tag || 'DIV';
        this.id = id || '';
        this.className = className || '';
        this.classList = {
            _classes: new Set((className || '').split(/\s+/).filter(Boolean)),
            add(...cls) { cls.forEach(c => this._classes.add(c)); },
            remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
            contains(c) { return this._classes.has(c); },
            toggle(c, force) { if (force === undefined) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); } else { if (force) this._classes.add(c); else this._classes.delete(c); } }
        };
        this.children = [];
        this.parentNode = null;
        this.style = {};
        this.dataset = {};
        this.innerHTML = '';
        this.textContent = '';
        this.value = '';
        this.type = '';
        this.checked = false;
        this._listeners = {};
        this._attrs = {};
    }
    setAttribute(k, v) { this._attrs[k] = v; }
    getAttribute(k) { return this._attrs[k] || null; }
    addEventListener(type, fn) { if (!this._listeners[type]) this._listeners[type] = []; this._listeners[type].push(fn); }
    removeEventListener() {}
    querySelector(sel) { return null; }
    querySelectorAll(sel) { return []; }
    closest(sel) { return null; }
    appendChild(el) { this.children.push(el); el.parentNode = this; return el; }
    insertBefore(el, ref) { this.children.push(el); el.parentNode = this; return el; }
    remove() {}
    click() {}
    focus() {}
    get offsetWidth() { return 100; }
    get offsetHeight() { return 30; }
    get offsetParent() { return this.parentNode; }
    getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 30, right: 100, bottom: 30 }; }
}

// Track all created elements by ID
const elementsById = {};
const elementsByClass = {};

function createElement(tag) {
    return new MockElement(tag);
}

// Read the HTML template from rfq.js to extract all element IDs
const code = fs.readFileSync('rfq/static/rfq/rfq.js', 'utf8');
const idMatches = code.matchAll(/id="([^"]+)"/g);
for (const m of idMatches) {
    const id = m[1];
    if (!elementsById[id]) {
        elementsById[id] = new MockElement('DIV', id);
    }
}

// Also create elements for class-based queries
const classMatches = code.matchAll(/class="([^"]+)"/g);
for (const m of classMatches) {
    m[1].split(/\s+/).forEach(cls => {
        if (!elementsByClass[cls]) elementsByClass[cls] = [];
        const el = new MockElement('DIV', '', cls);
        elementsByClass[cls].push(el);
    });
}

// Create root element
const rootEl = new MockElement('DIV', 'rfq-root');

// Mock document
global.document = {
    getElementById(id) { return elementsById[id] || null; },
    querySelector(sel) {
        if (sel.startsWith('#')) return elementsById[sel.slice(1)] || null;
        if (sel.startsWith('.')) {
            const cls = sel.slice(1).split('.')[0];
            return (elementsByClass[cls] || [])[0] || null;
        }
        return null;
    },
    querySelectorAll(sel) {
        if (sel.startsWith('.')) {
            const cls = sel.slice(1).split(/[.\s:[\]]/)[0];
            return elementsByClass[cls] || [];
        }
        return [];
    },
    createElement(tag) { return new MockElement(tag); },
    createTextNode(t) { return { textContent: t }; },
    addEventListener(type, fn) {},
    body: new MockElement('BODY')
};

// Mock window
global.window = global;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; },
    removeItem(k) { delete this._data[k]; },
    get length() { return Object.keys(this._data).length; },
    key(i) { return Object.keys(this._data)[i]; },
    clear() { this._data = {}; }
};
global.alert = (msg) => console.log('[ALERT]', msg);
global.confirm = () => true;
global.prompt = () => '';
global.setTimeout = (fn, ms) => { try { fn(); } catch(e) {} };
global.setInterval = () => 0;
global.clearInterval = () => {};
global.clearTimeout = () => {};
global.URL = { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} };
global.Blob = class { constructor() {} };
global.FileReader = class { readAsText() {} readAsDataURL() {} };
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };
global.HTMLElement = MockElement;
global.Node = { ELEMENT_NODE: 1 };
global.MutationObserver = class { observe() {} disconnect() {} };
global.IntersectionObserver = class { observe() {} disconnect() {} };
global.requestAnimationFrame = (fn) => fn();
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.Event = class { constructor(type) { this.type = type; } };
global.CustomEvent = class { constructor(type) { this.type = type; } };

// Set up RFQData mock
global.window.RFQData = {
    getProjects: () => [
        { id: '1', name: 'Test Project', items: [
            { item_drawing_no: 'TEST-001', description: 'Test Item', manufacturer: 'TestMfr', mpn: 'MPN001', status: 'New', qty_1: 10, suppliers: [
                { name: 'Supplier A', supplier_name: 'Supplier A', currency: 'EUR', prices: [{price: 10, qty: 10}], isMain: true }
            ]}
        ], suppliers: [], supplierMaster: [] }
    ],
    createProject: () => ({ id: Date.now(), name: 'New' }),
    updateProject: () => true,
    CURRENCY_RATES: { EUR: 1, USD: 0.92, CZK: 0.041, GBP: 1.17 },
    FIELDS: [],
    syncNow: () => {},
    getCurrencyDecimals: () => 4,
    saveRFQBatch: () => ({}),
    getRFQBatches: () => []
};

// Store projects in localStorage
localStorage.setItem('rfq_projects_v1', JSON.stringify(global.window.RFQData.getProjects()));
localStorage.setItem('rfq_active_project_id', '1');

console.log('=== Loading rfq.js ===');
try {
    // Load the module
    require('./rfq/static/rfq/rfq.js');
    console.log('Module loaded OK');
    console.log('SystemApps.rfq exists:', !!global.window.SystemApps?.rfq);
} catch (e) {
    console.error('LOAD ERROR:', e.message);
    console.error('Stack:', e.stack?.split('\n').slice(0, 5).join('\n'));
    process.exit(1);
}

// Test render
console.log('\n=== Testing render() ===');
try {
    const html = global.window.SystemApps.rfq.render();
    console.log('render() OK, length:', html.length);
} catch (e) {
    console.error('RENDER ERROR:', e.message);
}

// Test init
console.log('\n=== Testing init() ===');
try {
    global.window.SystemApps.rfq.init(rootEl);
    console.log('init() completed OK');
} catch (e) {
    console.error('INIT ERROR:', e.message);
    console.error('Stack:', e.stack?.split('\n').slice(0, 8).join('\n'));
}

// Test switchView to quoting
console.log('\n=== Testing switchView to quoting ===');
try {
    // The switchView should have been captured as a closure
    // Try triggering navQuoting click
    const navQuotingEl = elementsById['nav-quoting'];
    if (navQuotingEl && navQuotingEl._listeners.click) {
        navQuotingEl._listeners.click.forEach(fn => fn());
    } else if (navQuotingEl && navQuotingEl.onclick) {
        navQuotingEl.onclick();
    }
    console.log('switchView(quoting) OK');
} catch (e) {
    console.error('SWITCH TO QUOTING ERROR:', e.message);
    console.error('Stack:', e.stack?.split('\n').slice(0, 8).join('\n'));
}

// Test supplier detail
console.log('\n=== Testing openSupplierDetail ===');
try {
    if (typeof global.window.openSupplierDetail === 'function') {
        global.window.openSupplierDetail('Supplier A');
        console.log('openSupplierDetail OK');
    } else {
        console.log('openSupplierDetail not defined on window!');
    }
} catch (e) {
    console.error('SUPPLIER DETAIL ERROR:', e.message);
    console.error('Stack:', e.stack?.split('\n').slice(0, 8).join('\n'));
}

console.log('\n=== Done ===');

// Extended test - exercise specific broken features
const fs = require('fs');

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
        this.onclick = null;
    }
    setAttribute(k, v) { this._attrs[k] = v; }
    getAttribute(k) { return this._attrs[k] || null; }
    addEventListener(type, fn) { if (!this._listeners[type]) this._listeners[type] = []; this._listeners[type].push(fn); }
    removeEventListener() {}
    querySelector(sel) { return null; }
    querySelectorAll(sel) { return []; }
    closest(sel) { return null; }
    appendChild(el) { this.children.push(el); if (el && typeof el === 'object') el.parentNode = this; return el; }
    insertBefore(el, ref) { this.children.push(el); if (el && typeof el === 'object') el.parentNode = this; return el; }
    remove() {}
    click() {}
    focus() {}
    get offsetWidth() { return 100; }
    get offsetHeight() { return 30; }
    get offsetParent() { return this.parentNode; }
    getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 30, right: 100, bottom: 30 }; }
}

const elementsById = {};
const code = fs.readFileSync('rfq/static/rfq/rfq.js', 'utf8');
for (const m of code.matchAll(/id="([^"]+)"/g)) {
    if (!elementsById[m[1]]) elementsById[m[1]] = new MockElement('DIV', m[1]);
}

const rootEl = new MockElement('DIV', 'rfq-root');

global.document = {
    getElementById(id) { return elementsById[id] || null; },
    querySelector(sel) {
        if (sel.startsWith('#')) return elementsById[sel.slice(1)] || null;
        return null;
    },
    querySelectorAll(sel) { return []; },
    createElement(tag) { return new MockElement(tag); },
    createTextNode(t) { return { textContent: t }; },
    addEventListener(type, fn) {},
    body: new MockElement('BODY')
};

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
global.alert = () => {};
global.confirm = () => true;
global.prompt = () => '';
global.setTimeout = (fn) => { try { fn(); } catch(e) {} };
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

const testProject = {
    id: '1', name: 'Test Project',
    items: [
        { item_drawing_no: 'DWG-001', description: 'Test Part A', manufacturer: 'MfrA', mpn: 'MPN-A', status: 'New', qty_1: 10, qty_2: 50, qty_3: 100,
          suppliers: [
            { name: 'SupplierX', supplier_name: 'SupplierX', currency: 'EUR', prices: [{price: 5.50, qty: 10}], isMain: true, price_1: '5.50' },
            { name: 'SupplierY', supplier_name: 'SupplierY', currency: 'USD', prices: [{price: 6.20, qty: 10}], price_1: '6.20' }
          ]
        },
        { item_drawing_no: 'DWG-002', description: 'Test Part B', manufacturer: 'MfrB', mpn: 'MPN-B', status: 'RFQ Sent', qty_1: 5,
          suppliers: [
            { name: 'SupplierX', supplier_name: 'SupplierX', currency: 'EUR', prices: [{price: 12.00, qty: 5}], price_1: '12.00' }
          ]
        }
    ],
    suppliers: [{name: 'SupplierX'}, {name: 'SupplierY'}],
    supplierMaster: [{name: 'SupplierX'}, {name: 'SupplierY'}]
};

global.window.RFQData = {
    getProjects: () => [testProject],
    createProject: () => ({ id: Date.now(), name: 'New' }),
    updateProject: () => true,
    CURRENCY_RATES: { EUR: 1, USD: 0.92, CZK: 0.041, GBP: 1.17 },
    FIELDS: [],
    syncNow: () => {},
    getCurrencyDecimals: () => 4,
    saveRFQBatch: () => ({}),
    getRFQBatches: () => []
};

localStorage.setItem('rfq_projects_v1', JSON.stringify([testProject]));
localStorage.setItem('rfq_active_project_id', '1');

// Load and init
require('./rfq/static/rfq/rfq.js');
global.window.SystemApps.rfq.init(rootEl);

let errors = 0;

function testFn(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
    } catch (e) {
        errors++;
        console.error(`[FAIL] ${name}: ${e.message}`);
        console.error('  Stack:', e.stack?.split('\n').slice(1, 4).join('\n  '));
    }
}

// Test nav to quoting
testFn('switchView(quoting)', () => {
    const nav = elementsById['nav-quoting'];
    if (nav && nav.onclick) nav.onclick();
    else throw new Error('navQuoting.onclick not set');
});

// Test openSupplierDetail
testFn('openSupplierDetail(SupplierX)', () => {
    if (typeof global.window.openSupplierDetail !== 'function') throw new Error('openSupplierDetail not defined');
    global.window.openSupplierDetail('SupplierX');
});

// Test deleteCurrentSupplier exists
testFn('deleteCurrentSupplier defined', () => {
    if (typeof global.window.deleteCurrentSupplier !== 'function') throw new Error('deleteCurrentSupplier not defined');
});

// Test nav to items
testFn('switchView(items)', () => {
    const nav = elementsById['nav-items'];
    if (nav && nav.onclick) nav.onclick();
    else throw new Error('navItems.onclick not set');
});

// Test nav to supplier-list
testFn('switchView(supplier-list)', () => {
    const nav = elementsById['nav-supplier-list'];
    if (nav && nav.onclick) nav.onclick();
    else throw new Error('navSupplierList.onclick not set');
});

// Test nav to database
testFn('switchView(database)', () => {
    const nav = elementsById['nav-database'];
    if (nav && nav.onclick) nav.onclick();
    else throw new Error('navDatabase.onclick not set');
});

// Test nav to dashboard
testFn('switchView(dashboard)', () => {
    const nav = elementsById['nav-dashboard'];
    if (nav && nav.onclick) nav.onclick();
    else throw new Error('navDashboard.onclick not set');
});

console.log(`\n=== Results: ${errors === 0 ? 'ALL PASS' : errors + ' FAILED'} ===`);
process.exit(errors > 0 ? 1 : 0);

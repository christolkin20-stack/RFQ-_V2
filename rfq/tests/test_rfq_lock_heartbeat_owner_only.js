const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function makeLocalStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(String(k), String(v)); },
    removeItem: (k) => { map.delete(String(k)); },
    key: (i) => Array.from(map.keys())[i] || null,
    get length() { return map.size; },
  };
}

function makeWindow() {
  const listeners = new Map();
  return {
    __RFQ_AUTH_INVALID__: false,
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(cb);
    },
    dispatchEvent(ev) {
      const arr = listeners.get(ev.type) || [];
      arr.forEach((cb) => cb(ev));
      return true;
    },
  };
}

async function run() {
  const file = path.resolve(__dirname, '../static/rfq/rfq_data.js');
  const code = fs.readFileSync(file, 'utf8');

  const localStorage = makeLocalStorage({
    rfq_projects_v1: JSON.stringify([{ id: 'p1', name: 'P1', items: [] }]),
  });
  const window = makeWindow();

  const intervalCallbacks = [];
  const cleared = [];

  const fetch = async (url, opts = {}) => {
    if (url === '/api/locks/acquire' && opts.method === 'POST') {
      return { ok: true, json: async () => ({ ok: true, acquired: true }) };
    }
    if (url === '/api/locks/heartbeat' && opts.method === 'POST') {
      return { ok: false, status: 409, text: async () => 'lost lock' };
    }
    if (url === '/api/projects' && (!opts.method || opts.method === 'GET')) {
      return { ok: true, json: async () => ({ projects: [] }) };
    }
    if (url === '/api/projects/bulk' && opts.method === 'POST') {
      return { ok: true, json: async () => ({ ok: true }) };
    }
    return { ok: false, status: 404, text: async () => 'not found' };
  };

  const context = {
    window,
    localStorage,
    document: { cookie: '' },
    fetch,
    console,
    setTimeout,
    clearTimeout,
    setInterval: (cb) => {
      intervalCallbacks.push(cb);
      return intervalCallbacks.length;
    },
    clearInterval: (id) => { cleared.push(id); },
    Date,
    Math,
    JSON,
    CustomEvent: function(type, init) { this.type = type; this.detail = (init && init.detail) || {}; },
  };

  vm.createContext(context);
  vm.runInContext(code, context);
  await new Promise((r) => setTimeout(r, 20));

  const ok = await window.RFQData.ensureProjectLock('p1');
  assert.strictEqual(ok, true, 'lock acquisition should succeed');
  const countAfterAcquire = intervalCallbacks.length;
  assert.ok(countAfterAcquire >= 1, 'heartbeat timer must be created');

  const lockHeartbeatCallback = intervalCallbacks[countAfterAcquire - 1];
  await lockHeartbeatCallback();
  assert.ok(cleared.includes(countAfterAcquire), 'heartbeat timer must be cleared when heartbeat fails (owner lost)');

  console.log('PASS test_rfq_lock_heartbeat_owner_only');
}

run().catch((err) => {
  console.error('FAIL test_rfq_lock_heartbeat_owner_only', err);
  process.exit(1);
});

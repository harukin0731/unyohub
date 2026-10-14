// Run: node tests/pwa-update.cjs /path/to/rendered-service-worker.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const swSource = fs.readFileSync(process.argv[2], 'utf8');
const origin = 'https://example.test';
const version = swSource.match(/postMessage\("([^"]+)"\)/)[1];
const currentHtml = `const UNYOHUB_VERSION = "${version}";`;
const key = input => new URL(typeof input === 'string' ? input : input.url, origin).href;

async function testServiceWorker () {
    const stores = new Map([['unyohub_vold', new Map([[origin + '/', new Response('old')]])], ['other-app', new Map()]]);
    const network = {offline: false, html: 'wrong', status: 200};
    let claimed = false, skipped = false;
    const listeners = {};
    const caches = {
        async open(name) {
            if (!stores.has(name)) stores.set(name, new Map());
            return {
                async put(url, response) { stores.get(name).set(key(url), response.clone()); },
                async match(url) { return stores.get(name).get(key(url))?.clone(); }
            };
        },
        async keys() { return [...stores.keys()]; },
        async delete(name) { return stores.delete(name); }
    };
    vm.runInNewContext(swSource, {
        URL, caches,
        self: {location: {origin}, clients: {async claim() { claimed = true; }},
               async skipWaiting() { skipped = true; }, addEventListener(name, handler) { listeners[name] = handler; }},
        async fetch(input, init) {
            if (network.offline) throw new Error('offline');
            if (typeof input === 'string') assert.equal(init?.cache, 'no-store');
            return new Response(new URL(key(input)).pathname === '/' ? network.html : 'asset', {status: network.status});
        }
    });
    async function event(type, fields = {}) {
        let promise;
        listeners[type]({...fields, waitUntil(p) { promise = p; }, respondWith(p) { promise = p; }});
        return await promise;
    }
    const navigate = path => event('fetch', {request: {url: origin + path, method: 'GET', mode: 'navigate'}});

    await assert.rejects(event('install'), /release does not match/);
    assert(stores.has('unyohub_vold') && stores.size === 2, 'failed install must not create a cache');
    network.html = currentHtml;
    await event('install');

    assert.equal(await (await navigate('/')).text(), currentHtml);
    network.status = 500;
    assert.equal((await navigate('/user/')).status, 500, 'server errors are passed through, not replaced by cached HTML');
    network.status = 200;
    network.offline = true;
    assert.equal(await (await navigate('/railroad_example/')).text(), currentHtml);

    await event('message', {data: {type: 'SKIP_WAITING'}});
    assert(skipped);
    await event('activate');
    assert(claimed && !stores.has('unyohub_vold') && stores.has('other-app'));
    assert.equal(await event('fetch', {request: {method: 'POST', url: origin + '/'}}), undefined);
}

async function testUpdateButton () {
    const helpers = fs.readFileSync('unyohub/on_demand_funcs.js', 'utf8');
    const snippet = helpers.slice(helpers.indexOf('function with_timeout ('), helpers.indexOf('function show_welcome_message ('));
    let reloads = 0, closed = 0;
    const container = new EventTarget();
    const pending = new EventTarget();
    pending.state = 'installed';
    const registration = {waiting: pending, installing: null, active: {}, async update() {}};
    pending.postMessage = (message, ports) => {
        if (message.type === 'SKIP_WAITING') queueMicrotask(() => {
            registration.active = container.controller = pending;
            registration.waiting = null;
            pending.state = 'activated';
            container.dispatchEvent(new Event('controllerchange'));
        });
        else ports[0].postMessage(version);
    };
    container.controller = registration.active;
    container.getRegistration = async () => registration;
    const context = {
        navigator: {onLine: true, serviceWorker: container}, MessageChannel,
        instance_info: {unyohub_version: version}, console: {error() {}},
        setTimeout, clearTimeout,
        history: {pushState(_, __, url) { assert.equal(container.controller, pending); assert.equal(url, '/'); }},
        location: {pathname: '/', reload() { reloads++; }},
        open_wait_screen() {}, close_wait_screen() { closed++; }, mes() {}
    };
    vm.createContext(context);
    vm.runInContext(snippet, context);

    await context.reload_app(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    assert.equal(reloads, 1);

    context.app_update_in_progress = false;
    registration.waiting = pending;
    pending.state = 'redundant';
    await context.reload_app(true);
    assert.equal(reloads, 1);
    assert.equal(closed, 1);
}

async function testLegacyTsMigration () {
    const main = fs.readFileSync('unyohub/main.js', 'utf8');
    const migration = main.slice(main.lastIndexOf('if ("serviceWorker" in navigator)'));
    let migrated = 0, cleaned = '';
    vm.runInNewContext(migration, {
        navigator: {serviceWorker: {async register() {}}},
        location: {search: '?ts=123', pathname: '/', hash: ''},
        URLSearchParams, funcs_load_promise: Promise.resolve(),
        async complete_app_update() { migrated++; },
        history: {replaceState(_, __, url) { cleaned = url; }}, console
    });
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(migrated, 1);
    assert.equal(cleaned, '/');
}

(async () => {
    await testServiceWorker();
    await testUpdateButton();
    await testLegacyTsMigration();
    console.log('PASS: mismatched install rejected, no old-cache fallback, errors passed through, offline navigation, scoped cleanup, activation before reload, failed update does not reload, legacy ?ts migration');
})().catch(error => { console.error(error); process.exitCode = 1; });

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

// Fake page with an active worker that answers GET_VERSION with activeVersion
// (undefined = 26.09-1 worker without a message handler) and a waiting worker of the current release.
function updateEnv ({activeVersion, pageVersion = version, instanceVersion = version}) {
    const helpers = fs.readFileSync('unyohub/on_demand_funcs.js', 'utf8');
    const snippet = helpers.slice(helpers.indexOf('function with_timeout ('), helpers.indexOf('function show_welcome_message ('));
    const container = new EventTarget();
    const worker = (state, workerVersion) => Object.assign(new EventTarget(), {state, postMessage(message, ports) {
        if (message.type === 'GET_VERSION' && workerVersion !== undefined) ports[0].postMessage(workerVersion);
    }});
    const active = worker('activated', activeVersion);
    const pending = worker('installed', version);
    const registration = {waiting: pending, installing: null, active, async update() { env.updates++; }};
    const basePostMessage = pending.postMessage;
    pending.postMessage = (message, ports) => {
        if (message.type !== 'SKIP_WAITING') return basePostMessage(message, ports);
        queueMicrotask(() => {
            registration.active = container.controller = pending;
            registration.waiting = null;
            pending.state = 'activated';
            container.dispatchEvent(new Event('controllerchange'));
        });
    };
    container.controller = active;
    container.getRegistration = async () => registration;
    const env = {updates: 0, reloads: 0, closed: 0, container, pending, registration};
    env.context = {
        navigator: {onLine: true, serviceWorker: container}, MessageChannel,
        UNYOHUB_VERSION: pageVersion, instance_info: {unyohub_version: instanceVersion}, console: {error() {}},
        setTimeout, clearTimeout,
        history: {pushState(_, __, url) { assert.equal(container.controller, pending); assert.equal(url, '/'); }},
        location: {pathname: '/', reload() { env.reloads++; }},
        open_wait_screen() {}, close_wait_screen() { env.closed++; }, mes() {}
    };
    vm.createContext(env.context);
    vm.runInContext(snippet, env.context);
    return env;
}

async function testUpdateButton () {
    const env = updateEnv({activeVersion: 'old', pageVersion: 'old'});
    await env.context.reload_app(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    assert.equal(env.reloads, 1);

    env.context.app_update_in_progress = false;
    env.registration.waiting = env.pending;
    env.pending.state = 'redundant';
    await env.context.reload_app(true);
    assert.equal(env.reloads, 1, 'failed update must not reload');
    assert.equal(env.closed, 1);
}

async function testLoadSync () {
    // New HTML while the old worker still controls the page; stale localStorage instance_info must not matter.
    let env = updateEnv({activeVersion: 'old', instanceVersion: 'old'});
    await env.context.sync_app_worker();
    assert.equal(env.container.controller, env.pending, 'old worker is replaced on load');

    // 26.09-1 worker does not answer GET_VERSION.
    env = updateEnv({activeVersion: undefined});
    await env.context.sync_app_worker();
    assert.equal(env.container.controller, env.pending, 'legacy worker is replaced on load');

    // Worker already matches the page: no update check.
    env = updateEnv({activeVersion: version});
    await env.context.sync_app_worker();
    assert.equal(env.updates, 0);
    assert.notEqual(env.container.controller, env.pending);
}

async function testMainRegistration () {
    const main = fs.readFileSync('unyohub/main.js', 'utf8');
    const registration = main.slice(main.lastIndexOf('if ("serviceWorker" in navigator)'));
    let synced = 0, cleaned = '', loadFuncs;
    // Registration finishes before on_demand_funcs.js defines sync_app_worker.
    const context = {
        navigator: {serviceWorker: {async register() {}}},
        location: {search: '?ts=123', pathname: '/', hash: ''},
        URLSearchParams, funcs_load_promise: new Promise(resolve => { loadFuncs = resolve; }),
        history: {replaceState(_, __, url) { cleaned = url; }}, console
    };
    vm.runInNewContext(registration, context);
    assert.equal(cleaned, '/');
    await new Promise(resolve => setTimeout(resolve, 10));
    context.sync_app_worker = async () => { synced++; };
    loadFuncs();
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(synced, 1);
}

(async () => {
    await testServiceWorker();
    await testUpdateButton();
    await testLoadSync();
    await testMainRegistration();
    console.log('PASS: mismatched install rejected, no old-cache fallback, errors passed through, offline navigation, scoped cleanup, activation before reload, failed update does not reload, worker synced to page release on load');
})().catch(error => { console.error(error); process.exitCode = 1; });

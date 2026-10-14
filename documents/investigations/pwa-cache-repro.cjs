// Response-routing simulation, not an iOS browser/lifecycle test.
const source = require('node:fs').readFileSync(process.argv[2], 'utf8');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const stores = new Map();
let networkVersion = 'old';
const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name,new Map());
    return {async addAll(urls) {const store=stores.get(name); for(const url of urls) store.set(url,networkVersion);}};
  },
  async match(request) {
    for(const store of stores.values()) if(store.has(request.url)) return store.get(request.url);
  },
  async keys(){return [...stores.keys()];},
  async delete(name){return stores.delete(name);}
};
function worker(code) {
  const events={};
  vm.runInNewContext(code,{self:{addEventListener:(name,fn)=>events[name]=fn},caches,fetch:async()=>networkVersion});
  return {
    async event(name) {let promise;events[name]({waitUntil:p=>promise=p});await promise;},
    async fetch(url){let promise;events.fetch({request:{url},respondWith:p=>promise=p});return await promise;}
  };
}
(async()=>{
  const old = worker(source.replace(/var new_cache_name = "[^"]+";/, 'var new_cache_name = "unyohub_old_test_cache";'));
  await old.event('install'); await old.event('activate');
  networkVersion='new';
  const updated = worker(source);
  await updated.event('install'); // New worker is waiting; old controller still owns page.
  const updatedPage=await old.fetch('/?ts=123456');
  const reopenedPage=await old.fetch('/');
  assert.equal(updatedPage,'new'); assert.equal(reopenedPage,'old');
  console.log('Reproduced response path: update /?ts=... -> '+updatedPage+', subsequent / -> '+reopenedPage);
  assert.equal(await updated.fetch('/'),'old');
  console.log('Even new fetch handler matches old cache while both caches coexist.');
  await updated.event('activate');
  assert.equal(await updated.fetch('/'),'new');
  console.log('After activation removes old cache: / -> new.');
})().catch(e=>{console.error(e);process.exitCode=1;});

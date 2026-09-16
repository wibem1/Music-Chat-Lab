const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const allowed=new Set(['provider-gateway.js']);
const legacyAllowed=new Set(['request-control.js','api-usage.js','session-orchestrator.js','execution-mode.js','session-output-guard.js','composition-state.js']);
const js=fs.readdirSync(root).filter(x=>x.endsWith('.js'));
const offenders=[];
for(const name of js){
  const s=fs.readFileSync(path.join(root,name),'utf8');
  const patchesFetch=/window\.fetch\s*=/.test(s);
  const patchesXhr=/XMLHttpRequest\.prototype\.(?:send|open)\s*=/.test(s);
  if((patchesFetch||patchesXhr)&&!allowed.has(name)&&!legacyAllowed.has(name))offenders.push(name);
}
assert.deepEqual(offenders,[],`Neue globale Transport-Patches gefunden: ${offenders.join(', ')}`);
console.log('REQUEST_ARCHITECTURE_GUARD_OK');
console.log('LEGACY_TRANSPORT_WRAPPERS_TO_REMOVE='+[...legacyAllowed].filter(name=>fs.existsSync(path.join(root,name))&&(/window\.fetch\s*=|XMLHttpRequest\.prototype\.(?:send|open)\s*=/).test(fs.readFileSync(path.join(root,name),'utf8'))).join(','));

const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const expected=['api-usage.js','composition-state.js','execution-mode.js','request-control.js','session-orchestrator.js','session-output-guard.js'].sort();
const actual=fs.readdirSync(root).filter(n=>n.endsWith('.js')).filter(n=>{const s=fs.readFileSync(path.join(root,n),'utf8');return /window\.fetch\s*=|XMLHttpRequest\.prototype\.(?:send|open)\s*=/.test(s)}).sort();
assert.deepEqual(actual,expected,`Transport-Patch-Inventar hat sich unerwartet verändert: ${actual.join(', ')}`);
console.log('TRANSPORT_PATCH_INVENTORY_LOCKED='+actual.join(','));

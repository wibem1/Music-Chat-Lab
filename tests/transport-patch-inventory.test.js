const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const actual=fs.readdirSync(root).filter(n=>n.endsWith('.js')).filter(n=>{const s=fs.readFileSync(path.join(root,n),'utf8');return /window\.fetch\s*=|XMLHttpRequest\.prototype\.(?:send|open)\s*=/.test(s)}).sort();
assert.deepEqual(actual,[],`Globale Transport-Patches sind nicht mehr zulässig: ${actual.join(', ')}`);
console.log('TRANSPORT_PATCH_INVENTORY_ZERO');
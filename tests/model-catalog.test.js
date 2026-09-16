const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','model-catalog.js'),'utf8'),sandbox);
const c=sandbox.window.MCLModelCatalog;assert(c);
assert(c.get('openai','gpt-5.6-sol'));assert(c.get('openai','gpt-6-astra'));assert(c.get('anthropic','claude-fable-5'));assert.equal(c.get('anthropic','claude-fable-5-1'),null);
const a=c.list('anthropic');a[0].label='mutated';assert.notEqual(c.list('anthropic')[0].label,'mutated');
console.log('MODEL_CATALOG_OK');

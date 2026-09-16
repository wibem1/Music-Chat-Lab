const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','provider-policy.js'),'utf8'),sandbox);
const p=sandbox.window.MCLProviderPolicy;
let x=p.forRequest('anthropic','claude-fable-5-1',{mode:'chat'});assert.equal(x.technical.thinking.type,'adaptive');assert.equal(x.technical.outputConfig.effort,'medium');
x=p.forRequest('anthropic','claude-fable-5-1',{mode:'compose'});assert.equal(x.technical.thinking.type,'adaptive');assert.equal(x.technical.outputConfig.effort,'low');assert.equal(x.maxOutputTokens,16000);
x=p.forRequest('anthropic','claude-sonnet-4-6',{mode:'chat'});assert.equal(x.technical.thinking,undefined);
x=p.forRequest('google','gemini-test',{mode:'compose'});assert.equal(x.maxOutputTokens,32768);
console.log('PROVIDER_POLICY_OK');

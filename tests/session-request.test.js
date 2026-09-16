const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','session-request.js'),'utf8'),sandbox);
const s=sandbox.window.MCLSessionRequest;
const req=s.build({provider:'anthropic',model:'x',mode:'compose',idea:'Leise',messages:[{role:'user',text:'Mach'},{role:'tool',text:'ignore'}]});assert.equal(req.mode,'compose');assert.equal(req.idea,'Leise');assert.equal(req.messages.length,1);
let p=s.parseMachineBlocks('Antwort\n<MCL_MEMORY>Gedächtnis</MCL_MEMORY>\n<MCL_CONCEPT>Idee</MCL_CONCEPT>');assert.equal(p.visible,'Antwort');assert.equal(p.memory,'Gedächtnis');assert.equal(p.concept,'Idee');
p=s.parseMachineBlocks('ok\n<MCL_ACTION>{"type":"new_score"}</MCL_ACTION>');assert.equal(p.action.type,'new_score');assert.equal(p.visible,'ok');
p=s.parseMachineBlocks('<MCL_NEED>{"slots":[1,3]}</MCL_NEED>');assert.deepEqual(Array.from(p.need.slots),[1,3]);assert.equal(p.visible,'');
console.log('SESSION_REQUEST_CONTRACT_OK');
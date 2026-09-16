const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const sandbox={window:{},document:{getElementById:()=>null},AbortController,console};sandbox.window.window=sandbox.window;
sandbox.window.MCLSessionRequest={build:x=>x,parseMachineBlocks:text=>({visible:text,action:null,need:null,memory:'',concept:''})};
sandbox.window.MCLProviderPolicy={forRequest:()=>({maxOutputTokens:123,technical:{}})};
let seen=null;sandbox.window.MCLProviderGateway={request:async x=>{seen=x;return{provider:x.provider,model:x.model,text:'Antwort',usage:{input:2,output:3}}}};
let usage=null;sandbox.window.MCLProviderUsage={record:x=>usage=x};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','request-runtime.js'),'utf8'),sandbox);
(async()=>{const r=await sandbox.window.MCLRequestRuntime.run({provider:'anthropic',model:'m',mode:'chat',apiKey:'k',messages:[{role:'user',text:'x'}],turnId:'t'});assert.equal(seen.maxOutputTokens,123);assert.equal(seen.apiKey,'k');assert.equal(r.visible,'Antwort');assert.equal(usage.input,undefined);assert.equal(usage.usage.input,2);assert.equal(sandbox.window.MCLRequestRuntime.active,false);console.log('REQUEST_RUNTIME_OK')})().catch(e=>{console.error(e);process.exit(1)});

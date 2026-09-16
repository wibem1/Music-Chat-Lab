(()=>{
'use strict';
if(window.MCLRequestRuntime)return;
let activeController=null;
function abort(reason='Laufende Anfrage abgebrochen.'){
  if(activeController){try{activeController.abort()}catch{}activeController=null}
  const note=document.getElementById('composerNote');if(note)note.textContent=reason;
}
async function run(spec){
  if(!window.MCLSessionRequest||!window.MCLProviderPolicy||!window.MCLProviderGateway)throw new Error('Request-Runtime ist nicht vollständig geladen.');
  abort('');
  const controller=new AbortController();activeController=controller;
  const policy=window.MCLProviderPolicy.forRequest(spec.provider,spec.model,{mode:spec.mode});
  const req=window.MCLSessionRequest.build({...spec,...policy});
  try{
    const result=await window.MCLProviderGateway.request({...req,apiKey:spec.apiKey,signal:controller.signal});
    const parsed=window.MCLSessionRequest.parseMachineBlocks(result.text);
    window.MCLProviderUsage?.record?.({provider:result.provider,model:result.model,usage:result.usage,turnId:spec.turnId||null});
    return{...result,...parsed};
  }finally{if(activeController===controller)activeController=null}
}
window.MCLRequestRuntime={version:'0.1.0',run,abort,get active(){return!!activeController}};
})();

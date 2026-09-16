(()=>{
'use strict';
if(window.MCLProviderPolicy)return;

function anthropic(model,{mode='chat'}={}){
  const id=String(model||'').toLowerCase();
  const compose=mode==='compose';
  if(id.includes('fable-5'))return{maxOutputTokens:compose?16000:12000,technical:{thinking:{type:'adaptive'},outputConfig:{effort:compose?'low':'medium'}}};
  if(id.includes('sonnet-5')||id.includes('opus-5'))return{maxOutputTokens:compose?16000:12000,technical:{thinking:{type:'adaptive'},outputConfig:{effort:compose?'low':'medium'}}};
  // Claude 4.6-class models can leave thinking omitted when it is not requested.
  return{maxOutputTokens:compose?16000:12000,technical:{}};
}
function openai(_model,{mode='chat'}={}){return{maxOutputTokens:mode==='compose'?16000:undefined,technical:{}}}
function google(_model,{mode='chat'}={}){return{maxOutputTokens:mode==='compose'?32768:12000,technical:{}}}
function forRequest(provider,model,options={}){
  if(provider==='anthropic')return anthropic(model,options);
  if(provider==='openai')return openai(model,options);
  if(provider==='google')return google(model,options);
  return{technical:{}};
}
window.MCLProviderPolicy={version:'0.1.0',forRequest};
})();

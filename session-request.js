(()=>{
'use strict';
if(window.MCLSessionRequest)return;

const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
const ACTION_RE=/<MCL_ACTION>\s*([\s\S]*?)\s*<\/MCL_ACTION>/i;
const NEED_RE=/<MCL_NEED>\s*([\s\S]*?)\s*<\/MCL_NEED>/i;
const MEMORY_RE=/<MCL_MEMORY>\s*([\s\S]*?)\s*<\/MCL_MEMORY>/i;
const CONCEPT_RE=/<MCL_CONCEPT>\s*([\s\S]*?)\s*<\/MCL_CONCEPT>/i;

function build({provider,model,messages,system='',mode='chat',idea='',maxOutputTokens,technical}={}){
  if(!provider)throw new Error('Provider fehlt.');
  if(!model)throw new Error('Modell fehlt.');
  const cleanMessages=(Array.isArray(messages)?messages:[]).filter(m=>m&&(m.role==='user'||m.role==='assistant')).map(m=>({role:m.role,text:String(m.text||'')}));
  return{provider,model,messages:cleanMessages,system:String(system||''),mode:mode==='compose'?'compose':'chat',idea:String(idea||'').trim(),maxOutputTokens:Number(maxOutputTokens)||undefined,technical:clone(technical)||{}};
}
function parseMachineBlocks(text){
  const raw=String(text||'');
  const parse=re=>{const m=raw.match(re);if(!m)return null;try{return JSON.parse(m[1])}catch{return{invalid:true,raw:m[1]}}};
  const memory=raw.match(MEMORY_RE)?.[1]?.trim()||'';
  const concept=raw.match(CONCEPT_RE)?.[1]?.trim()||'';
  const visible=raw.replace(MEMORY_RE,'').replace(CONCEPT_RE,'').replace(/\n{3,}/g,'\n\n').trim();
  return{visible,action:parse(ACTION_RE),need:parse(NEED_RE),memory,concept};
}
window.MCLSessionRequest={version:'0.1.0',build,parseMachineBlocks};
})();

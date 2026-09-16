(()=>{
'use strict';
if(window.MCLProviderUsage)return;
const KEY='music-chat-lab.api-usage.v2';
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&Array.isArray(x.calls)?x:{calls:[]}}catch{return{calls:[]}}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}}
function record({provider='',model='',usage={},turnId=null}={}){
  const u=usage||{};if(!(u.input||u.output||u.cached||u.cacheWrite||u.reasoning))return null;
  const rec={id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,time:Date.now(),provider,model,input:Number(u.input)||0,cached:Number(u.cached)||0,cacheWrite:Number(u.cacheWrite)||0,output:Number(u.output)||0,reasoning:Number(u.reasoning)||0,turnId};
  const data=load();data.calls.push(rec);if(data.calls.length>2000)data.calls=data.calls.slice(-2000);save(data);
  window.dispatchEvent(new CustomEvent('mcl-usage-updated',{detail:rec}));return rec;
}
window.MCLProviderUsage={version:'0.1.0',load,record};
})();

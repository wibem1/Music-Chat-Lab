(()=>{
'use strict';
let active=null;
function actionFor(text){const s=String(text||'').toLowerCase();if(/\b(analys|analyse|untersuch|beurteil|bewert)/.test(s))return'Analyse';if(/\b(synthese|synthetis|verbind|kombinier|verschmelz)/.test(s))return'Synthese';if(/\b(kompon|komposition|erzeug|schreib.*stück|variation|variier|fortsetz|verlänger)/.test(s))return'Komposition';return'Chat'}
window.MCLUsageClassifyAction=actionFor;
window.MCLUsageStartTurn=function(meta={}){active={id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,provider:meta.provider||'',model:meta.model||'',action:meta.action||actionFor(meta.text),calls:[]};return active.id};
window.MCLUsageRecord=function(rec){if(!rec)return null;const tid=rec.turnId||active?.id||null;const saved=window.MCLProviderUsage?.record?.({...rec,turnId:tid})||null;if(saved&&active&&active.id===tid)active.calls.push(saved);return saved};
window.MCLUsageFinishTurn=function(){if(!active)return null;const a=active;active=null;return{id:a.id,provider:a.provider,model:a.model,action:a.action||'Chat',calls:a.calls.length,input:a.calls.reduce((n,x)=>n+(x.input||0),0),cached:a.calls.reduce((n,x)=>n+(x.cached||0),0),cacheWrite:a.calls.reduce((n,x)=>n+(x.cacheWrite||0),0),output:a.calls.reduce((n,x)=>n+(x.output||0),0),reasoning:a.calls.reduce((n,x)=>n+(x.reasoning||0),0)}};
window.MCLUsageData=()=>window.MCLProviderUsage?.load?.()||{calls:[]};
window.MCLUsageActiveTurn=()=>active?.id||null;
})();
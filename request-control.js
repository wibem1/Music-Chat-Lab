(()=>{
'use strict';
function abortRunning(reason='Laufende Anfrage abgebrochen.'){
  if(window.MCLRequestRuntime?.abort)return window.MCLRequestRuntime.abort(reason);
  const note=document.getElementById('composerNote');if(note)note.textContent=reason;
}
window.MCLAbortRunningRequest=abortRunning;
window.addEventListener('DOMContentLoaded',()=>{
  const provider=document.getElementById('providerSelect'),model=document.getElementById('modelSelect');
  provider?.addEventListener('change',()=>abortRunning('Laufende Anfrage wurde beim Anbieterwechsel abgebrochen.'),{capture:true});
  model?.addEventListener('change',()=>abortRunning('Laufende Anfrage wurde beim Modellwechsel abgebrochen.'),{capture:true});
});
})();
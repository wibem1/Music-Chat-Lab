(()=>{
'use strict';
if(window.__mclRuntimeCompat)return;
window.__mclRuntimeCompat=true;

function fmt(sec){
  sec=Math.max(0,Math.floor(sec||0));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

function maxBeat(score){
  let max=0;
  (score?.tr||[]).forEach(t=>(t.nt||[]).forEach(n=>{
    if(!Array.isArray(n))return;
    const start=Number(n[0])||0;
    const dur=Number(n[1])||0;
    const gate=n.length>5?(Number(n[5])||.95):.95;
    max=Math.max(max,start+dur*Math.max(.05,gate));
  }));
  return max;
}

function installStopReset(){
  const stop=document.getElementById('mainMidiStop');
  if(!stop||stop.dataset.mclResetInstalled==='1')return;
  stop.dataset.mclResetInstalled='1';
  stop.addEventListener('click',()=>{
    const seek=document.getElementById('mainMidiSeek');
    const time=document.getElementById('mainMidiTime');
    const status=document.getElementById('mainMidiStatus');
    if(seek)seek.value='0';
    const active=document.querySelector('.mcl-midi-slot.active');
    const slot=active?Number(active.dataset.slot)+1:0;
    const item=slot?window.MCLMidiSlots?.get?.([slot])?.[0]:null;
    if(time){
      const bpm=Math.max(20,Math.min(300,Number(item?.score?.bpm)||96));
      time.textContent=`0:00 / ${fmt(maxBeat(item?.score)*60/bpm)}`;
    }
    if(status)status.textContent='Gestoppt · Anfang.';
  });
}

function installStableSlotRestore(){
  const api=window.MCLMidiSlots;
  if(!api?.restoreState||api.__stableRestoreInstalled)return;
  const original=api.restoreState.bind(api);
  api.restoreState=function(items,active=0){
    const safe=(Array.isArray(items)?items:[]).map(x=>({
      slot:x.slot,
      name:x.name,
      kind:x.kind==='Import'?'Gespeichert':x.kind,
      score:x.score
    }));
    original(safe,active);
    window.MCLMidiMemoryRestoring=true;
    setTimeout(()=>{window.MCLMidiMemoryRestoring=false},0);
  };
  api.__stableRestoreInstalled=true;
}

function removeLegacyClabConceptUi(){
  document.getElementById('clabConceptBtn')?.remove();
  document.getElementById('clabConceptPanel')?.remove();
}

function install(){
  installStopReset();
  installStableSlotRestore();
  removeLegacyClabConceptUi();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();

window.MCLRuntimeCompat={version:'1.0.0'};
})();

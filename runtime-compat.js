(()=>{
'use strict';
if(window.__mclRuntimeCompat)return;
window.__mclRuntimeCompat=true;

const CHAT_KEY='music-chat-lab.chats.v1';
const ACTIVE_KEY='music-chat-lab.active-chat.v1';

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

function parseScore(text){
  let s=String(text||'').trim();
  const fenced=s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if(fenced)s=fenced[1].trim();
  const a=s.indexOf('{'),b=s.lastIndexOf('}');
  if(a<0||b<=a)return null;
  try{
    const x=JSON.parse(s.slice(a,b+1));
    return x&&Array.isArray(x.tr)&&x.tr.some(t=>Array.isArray(t.nt))?x:null;
  }catch{return null;}
}

function currentChat(){
  try{
    const chats=JSON.parse(localStorage.getItem(CHAT_KEY)||'[]');
    const id=localStorage.getItem(ACTIVE_KEY);
    return chats.find(c=>c?.id===id)||chats[0]||null;
  }catch{return null;}
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

function installClabAssignmentFix(){
  const api=window.MCLCLAB;
  if(!api?.makeDocument||api.__assignmentFixInstalled)return;
  const originalMake=api.makeDocument.bind(api);
  const cleanUser=m=>String(m?.displayText||m?.text||'').replace(/\[MCL-(?:ENGINE14-SCORE|CLAB-SCORE)[\s\S]*$/i,'').trim();
  const isConfirmation=s=>/^(ja|j|ok|okay|mach das|mache das|bitte|los|ausführen|ausfuehren|genau|einverstanden)[.!?]*$/i.test(String(s||'').trim());
  const sameScore=(a,b)=>{try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}};
  function assignmentFor(score){
    const loaded=api.getLoadedDocument?.();
    if(loaded?.score&&sameScore(loaded.score,score)&&String(loaded.assignment||'').trim())return String(loaded.assignment).trim();
    const messages=currentChat()?.messages||[];
    let scoreIndex=-1;
    for(let i=messages.length-1;i>=0;i--){
      const m=messages[i];
      if(m?.role!=='assistant'||m?.isError||m?.thinking)continue;
      const s=parseScore(m.text);
      if(s&&sameScore(s,score)){scoreIndex=i;break;}
    }
    if(scoreIndex<0){
      for(let i=messages.length-1;i>=0;i--){
        const m=messages[i];
        if(m?.role==='assistant'&&parseScore(m.text)){scoreIndex=i;break;}
      }
    }
    if(scoreIndex<0)return'';
    let proposalIndex=-1;
    for(let i=scoreIndex-1;i>=0;i--){
      const m=messages[i];
      if(m?.role==='assistant'&&/\[MCL-(?:OPENAI-)?VORSCHLAG:[a-z0-9]+\]/i.test(String(m.text||''))){proposalIndex=i;break;}
    }
    const start=proposalIndex>=0?proposalIndex-1:scoreIndex-1;
    for(let i=start;i>=0;i--){
      const m=messages[i];
      if(m?.role!=='user'||m?.isError||m?.thinking)continue;
      const s=cleanUser(m);
      if(s&&!isConfirmation(s))return s;
    }
    return'';
  }
  api.makeDocument=function(){
    const doc=originalMake();
    const assignment=assignmentFor(doc?.score);
    if(assignment)doc.assignment=assignment;
    return doc;
  };
  api.__assignmentFixInstalled=true;
}

function installConceptDisplay(){
  if(window.__mclConceptDisplayInstalled)return;
  window.__mclConceptDisplayInstalled=true;
  let applying=false;
  function refresh(){
    if(applying)return;
    applying=true;
    try{
      const msgs=currentChat()?.messages||[];
      const rows=[...document.querySelectorAll('#messages .message-row')];
      rows.forEach((row,i)=>{
        const m=msgs[i];
        if(!m||m.role!=='assistant'||m.isError||m.thinking)return;
        const score=parseScore(m.text);
        if(!score)return;
        const bubble=row.querySelector('.message-bubble');
        if(!bubble)return;
        const title=String(score.ti||'Neue Komposition').trim()||'Neue Komposition';
        const next=`Komposition erzeugt: ${title}`;
        if(bubble.textContent!==next)bubble.textContent=next;
      });
    }finally{applying=false;}
  }
  const messages=document.getElementById('messages');
  if(messages)new MutationObserver(()=>queueMicrotask(refresh)).observe(messages,{childList:true,subtree:true});
  setTimeout(refresh,0);
  window.MCLConceptDisplay={refresh};
}

function install(){
  installStopReset();
  installStableSlotRestore();
  removeLegacyClabConceptUi();
  installClabAssignmentFix();
  installConceptDisplay();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();

window.MCLRuntimeCompat={version:'1.1.0'};
})();

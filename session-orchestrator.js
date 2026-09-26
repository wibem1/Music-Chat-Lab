(()=>{
'use strict';
if(window.__mclSessionOrchestratorV151)return;
window.__mclSessionOrchestratorV151=true;

const VERSION='1.5.1';
const MEMORY_KEY='music-chat-lab.session-memory.v3';
const ACTIVE_CHAT_KEY='music-chat-lab.active-chat.v1';
const RECENT_MESSAGES=8;
const MAX_MEMORY_CHARS=900;
const MAX_LEGACY_CONTEXT_CHARS=4200;
const MAX_SCORE_REQUESTS=3;
const innerFetch=window.fetch.bind(window);
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));

const SCORE_RE=/\[MCL-ENGINE14-SCORE name=("(?:[^"\\]|\\.)*")\]\n[\s\S]*?\n\[\/MCL-ENGINE14-SCORE\]/g;
const LEGACY_BLOCKS=[
  /\n*--- MUSIKALISCHER ARBEITSTISCH(?: \(KATALOG\))? ---[\s\S]*?--- ENDE MUSIKALISCHER ARBEITSTISCH(?: \(KATALOG\))? ---\n*/g,
  /\n*--- AUSGEWÄHLTES MUSIKMATERIAL ---[\s\S]*?--- ENDE AUSGEWÄHLTES MUSIKMATERIAL ---\n*/g,
  /\n*--- AUTOMATISCH BEREITGESTELLTES MUSIKMATERIAL ---[\s\S]*?--- ENDE AUTOMATISCH BEREITGESTELLTES MUSIKMATERIAL ---\n*/g
];
const INTERNAL_RE=/\n*\[MCL-(?:DIALOG-OFFER-ACCEPTED|FORTSETZUNG-V123|AKTUELLER-GEGENSTAND-V124|DIALOGKONTEXT-V126)\][\s\S]*$/i;
const ACTION_RE=/<MCL_ACTION>\s*([\s\S]*?)\s*<\/MCL_ACTION>/i;
const NEED_RE=/<MCL_NEED>\s*([\s\S]*?)\s*<\/MCL_NEED>/i;
const MEMORY_RE=/<MCL_MEMORY>\s*([\s\S]*?)\s*<\/MCL_MEMORY>/i;

function providerFor(url){
  const u=String(url||'');
  if(u.includes('api.anthropic.com/v1/messages'))return'anthropic';
  if(u.includes('api.openai.com/v1/responses'))return'openai';
  if(u.includes('generativelanguage.googleapis.com/')&&u.includes(':generateContent'))return'google';
  return null;
}
function textOf(m){
  if(typeof m?.content==='string')return m.content;
  if(Array.isArray(m?.content))return m.content.map(x=>x?.text||x?.input_text||x?.output_text||'').join('');
  if(Array.isArray(m?.parts))return m.parts.map(x=>x?.text||'').join('');
  return'';
}
function roleOf(provider,m){
  if(provider==='google')return m?.role==='model'?'assistant':'user';
  return m?.role==='assistant'?'assistant':'user';
}
function rawMessages(provider,body){
  if(provider==='anthropic')return Array.isArray(body?.messages)?body.messages:[];
  if(provider==='openai')return Array.isArray(body?.input)?body.input.filter(x=>x?.role==='user'||x?.role==='assistant'):[];
  return Array.isArray(body?.contents)?body.contents:[];
}
function cleanLegacy(text){
  let s=String(text||'');
  s=s.replace(SCORE_RE,'');SCORE_RE.lastIndex=0;
  for(const re of LEGACY_BLOCKS)s=s.replace(re,'\n');
  s=s.replace(INTERNAL_RE,'').replace(/\n*\[MCL-(?:OPENAI-)?VORSCHLAG:[a-z0-9]+\]\s*/ig,'\n');
  return s.replace(/\n{3,}/g,'\n\n').trim();
}
function messages(provider,body){
  return rawMessages(provider,body).map(m=>({role:roleOf(provider,m),text:cleanLegacy(textOf(m))})).filter(m=>m.text);
}
function currentUserText(msgs){for(let i=msgs.length-1;i>=0;i--)if(msgs[i].role==='user')return msgs[i].text;return''}

function readMemory(){
  try{const all=JSON.parse(localStorage.getItem(MEMORY_KEY)||'{}')||{};return{all,id:localStorage.getItem(ACTIVE_CHAT_KEY)||'default'}}catch{return{all:{},id:'default'}}
}
function getMemory(){const x=readMemory();return String(x.all[x.id]||'').slice(0,MAX_MEMORY_CHARS)}
function saveMemory(text){
  const mem=String(text||'').replace(/\s+/g,' ').trim().slice(0,MAX_MEMORY_CHARS);if(!mem)return;
  try{const x=readMemory();x.all[x.id]=mem;localStorage.setItem(MEMORY_KEY,JSON.stringify(x.all))}catch(_){ }
}
function compactOld(msgs){
  if(msgs.length<=RECENT_MESSAGES)return'';
  const old=msgs.slice(0,-RECENT_MESSAGES),parts=[];let chars=0;
  for(const m of old){
    let t=m.text.replace(/\s+/g,' ').trim();
    if(t.length>520)t=t.slice(0,340)+' … '+t.slice(-140);
    const line=`${m.role==='user'?'Nutzer':'KI'}: ${t}`;
    if(chars+line.length>MAX_LEGACY_CONTEXT_CHARS)break;
    parts.push(line);chars+=line.length+1;
  }
  return parts.join('\n');
}

function workspaceSources(){
  try{return(window.MCLMidiWorkspaceSources?.()||window.MCLMidiSlots?.all?.()||[]).filter(x=>x?.score?.tr?.length).map(x=>({slot:Number(x.slot),name:x.name||x.score?.ti||`Stück ${x.slot}`,kind:x.kind||'',score:clone(x.score)}))}catch{return[]}
}
function activeSlot(){
  try{const b=document.querySelector('.mcl-midi-slot.active');return b?Number(b.dataset.slot)+1:null}catch{return null}
}
function scoreInfo(x){
  const s=x.score||{},tr=Array.isArray(s.tr)?s.tr:[],ts=s.ts||{};let notes=0,end=0;
  tr.forEach(t=>(t.nt||[]).forEach(n=>{if(!Array.isArray(n))return;notes++;end=Math.max(end,(Number(n[0])||0)+(Number(n[1])||0))}));
  const n=Number(ts.n)||null,d=Number(ts.d)||null,bar=n&&d?n*(4/d):null;
  return{slot:x.slot,name:x.name,kind:x.kind,tracks:tr.map(t=>t.nm||'Spur').join(', '),notes,bars:bar?Number((end/bar).toFixed(2)):null,beats:Number(end.toFixed(2)),bpm:s.bpm??null,meter:n&&d?`${n}/${d}`:null,key:s.k||null};
}
function catalogue(sources,active){
  if(!sources.length)return'Keine MIDI-Fassung im Arbeitstisch.';
  return sources.map(x=>{const i=scoreInfo(x);return `Speicher ${i.slot}${i.slot===active?' [AKTIV]':''}: ${i.name} | Spuren: ${i.tracks||'?'} | ${i.notes} Noten | ${i.bars??'?'} Takte | ${i.bpm??'?'} BPM | ${i.meter??'?'} | ${i.key??'Tonart offen'}`}).join('\n');
}
function scoreBlocks(selected){
  return selected.map(x=>`<MCL_SCORE slot="${x.slot}" name=${JSON.stringify(x.name)}>\n${JSON.stringify(x.score)}\n</MCL_SCORE>`).join('\n\n');
}
function referencesWorkbench(text,sources){
  const raw=String(text||'').trim();if(!raw||!sources.length)return false;
  const low=raw.toLocaleLowerCase('de-DE');
  if(/\b(?:speicher|slot|st[üu]ck|stueck)\s*[1-6]\b/i.test(raw)||/\barbeitstisch\b/i.test(raw))return true;
  return sources.some(x=>{const name=String(x?.name||x?.score?.ti||'').trim().toLocaleLowerCase('de-DE');return name.length>=4&&low.includes(name)});
}
function sourcesForSlots(slots,sources){
  const out=[];
  for(const n of slots){const src=sources.find(x=>Number(x.slot)===Number(n));if(src&&!out.includes(src))out.push(src)}
  return out.slice(0,MAX_SCORE_REQUESTS);
}

function chatSystemPrompt(memory,legacy,catalogueText,active,hasSources){
  const continuity=[memory,legacy].filter(Boolean).join('\n');
  const workbench=hasSources?`\n\nARBEITSTISCH (nur zur Orientierung):\n${catalogueText}\nAktiver Speicher: ${active??'keiner'}. Wenn für eine Analyse exakte Notendaten nötig sind, fordere höchstens ${MAX_SCORE_REQUESTS} Speicher ausschließlich mit <MCL_NEED>{"slots":[1]}</MCL_NEED> an. Fordere keine Daten an, wenn der Katalog genügt.`:'';
  const history=continuity?`\n\nKOMPAKTER ÄLTERER KONTEXT:\n${continuity}`:'';
  return `Du bist Music Chat Lab, ein musikalischer Gesprächs- und Kompositionspartner. Antworte musikalisch eigenständig, direkt und ohne unnötige technische Metaebene. Im CHAT-Modus wird keine MIDI-Aktion ausgegeben. Wenn du eine konkrete Kompositions- oder Bearbeitungsidee entwickelst, frage den Nutzer am Ende sichtbar, ob diese Idee als Kompositionsauftrag übernommen werden soll, und hänge zusätzlich <MCL_CONCEPT>kurze Zusammenfassung der Idee</MCL_CONCEPT> an. Wenn der Nutzer einen unmittelbar zuvor angebotenen Kompositionsvorschlag eindeutig bestätigt, antworte knapp und hänge <MCL_ADOPT_CONCEPT/> an. Bei normalem Gespräch, Analyse oder Kritik verwende keinen dieser Marker.${workbench}${history}`;
}
function systemPrompt(memory,legacy,catalogueText,active,provided,mode,hasSources){return chatSystemPrompt(memory,legacy,catalogueText,active,hasSources)}
function compressMessages(msgs,memory){
  const keep=(msgs.length<=RECENT_MESSAGES||!memory)?Math.max(RECENT_MESSAGES,12):RECENT_MESSAGES;
  let start=Math.max(0,msgs.length-keep);
  if(start>0&&msgs[start]?.role==='assistant')start--;
  const out=msgs.slice(start);
  while(out.length&&out[0].role==='assistant')out.shift();
  return out;
}
function withScores(msgs,user,selected){
  const out=msgs.map(x=>({...x}));
  for(let i=out.length-1;i>=0;i--){if(out[i].role!=='user')continue;out[i].text=`${cleanLegacy(user)}${selected.length?`\n\n${scoreBlocks(selected)}`:''}`.trim();break}
  return out;
}
function buildProviderBody(provider,body,msgs,system,stage='chat'){
  const b=clone(body);
  if(provider==='anthropic'){
    b.system=system;b.messages=msgs.map(m=>({role:m.role,content:m.text}));
    const adaptive=/^claude-(?:sonnet-(?:5|4-6)|opus-5)(?:$|-)/i.test(String(b.model||''));
    if(adaptive&&stage==='materialize'){b.thinking={type:'disabled'};delete b.output_config;b.max_tokens=Math.max(Number(b.max_tokens)||4096,12000)}
    else if(adaptive){b.thinking={type:'adaptive'};b.output_config={...(b.output_config||{}),effort:'high'};b.max_tokens=Math.max(Number(b.max_tokens)||4096,stage==='compose'?32768:12000)}
    else{delete b.thinking;delete b.output_config;b.max_tokens=Math.max(Number(b.max_tokens)||4096,12000)}
  }else if(provider==='openai'){
    b.input=[{role:'system',content:system},...msgs.map(m=>({role:m.role,content:m.text}))];b.store=false;
  }else{
    b.systemInstruction={parts:[{text:system}]};b.contents=msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.text}]}));
    b.generationConfig={...(b.generationConfig||{}),maxOutputTokens:Math.max(Number(b.generationConfig?.maxOutputTokens)||8192,stage==='compose'?20000:12000)};
  }
  return b;
}
function responseText(provider,d){
  if(provider==='anthropic')return(d?.content||[]).filter(x=>x?.type==='text').map(x=>x.text||'').join('').trim();
  if(provider==='openai'){
    if(typeof d?.output_text==='string'&&d.output_text.trim())return d.output_text.trim();
    return(d?.output||[]).flatMap(x=>x?.content||[]).filter(x=>x?.type==='output_text'||x?.type==='text').map(x=>x?.text||'').join('\n').trim();
  }
  return(d?.candidates?.[0]?.content?.parts||[]).map(x=>x?.text||'').join('\n').trim();
}
function replaceResponseText(provider,d,text){
  const x=clone(d)||{};
  if(provider==='anthropic')x.content=[{type:'text',text}];
  else if(provider==='openai'){
    x.output_text=text;x.output=[{type:'message',role:'assistant',content:[{type:'output_text',text}]}];
  }else{
    x.candidates=x.candidates?.length?x.candidates:[{}];x.candidates[0]={...(x.candidates[0]||{}),content:{role:'model',parts:[{text}]}};
  }
  return x;
}
function jsonResponse(data,status=200,headers){
  const h=new Headers(headers||{});h.set('content-type','application/json');
  return new Response(JSON.stringify(data),{status,headers:h});
}
function parseJsonBlock(text,re){
  const m=String(text||'').match(re);if(!m)return null;
  let s=m[1].trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  try{return JSON.parse(s)}catch{return{__invalid:true,raw:s}}
}
function parseAction(text){return parseJsonBlock(text,ACTION_RE)}
function parseNeed(text){
  const x=parseJsonBlock(text,NEED_RE);if(!x||x.__invalid||!Array.isArray(x.slots))return null;
  const slots=[];for(const n of x.slots){const v=Number(n);if(Number.isInteger(v)&&v>=1&&v<=6&&!slots.includes(v))slots.push(v)}
  return slots.slice(0,MAX_SCORE_REQUESTS);
}
function extractMemory(text){const m=String(text||'').match(MEMORY_RE);return m?m[1].trim():''}
function visibleText(text){return String(text||'').replace(ACTION_RE,'').replace(NEED_RE,'').replace(MEMORY_RE,'').replace(/\n{3,}/g,'\n\n').trim()}
function incompleteInternal(text){
  const s=String(text||'');
  if(s.includes('<MCL_ACTION>')&&!s.includes('</MCL_ACTION>'))return'MIDI-Aktion';
  if(s.includes('<MCL_NEED>')&&!s.includes('</MCL_NEED>'))return'Notendaten-Anforderung';
  return'';
}
function safeIncompleteText(raw,kind){
  const marker=kind==='MIDI-Aktion'?'<MCL_ACTION>':'<MCL_NEED>';
  const prefix=String(raw||'').split(marker)[0].replace(MEMORY_RE,'').trim();
  return `${prefix}${prefix?'\n\n':''}Die interne ${kind} wurde unvollständig übertragen und deshalb verworfen. Es wurde keine Datei verändert.`;
}

function ideaText(){return String(window.MCLCompositionIdea?.get?.()||document.getElementById('compositionIdeaInput')?.value||'').trim()}
function validNote(n){
  if(!Array.isArray(n)||n.length<4)return false;
  const start=Number(n[0]),dur=Number(n[1]),pitch=Number(n[2]),vel=Number(n[3]);
  return Number.isFinite(start)&&start>=0&&Number.isFinite(dur)&&dur>0&&Number.isInteger(pitch)&&pitch>=0&&pitch<=127&&Number.isFinite(vel)&&vel>=0&&vel<=127;
}
function validController(c){
  if(!Array.isArray(c)||c.length<3)return false;
  const beat=Number(c[0]),cc=Number(c[1]),value=Number(c[2]);
  return Number.isFinite(beat)&&beat>=0&&Number.isInteger(cc)&&cc>=0&&cc<=127&&Number.isFinite(value)&&value>=0&&value<=127;
}
function isScore(x){return !!x&&Array.isArray(x.tr)&&x.tr.some(t=>Array.isArray(t?.nt))}
function validTrack(t){return !!t&&typeof t==='object'&&Array.isArray(t.nt)}
function scoreIssues(score){
  if(!isScore(score))return['keine gültige Partiturstruktur'];
  const issues=[];
  for(let ti=0;ti<score.tr.length;ti++){
    const tr=score.tr[ti];
    if(!validTrack(tr)){issues.push(`Spur ${ti+1}: ungültige Struktur`);continue}
    for(let ni=0;ni<tr.nt.length;ni++)if(!validNote(tr.nt[ni])){issues.push(`Spur ${ti+1}: ungültige Note ${ni+1}`);break}
    if(Array.isArray(tr.ct))for(let ci=0;ci<tr.ct.length;ci++)if(!validController(tr.ct[ci])){issues.push(`Spur ${ti+1}: ungültiges Controller-Ereignis ${ci+1}`);break}
  }
  if(score.bpm!=null&&(!Number.isFinite(Number(score.bpm))||Number(score.bpm)<=0))issues.push('ungültiges Tempo');
  const n=Number(score?.ts?.n),d=Number(score?.ts?.d);
  if(score.ts&&(!Number.isFinite(n)||n<=0||!Number.isFinite(d)||d<=0))issues.push('ungültige Taktart');
  return issues;
}
function trackIndex(score,op){
  if(Number.isInteger(op?.index))return op.index;
  if(typeof op?.name==='string'){
    const hits=(score.tr||[]).map((t,i)=>t?.nm===op.name?i:-1).filter(i=>i>=0);if(hits.length===1)return hits[0];
  }
  return-1;
}
function sortEvents(a){return(a||[]).slice().sort((x,y)=>(Number(x?.[0])||0)-(Number(y?.[0])||0))}
function applyPatch(action,sources){
  const slot=Number(action?.baseSlot),src=sources.find(x=>Number(x.slot)===slot);if(!src||!isScore(src.score)||!Array.isArray(action?.ops))return null;
  const score=clone(src.score);
  if(typeof action.title==='string'&&action.title.trim())score.ti=action.title.trim();
  if(typeof action.summary==='string'&&action.summary.trim())score.sm=action.summary.trim();
  if(action.meta&&typeof action.meta==='object')for(const k of['bpm','ts','k'])if(Object.prototype.hasOwnProperty.call(action.meta,k))score[k]=clone(action.meta[k]);
  for(const op of action.ops){
    if(!op||typeof op.op!=='string')return null;
    if(op.op==='add_track'){
      if(!validTrack(op.track))return null;score.tr.push(clone(op.track));continue;
    }
    if(op.op==='insert_track'){
      if(!validTrack(op.track))return null;const at=Math.max(0,Math.min(score.tr.length,Math.trunc(Number(op.index)||0)));score.tr.splice(at,0,clone(op.track));continue;
    }
    const ix=trackIndex(score,op);if(ix<0||ix>=score.tr.length)return null;
    if(op.op==='replace_track'){
      if(!validTrack(op.track))return null;score.tr[ix]=clone(op.track);continue;
    }
    if(op.op==='delete_track'){score.tr.splice(ix,1);continue;}
    if(op.op==='replace_range'){
      const start=Number(op.start),end=Number(op.end);if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||!Array.isArray(op.nt))return null;
      const tr=clone(score.tr[ix]);tr.nt=sortEvents((tr.nt||[]).filter(n=>{const t=Number(n?.[0]);return!(Number.isFinite(t)&&t>=start&&t<end)}).concat(clone(op.nt)));
      if(Array.isArray(op.ct))tr.ct=sortEvents((tr.ct||[]).filter(c=>{const t=Number(c?.[0]);return!(Number.isFinite(t)&&t>=start&&t<end)}).concat(clone(op.ct)));
      score.tr[ix]=tr;continue;
    }
    return null;
  }
  if(!String(score.ti||'').trim())score.ti='Neue Komposition';
  return score;
}
function trackSignature(t){
  try{return JSON.stringify({nm:t?.nm||'',ch:t?.ch??null,pg:t?.pg??null,nt:t?.nt||[],ct:t?.ct||[]})}catch{return''}
}
function mergeAction(action,sources){
  if(!Array.isArray(action?.sources)||!action.sources.length)return null;
  let score=null;const tracks=[];const seen=new Set();
  for(const spec of action.sources){
    const src=sources.find(x=>Number(x.slot)===Number(spec?.slot));if(!src||!isScore(src.score))return null;
    if(!score)score=clone(src.score);
    let chosen=src.score.tr||[];
    if(Array.isArray(spec.tracks)&&spec.tracks.length){
      const names=new Set(spec.tracks.map(String));chosen=chosen.filter(t=>names.has(String(t?.nm||'')));
      if(chosen.length!==names.size)return null;
    }
    for(const t of chosen){const sig=trackSignature(t);if(seen.has(sig))continue;tracks.push(clone(t));seen.add(sig)}
  }
  if(!score||!tracks.length)return null;
  score.tr=tracks;
  if(typeof action.title==='string'&&action.title.trim())score.ti=action.title.trim();
  else if(!String(score.ti||'').trim())score.ti='Gemeinsame Fassung';
  if(typeof action.summary==='string'&&action.summary.trim())score.sm=action.summary.trim();
  else score.sm='Vorhandene Spuren wurden lokal zusammengeführt.';
  return score;
}
function materializeAction(action,sources,prefix){
  if(!action||action.__invalid)return null;
  const type=String(action.type||'').toLowerCase();let score=null;
  if(type==='patch')score=applyPatch(action,sources);
  else if(type==='merge')score=mergeAction(action,sources);
  else if(type==='new_score'&&isScore(action.score)){
    score=clone(action.score);
    score.sm=typeof action.summary==='string'&&action.summary.trim()?action.summary.trim():'Neu komponierte MIDI-Fassung.';
  }
  else if(type==='replace_score'&&isScore(action.score)){
    score=clone(action.score);
    score.sm=typeof action.summary==='string'&&action.summary.trim()?action.summary.trim():'Neu geschriebene MIDI-Fassung.';
  }
  if(!isScore(score))return null;
  if(!String(score.ti||'').trim())score.ti=String(action.title||'Neue Komposition').trim()||'Neue Komposition';
  if(!String(score.sm||'').trim())score.sm=String(action.summary||prefix||'MIDI-Komposition wurde erzeugt.').replace(/\s+/g,' ').trim().slice(0,500);
  return score;
}

async function runProvider(input,init,provider,body,msgs,system,traceStage,policyStage){
  const requestBody=buildProviderBody(provider,body,msgs,system,policyStage);
  const r=await innerFetch(input,{...init,__mclTraceStage:traceStage,body:JSON.stringify(requestBody)});
  const rawTransport=await r.clone().text().catch(()=>'');
  let d=null;try{d=rawTransport?JSON.parse(rawTransport):null}catch{}
  return{r,d,raw:d&&r.ok?responseText(provider,d):''};
}
function compositionTask(user,provided){const assignment=ideaText()||cleanLegacy(user);if(!provided.length)return assignment;return assignment+'\n\nMUSIKALISCHES AUSGANGSMATERIAL AUS MUSIC CHAT LAB:\n'+scoreBlocks(provided)}
function sharedEngine(){const engine=window.CompositionEngine;if(!engine?.compose||!engine.version)throw new Error('Zentrale Composition Engine ist nicht geladen.');return engine}
function sharedToMclScore(score,idea,assignment){if(!score||!Array.isArray(score.tracks)||!Number.isFinite(Number(score.bpm)))return null;const ts=Array.isArray(score.timeSignature)?score.timeSignature:[4,4];const tr=score.tracks.map((t,i)=>({nm:String(t?.name||`Track ${i+1}`),ch:Math.max(0,Math.min(15,Number.isFinite(Number(t?.channel))?Number(t.channel):i%16)),pg:Math.max(0,Math.min(127,Number(t?.program)||0)),nt:(t?.notes||[]).filter(n=>Array.isArray(n)&&n.length>=4).map(n=>[Number(n[0]),Number(n[1]),Math.round(Number(n[2])),Math.round(Number(n[3])),i,0.9]),ct:[]}));return{ti:String(score.title||'Neue Komposition'),bpm:Number(score.bpm),ts:{n:Number(ts[0])||4,d:Number(ts[1])||4},k:String(score.key||''),sm:String(idea||score.description||score.summary||assignment||'').trim().slice(0,4000),tr}}
function usedCompositionTitles(){return workspaceSources().map(x=>String(x?.score?.ti||x?.name||'').trim()).filter(Boolean)}
function sharedStageBody(provider,model,prompt,stage){const engine=sharedEngine(),spec=engine.makeRequest?.(provider,model,prompt,stage);if(!spec?.body)throw new Error('Composition Engine liefert keinen gültigen Provider-Request für '+stage+'.');return spec.body}
async function runSharedStage(input,init,provider,body,prompt,stage){const requestBody=sharedStageBody(provider,body.model,prompt,stage);const r=await innerFetch(input,{...init,__mclTraceStage:stage,body:JSON.stringify(requestBody)});const rawTransport=await r.clone().text().catch(()=>'');let d=null;try{d=rawTransport?JSON.parse(rawTransport):null}catch{}return{r,d,raw:d&&r.ok?responseText(provider,d):''}}
async function sharedCompose(input,init,provider,body,task){
  const engine=sharedEngine(),snapshot={visibleTask:task,provider,model:String(body.model||''),engine:'central-current'},key='';
  const requestModel=async({promptText,stage})=>{
    const result=await runSharedStage(input,init,provider,body,promptText,stage);
    if(!result.r.ok)throw new Error('KI-Anfrage '+stage+': HTTP '+result.r.status+(result.d?.error?.message?': '+result.d.error.message:''));
    if(!result.raw)throw new Error('Die KI hat in '+stage+' keine Textantwort geliefert.');
    return result.raw;
  };
  const result=await engine.compose({snapshot,key,seriesId:null,runId:'MCL-'+Date.now().toString(36),now:()=>new Date().toISOString(),requestModel,usedTitles:usedCompositionTitles()});result.run.selectedEngine={choice:'central-current',name:engine.name,version:engine.version};return result;
}
window.fetch=async function(input,init={}){
  const url=typeof input==='string'?input:input?.url||'',provider=providerFor(url);
  if(!provider||typeof init.body!=='string')return innerFetch(input,init);
  let body;try{body=JSON.parse(init.body)}catch{return innerFetch(input,init)}
  const all=messages(provider,body),user=currentUserText(all);if(!user)return innerFetch(input,init);
  const sources=workspaceSources(),active=activeSlot(),memory=getMemory(),legacy=memory?'':compactOld(all),recent=compressMessages(all,memory);
  const mode=window.MCLRequestMode==='compose'?'compose':'chat';
  const sourceIntent=referencesWorkbench(`${user}\n${mode==='compose'?ideaText():''}`,sources);
  const availableSources=sourceIntent?sources:[];
  const provided=mode==='compose'?availableSources:[];
  const contextual=withScores(recent,user,provided);
  if(mode==='compose'){const assignment=ideaText();for(let i=contextual.length-1;i>=0;i--){if(contextual[i].role==='user'){contextual[i].text=`${contextual[i].text}\n\nVERBINDLICHER AKTUELLER KOMPOSITIONSAUFTRAG:\n${assignment}`;break}}}
  const system=systemPrompt(memory,legacy,catalogue(availableSources,active),active,provided,mode,availableSources.length>0);
  if(mode!=='compose'){
    let result=await runProvider(input,init,provider,body,contextual,system,'orchestrator_chat','chat');
    if(!result.d||!result.r.ok||!result.raw)return result.r;
    const firstIncomplete=incompleteInternal(result.raw);
    if(firstIncomplete)return jsonResponse(replaceResponseText(provider,result.d,safeIncompleteText(result.raw,firstIncomplete)),result.r.status,result.r.headers);
    const need=parseNeed(result.raw);
    if(need?.length){
      const selected=sourcesForSlots(need,availableSources);
      if(selected.length!==need.length){const warning='Die angeforderten Notendaten sind im musikalischen Arbeitstisch nicht vollständig verfügbar.';return jsonResponse(replaceResponseText(provider,result.d,warning),result.r.status,result.r.headers)}
      const moreContext=withScores(recent,user,selected);
      const moreSystem=chatSystemPrompt(memory,legacy,catalogue(availableSources,active),active,true);
      result=await runProvider(input,init,provider,body,moreContext,moreSystem,'orchestrator_chat_with_scores','chat');
      if(!result.d||!result.r.ok||!result.raw)return result.r;
      const secondIncomplete=incompleteInternal(result.raw);
      if(secondIncomplete)return jsonResponse(replaceResponseText(provider,result.d,safeIncompleteText(result.raw,secondIncomplete)),result.r.status,result.r.headers);
      if(parseNeed(result.raw)?.length){const warning='Die KI fordert nach der Bereitstellung erneut Notendaten an. Der Vorgang wurde beendet, um unnötige API-Kosten zu vermeiden.';return jsonResponse(replaceResponseText(provider,result.d,warning),result.r.status,result.r.headers)}
    }
    const mem=extractMemory(result.raw);if(mem)saveMemory(mem);
    return jsonResponse(replaceResponseText(provider,result.d,visibleText(result.raw)||result.raw),result.r.status,result.r.headers);
  }
  const note=document.getElementById('composerNote');if(note)note.textContent='Komponiere …';
  const task=compositionTask(user,provided);
  try{
    const result=await sharedCompose(input,init,provider,body,task);
    const score=sharedToMclScore(result.run.score,result.run.idea,task),issues=score?scoreIssues(score):['keine gültige Partiturstruktur'];
    if(!score||issues.length){const warning=`Die erzeugte MIDI-Fassung wurde wegen technischer Inkonsistenzen nicht übernommen: ${issues.join('; ')}.`;return jsonResponse(replaceResponseText(provider,{...body},warning),200,new Headers({'content-type':'application/json'}))}
    window.__mclLastMusicalComposition={at:new Date().toISOString(),provider,model:body.model||'',task,draft:result.run.musicalDraft,engineRun:result.run};
    if(note)note.textContent='Komposition fertig.';
    const shell=provider==='anthropic'?{content:[{type:'text',text:''}]}:provider==='openai'?{output_text:'',output:[]}:{candidates:[{content:{role:'model',parts:[{text:''}]}}]};
    return jsonResponse(replaceResponseText(provider,shell,JSON.stringify(score)),200,new Headers({'content-type':'application/json'}));
  }catch(e){
    const warning=e?.message||String(e),shell=provider==='anthropic'?{content:[{type:'text',text:''}]}:provider==='openai'?{output_text:'',output:[]}:{candidates:[{content:{role:'model',parts:[{text:''}]}}]};
    if(note)note.textContent='Technische Übersetzung fehlgeschlagen; keine Partitur übernommen.';
    return jsonResponse(replaceResponseText(provider,shell,'Komposition nicht übernommen: '+warning),200,new Headers({'content-type':'application/json'}));
  }
};

const api={version:VERSION,getMemory,workspaceSources,materializeAction,scoreIssues,systemPrompt,buildProviderBody,referencesWorkbench,compositionTask,sharedToMclScore};
window.MCLSessionV145=api;
window.MCLSessionV144=api;
window.MCLSessionV143=api;
})();

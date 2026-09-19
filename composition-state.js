(()=>{
'use strict';
if(window.__mclCompositionStateFixV121)return;
window.__mclCompositionStateFixV121=true;
const CHAT_KEY='music-chat-lab.chats.v1',ACTIVE_KEY='music-chat-lab.active-chat.v1',APPLE_EPOCH=978307200;
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x)),clean=s=>String(s||'').trim();

const previousSend=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send=function(body){let out=body;if(typeof body==='string'){try{const d=JSON.parse(body),guard='\n\nWICHTIG: Die neue Komposition muss im JSON-Feld "ti" einen eigenen, nichtleeren musikalischen Titel erhalten. Übernimm nicht einfach den Titel einer vorhandenen Quelle oder einer früheren Komposition.',patch=t=>{t=String(t||'');return t.includes('Gib jetzt die fertige JSON-Partitur aus.')&&!t.includes('Die neue Komposition muss im JSON-Feld "ti"')?t+guard:t};if(Array.isArray(d.messages))d.messages=d.messages.map(m=>typeof m?.content==='string'?{...m,content:patch(m.content)}:m);if(Array.isArray(d.contents))d.contents=d.contents.map(c=>({...c,parts:Array.isArray(c.parts)?c.parts.map(p=>typeof p?.text==='string'?{...p,text:patch(p.text)}:p):c.parts}));out=JSON.stringify(d)}catch(_){}}return previousSend.call(this,out)};
function currentChat(){try{const chats=JSON.parse(localStorage.getItem(CHAT_KEY)||'[]'),id=localStorage.getItem(ACTIVE_KEY);return chats.find(c=>c.id===id)||chats[0]||null}catch{return null}}
function currentIdea(){return clean(window.MCLCompositionIdea?.get?.()||document.getElementById('compositionIdeaInput')?.value||'')}
function parseScore(text){let s=String(text||'').trim();const f=s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);if(f)s=f[1].trim();const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<=a)return null;try{const x=JSON.parse(s.slice(a,b+1));return x&&Array.isArray(x.tr)&&x.tr.some(t=>Array.isArray(t.nt))?x:null}catch{return null}}
function latestGenerated(){const c=currentChat();if(!c)return null;for(const m of [...(c.messages||[])].reverse()){if(m.role!=='assistant'||m.isError||m.thinking)continue;const score=parseScore(m.text);if(score)return{message:m,score}}return null}
function coreSignature(score){try{const x=clone(score);delete x.ti;return JSON.stringify(x)}catch{return''}}
function providerLabel(p){return p==='anthropic'?'Claude':p==='google'||p==='gemini'?'Gemini':p==='openai'?'OpenAI':'KI'}
function ensureTitle(score,message){let title=clean(score?.ti);if(title)return title;title=`Neue Komposition von ${providerLabel(message?.provider)}`;score.ti=title;return title}
function activeSlotNumber(){const b=document.querySelector('.mcl-midi-slot.active');return b?Number(b.dataset.slot)+1:0}
function attachCurrentMusicalDraft(rec){
  const d=window.__mclLastMusicalComposition;
  if(!rec?.score||!rec?.message||!d||!clean(d.draft))return;
  const sameProvider=!d.provider||!rec.message.provider||String(d.provider)===String(rec.message.provider);
  const sameModel=!d.model||!rec.message.model||String(d.model)===String(rec.message.model);
  if(!sameProvider||!sameModel)return;
  rec.score.sm=String(d.draft).trim();
  d.consumed=true;
}
async function recordGeneratedResult(rec){
  const chat=currentChat();if(!chat?.id||!rec?.score||!rec?.message)return false;
  attachCurrentMusicalDraft(rec);
  const entry={id:rec.message.id||('composition-'+Date.now()),messageId:rec.message.id||null,createdAt:rec.message.createdAt||Date.now(),title:ensureTitle(rec.score,rec.message),provider:rec.message.provider||null,model:rec.message.model||null,assignment:assignmentBefore(rec.message.id)||latestAssignment(),score:clone(rec.score)};
  const added=await window.MCLStateVault?.appendComposition?.(chat.id,entry);
  if(added)window.dispatchEvent(new CustomEvent('mcl-composition-history-changed',{detail:{chatId:chat.id}}));
  return !!added;
}
function syncGeneratedResult(rec){const api=window.MCLMidiSlots;if(!api?.all||!api?.restoreState||!rec?.score)return;attachCurrentMusicalDraft(rec);const score=clone(rec.score),title=ensureTitle(score,rec.message),core=coreSignature(score),items=api.all().map(x=>clone(x));let hit=items.find(x=>coreSignature(x.score)===core);if(hit){hit.score=score;hit.name=title;hit.kind='KI';api.restoreState(items,hit.slot);return}const used=new Set(items.map(x=>Number(x.slot))),free=[1,2,3,4,5,6].find(n=>!used.has(n));if(free){items.push({slot:free,name:title,kind:'KI',score});api.restoreState(items,free)}}
let lastGeneratedId=latestGenerated()?.message?.id||null,syncTimer=null;
function scheduleGeneratedSync(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>{const r=latestGenerated(),id=r?.message?.id||null;if(!id||id===lastGeneratedId)return;lastGeneratedId=id;setTimeout(()=>{recordGeneratedResult(r);syncGeneratedResult(r)},160)},60)}
function scoreMeasures(score){let end=0;for(const tr of score?.tr||[])for(const n of tr.nt||[])if(Array.isArray(n))end=Math.max(end,(Number(n[0])||0)+(Number(n[1])||0));const ts=score?.ts||{n:4,d:4},beats=(Number(ts.n)||4)*(4/(Number(ts.d)||4));return String(Math.max(1,Math.ceil(end/Math.max(.25,beats))))}
function ensemble(score){return(score?.tr||[]).map(t=>t.nm).filter(Boolean).join(', ')}
function latestAssignment(){const c=currentChat();if(!c)return'';const m=[...(c.messages||[])].reverse().find(x=>x.role==='user'&&!x.isError&&!x.thinking);return String(m?.displayText||m?.text||'').replace(/\[MCL-(?:ENGINE14-SCORE|CLAB-SCORE)[\s\S]*$/i,'').trim()}
function assignmentBefore(messageId){const c=currentChat(),ms=c?.messages||[];const ix=ms.findIndex(x=>x.id===messageId);for(let i=(ix>=0?ix:ms.length)-1;i>=0;i--){const m=ms[i];if(m.role==='user'&&!m.isError&&!m.thinking)return String(m.displayText||m.text||'').replace(/\[MCL-(?:ENGINE14-SCORE|CLAB-SCORE)[\s\S]*$/i,'').trim()}return''}
function activeProviderModel(){const p=document.getElementById('providerSelect')?.value||'',m=document.getElementById('modelSelect')?.value||null;return{provider:p==='google'?'gemini':p||null,model:m}}
function safeName(v){return String(v||'Komposition').replace(/[\\/:*?"<>|]+/g,'_').replace(/\s+/g,' ').trim()||'Komposition'}
function download(text,name){const blob=new Blob([text],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function setNote(msg){const e=document.getElementById('composerNote');if(e&&e.textContent!==msg)e.textContent=msg}
function saveActiveClab(){const api=window.MCLMidiSlots;if(!api?.all)throw new Error('Der MIDI-Arbeitstisch ist nicht verfügbar.');const slot=activeSlotNumber();if(!slot)throw new Error('Kein Stück auf dem Arbeitstisch markiert.');const item=(api.all()||[]).find(x=>Number(x.slot)===slot&&x.score);if(!item)throw new Error('Der markierte Speicherplatz enthält keine Komposition.');const score=clone(item.score),title=clean(score.ti)||clean(item.name)||'Komposition',old=window.MCLCLAB?.getLoadedDocument?.()||null,idea=currentIdea()||clean(score.sm)||clean(old?.concept);score.ti=title;if(idea)score.sm=idea;const same=!!old&&JSON.stringify(old.score)===JSON.stringify(score),pm=activeProviderModel(),doc={...(same&&old?clone(old):{}),format:'composition-lab-document',version:1,savedAt:Date.now()/1000-APPLE_EPOCH,title,score,concept:idea,provider:pm.provider,model:pm.provider?pm.model:null,measures:scoreMeasures(score),meter:`${score.ts?.n||4}/${score.ts?.d||4}`,tempo:String(score.bpm||96),musicalKey:String(score.k||''),ensemble:ensemble(score),assignment:latestAssignment()};if(old&&!same){doc.sourceName=old.title||old.sourceName||null;doc.sourceScore=clone(old.score)}delete doc.midiData;delete doc.musicXMLData;delete doc.costUSD;delete doc.inputTokens;delete doc.outputTokens;download(JSON.stringify(doc,null,2),safeName(title)+'.clab');try{window.MCLCLAB?.applyDocument?.(doc,title+'.clab')}catch(_){}setNote(`CLAB gespeichert: ${title}. Gespeichert wurde Speicher ${slot}, die aktuell markierte Komposition.`)}
function installClabSaveGuard(){document.addEventListener('click',e=>{const b=e.target?.closest?.('#clabSaveBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();try{saveActiveClab()}catch(err){setNote(err?.message||String(err))}},true)}
function refreshClabLabel(){const b=document.getElementById('clabProjectBadge'),api=window.MCLMidiSlots,slot=activeSlotNumber();if(!b||!api?.all||!slot)return;const item=(api.all()||[]).find(x=>Number(x.slot)===slot);if(!item)return;const next=`CLAB: ${clean(item.score?.ti)||clean(item.name)||'Komposition'}`;if(b.textContent!==next)b.textContent=next}

function historyDialog(){return document.getElementById('compositionHistoryDialog')}
function formatHistoryDate(ms){try{return new Date(Number(ms)||Date.now()).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch{return''}}
async function renderCompositionHistory(){
  const box=document.getElementById('compositionHistoryList'),chat=currentChat();if(!box)return;
  const items=chat?.id?await window.MCLStateVault?.compositionHistory?.(chat.id):[];
  box.innerHTML='';
  if(!items?.length){const e=document.createElement('div');e.className='composition-history-empty';e.textContent='In diesem Chat gibt es noch keine gespeicherte Kompositionsfassung.';box.appendChild(e);return}
  [...items].reverse().forEach((item,index)=>{
    const row=document.createElement('div');row.className='composition-history-item';
    const info=document.createElement('div');info.className='composition-history-info';
    const title=document.createElement('strong');title.textContent=item.title||item.score?.ti||'Komposition';
    const meta=document.createElement('span');meta.textContent=[formatHistoryDate(item.createdAt),providerLabel(item.provider),item.model].filter(Boolean).join(' · ');
    const assignment=document.createElement('small');assignment.textContent=item.assignment||'';
    info.append(title,meta);if(item.assignment)info.appendChild(assignment);
    const load=document.createElement('button');load.type='button';load.className='secondary-button';load.textContent='In Slot laden';
    load.addEventListener('click',()=>loadHistoryItem(item));
    row.append(info,load);box.appendChild(row);
  });
}
function loadHistoryItem(item){
  const api=window.MCLMidiSlots;if(!api?.all||!api?.restoreState||!item?.score)return;
  const items=api.all().map(x=>clone(x)),used=new Set(items.map(x=>Number(x.slot))),free=[1,2,3,4,5,6].find(n=>!used.has(n));
  let target=free;
  if(!target){target=activeSlotNumber();if(!target){setNote('Alle sechs Speicher sind belegt. Markiere zuerst den Speicher, den du ersetzen möchtest.');return}if(!window.confirm('Alle sechs Speicher sind belegt. Die markierte Arbeitskopie in Speicher '+target+' durch diese historische Fassung ersetzen?'))return;const ix=items.findIndex(x=>Number(x.slot)===target);if(ix>=0)items.splice(ix,1)}
  items.push({slot:target,name:item.title||item.score.ti||'Historische Fassung',kind:'Verlauf',score:clone(item.score)});
  api.restoreState(items,target);setNote('Historische Fassung in Speicher '+target+' geladen. Der Verlauf selbst bleibt unverändert.');historyDialog()?.close();
}
async function backfillCompositionHistory(){const chat=currentChat();if(!chat?.id)return;for(const m of chat.messages||[]){if(m.role!=='assistant'||m.isError||m.thinking)continue;const score=parseScore(m.text);if(score)await recordGeneratedResult({message:m,score})}}
async function openCompositionHistory(){await backfillCompositionHistory();await renderCompositionHistory();historyDialog()?.showModal()}
function installHistoryUI(){
  document.getElementById('compositionHistoryButton')?.addEventListener('click',openCompositionHistory);
  document.getElementById('compositionHistoryCloseButton')?.addEventListener('click',()=>historyDialog()?.close());
  window.addEventListener('mcl-composition-history-changed',renderCompositionHistory);
}

function start(){installClabSaveGuard();installHistoryUI();const messages=document.getElementById('messages');if(messages)new MutationObserver(scheduleGeneratedSync).observe(messages,{subtree:false,childList:true});const slots=document.getElementById('midiSlots');if(slots){new MutationObserver(refreshClabLabel).observe(slots,{subtree:true,attributes:true,attributeFilter:['class']});slots.addEventListener('click',()=>setTimeout(refreshClabLabel,30))}refreshClabLabel()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

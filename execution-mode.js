(()=>{
'use strict';
if(window.__mclExplicitModeV139)return;
window.__mclExplicitModeV139=true;

const VERSION='1.4.8';
const PENDING_KEY='music-chat-lab.pending-composition-idea.v1';
const nativeFetch=window.fetch.bind(window);
const CONCEPT_RE=/<MCL_CONCEPT>\s*([\s\S]*?)\s*<\/MCL_CONCEPT>/i;
const ADOPT_RE=/<MCL_ADOPT_CONCEPT\s*\/>/i;
let forwardingCompose=false;
window.MCLRequestMode='chat';

function setMode(mode){window.MCLRequestMode=mode==='compose'?'compose':'chat'}
function currentIdea(){return String(window.MCLCompositionIdea?.get?.()||document.getElementById('compositionIdeaInput')?.value||'').trim()}
function setIdea(text){const value=String(text||'').trim();if(!value)return;if(window.MCLCompositionIdea?.set)window.MCLCompositionIdea.set(value,{generated:false,source:'proposal'});else{const e=document.getElementById('compositionIdeaInput');if(e)e.value=value}}
function activeChatId(){return localStorage.getItem('music-chat-lab.active-chat.v1')||'default'}
function readPending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'{}')||{}}catch{return{}}}
function pendingProposal(){const all=readPending();return String(all[activeChatId()]||'').trim()}
function updateIdeaButton(){const b=document.getElementById('adoptIdeaButton');if(!b)return;const has=!!pendingProposal();b.disabled=!has;b.title=has?'Letzten Kompositionsvorschlag aus dem Chat übernehmen':'Noch kein übernehmbarer Kompositionsvorschlag im aktuellen Chat'}
function storeProposal(text){const value=String(text||'').trim();if(!value)return;try{const all=readPending();all[activeChatId()]=value;localStorage.setItem(PENDING_KEY,JSON.stringify(all))}catch(_){}updateIdeaButton()}
function transferProposal(){const value=pendingProposal();if(!value)return false;setIdea(value);updateIdeaButton();return true}

function removeLegacyProposalMarkers(){
  const key='music-chat-lab.chats.v1';
  try{
    const chats=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(chats))return;let changed=false;
    for(const chat of chats){if(!Array.isArray(chat?.messages))continue;for(const message of chat.messages){if(typeof message?.text!=='string')continue;const cleaned=message.text.replace(/\n*\[MCL-(?:OPENAI-)?VORSCHLAG:[a-z0-9]+\]\s*/ig,'\n').replace(/\n{3,}/g,'\n\n').trim();if(cleaned!==message.text){message.text=cleaned;changed=true}}}
    if(changed)localStorage.setItem(key,JSON.stringify(chats));
  }catch(_){ }
}
function hasAssistantContext(){try{const chats=JSON.parse(localStorage.getItem('music-chat-lab.chats.v1')||'[]'),id=localStorage.getItem('music-chat-lab.active-chat.v1'),chat=Array.isArray(chats)?chats.find(c=>c?.id===id):null;return!!chat?.messages?.some(m=>m?.role==='assistant'&&!m?.isError&&!m?.thinking&&String(m?.text||'').trim())}catch{return false}}
function providerFor(url){const u=String(url||'');if(u.includes('api.anthropic.com/v1/messages'))return'anthropic';if(u.includes('api.openai.com/v1/responses'))return'openai';if(u.includes('generativelanguage.googleapis.com/')&&u.includes(':generateContent'))return'google';return null}

const OLD_HEAD='Die App interpretiert die Sprache des Nutzers nicht anhand von Schlüsselwörtern; du selbst entscheidest musikalisch und semantisch, was gemeint ist.';
const OLD_ACTION='MIDI-AKTIONEN: Antworte normal in natürlicher Sprache. Nur wenn jetzt tatsächlich eine MIDI-Fassung erzeugt oder verändert werden soll, hänge am Ende genau eine <MCL_ACTION> an. Die Entscheidung, welche Aktion passt, triffst du aus dem Gespräch heraus.';
const OLD_NO_ACTION='Gib keine MIDI-Aktion aus, wenn du nur diskutierst, analysierst oder einen Vorschlag machst.';
const OLD_CONTINUATION='GESPRÄCHSFORTSETZUNG: Wenn der Nutzer ein zuvor von dir angebotenes musikalisches Vorhaben bestätigt, verstehe die Bestätigung aus dem bisherigen Dialog. Es gibt keinen separaten DISCUSS/ANALYZE/COMPOSE-Router.';
function removeDecisionLayer(system){return String(system||'').replace(OLD_HEAD,'Der Ausführungsmodus dieses Zugs wurde vom Nutzer ausdrücklich gewählt.').replace(OLD_ACTION,'MIDI-AKTIONEN: Verwende die folgenden Aktionsformate für die technische Erzeugung oder Bearbeitung einer MIDI-Fassung.').replace(OLD_NO_ACTION,'').replace(OLD_CONTINUATION,'GESPRÄCHSFORTSETZUNG: Nutze den bisherigen Dialog vollständig als Kontext für den aktuellen, ausdrücklich gewählten Ausführungsmodus.')}

function directive(mode,idea){
  if(mode==='compose'){
    const brief=idea?`\n\nAKTUELLER KOMPOSITIONSAUFTRAG:\n${idea}\nFühre diesen Auftrag musikalisch aus.`:'';
    return `MODUS: KOMPONIERE. Führe den aktuellen musikalischen Auftrag vollständig aus.${brief}`;
  }
  return `MODUS: CHAT. Antworte als musikalischer Gesprächs- und Kompositionspartner frei und direkt. Erzeuge in diesem Modus keine MIDI-Aktion. Wenn du eine konkrete Kompositions- oder Bearbeitungsidee entwickelst, frage den Nutzer am Ende sichtbar, ob diese Idee als Kompositionsauftrag übernommen werden soll, und hänge zusätzlich <MCL_CONCEPT>kurze Zusammenfassung der Idee</MCL_CONCEPT> an. Wenn der Nutzer einen unmittelbar zuvor angebotenen Kompositionsvorschlag eindeutig bestätigt, antworte knapp und hänge <MCL_ADOPT_CONCEPT/> an. Bei normalem Gespräch, Analyse oder Kritik verwende keinen dieser Marker.`;
}
function inject(system,mode,idea){return`${directive(mode,idea)}\n\n${removeDecisionLayer(system)}`}
function patchBody(provider,body,mode,idea){
  if(provider==='anthropic')body.system=inject(body.system,mode,idea);
  else if(provider==='openai'){const input=Array.isArray(body.input)?body.input:[],first=input.findIndex(x=>x?.role==='system');if(first>=0)input[first]={...input[first],content:inject(input[first].content,mode,idea)};else input.unshift({role:'system',content:directive(mode,idea)});body.input=input}
  else if(provider==='google'){const si=body.systemInstruction&&typeof body.systemInstruction==='object'?body.systemInstruction:{parts:[]},parts=Array.isArray(si.parts)?si.parts.slice():[];if(parts.length)parts[0]={...parts[0],text:inject(parts[0]?.text,mode,idea)};else parts.push({text:directive(mode,idea)});body.systemInstruction={...si,parts}}
  return body;
}
function responseText(provider,d){if(provider==='anthropic')return(d?.content||[]).filter(x=>x?.type==='text').map(x=>x.text||'').join('').trim();if(provider==='openai'){if(typeof d?.output_text==='string'&&d.output_text.trim())return d.output_text.trim();return(d?.output||[]).flatMap(x=>x?.content||[]).filter(x=>x?.type==='output_text'||x?.type==='text').map(x=>x?.text||'').join('\n').trim()}return(d?.candidates?.[0]?.content?.parts||[]).map(x=>x?.text||'').join('\n').trim()}
function replaceResponseText(provider,d,text){const x=JSON.parse(JSON.stringify(d||{}));if(provider==='anthropic')x.content=[{type:'text',text}];else if(provider==='openai'){x.output_text=text;x.output=[{type:'message',role:'assistant',content:[{type:'output_text',text}]}]}else{x.candidates=x.candidates?.length?x.candidates:[{}];x.candidates[0]={...(x.candidates[0]||{}),content:{role:'model',parts:[{text}]}}}return x}
function jsonResponse(data,r){const h=new Headers(r.headers||{});h.set('content-type','application/json');return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:h})}

window.fetch=async function(input,init={}){
  if(init&&init.__mclRawStage){const clean={...init};delete clean.__mclRawStage;return nativeFetch(input,clean)}
  const url=typeof input==='string'?input:input?.url||'',provider=providerFor(url);if(!provider||typeof init.body!=='string')return nativeFetch(input,init);
  let body;try{body=JSON.parse(init.body)}catch{return nativeFetch(input,init)}
  const mode=window.MCLRequestMode==='compose'?'compose':'chat';
  const finalBody=body;
  const traceStage=String(init.__mclTraceStage||'provider_call');
  const cleanInit={...init,body:JSON.stringify(finalBody)};delete cleanInit.__mclTraceStage;
  const traceId=window.MCLAiTrace?.request?.(traceStage,url,cleanInit,finalBody);
  const response=await nativeFetch(input,cleanInit);
  const traceRaw=await response.clone().text().catch(()=>'');
  window.MCLAiTrace?.response?.(traceId,response,traceRaw);
  if(mode!=='chat'||!response.ok)return response;
  const d=await response.clone().json().catch(()=>null);if(!d)return response;const raw=responseText(provider,d),m=raw.match(CONCEPT_RE),adopt=ADOPT_RE.test(raw);
  if(m)storeProposal(m[1]);
  if(adopt)transferProposal();
  if(!m&&!adopt)return response;
  const cleaned=raw.replace(CONCEPT_RE,'').replace(ADOPT_RE,'').replace(/\n{3,}/g,'\n\n').trim();return jsonResponse(replaceResponseText(provider,d,cleaned),response);
};

function bindButtons(){
  const chat=document.getElementById('sendButton'),compose=document.getElementById('composeButton'),input=document.getElementById('messageInput'),adopt=document.getElementById('adoptIdeaButton');if(!chat||!compose||!input)return;
  adopt?.addEventListener('click',()=>{if(transferProposal()){const note=document.getElementById('composerNote');if(note)note.textContent='Idee als Kompositionsauftrag übernommen.'}});
  updateIdeaButton();
  document.addEventListener('click',e=>{if(e.target?.closest?.('.chat-item,#newChatButton'))setTimeout(updateIdeaButton,40)},true);
  chat.addEventListener('click',()=>{if(!forwardingCompose)setMode('chat')},true);
  compose.addEventListener('click',()=>{
    if(chat.disabled)return;
    if(!currentIdea()){
      const note=document.getElementById('composerNote');if(note)note.textContent='Bitte Kompositionsauftrag eintragen.';
      return;
    }
    input.value='Führe den aktuellen Kompositionsauftrag aus.';
    input.dispatchEvent(new Event('input',{bubbles:true}));
    setMode('compose');
    if(typeof window.MCLSendMessage==='function')window.MCLSendMessage();
    else{const note=document.getElementById('composerNote');if(note)note.textContent='Komponieren konnte nicht gestartet werden.';setMode('chat')}
  });
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)setMode('chat')},true);
  const syncDisabled=()=>{compose.disabled=chat.disabled};syncDisabled();new MutationObserver(syncDisabled).observe(chat,{attributes:true,attributeFilter:['disabled']});
}
removeLegacyProposalMarkers();bindButtons();window.MCLExplicitModeV139={version:VERSION,getMode:()=>window.MCLRequestMode,setMode,storeProposal,pendingProposal,transferProposal,directive,currentIdea};
})();

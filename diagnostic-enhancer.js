(()=>{
'use strict';
const CHAT_KEY='music-chat-lab.chats.v1';
const ACTIVE_KEY='music-chat-lab.active-chat.v1';
const DIAG_KEY='music-chat-lab.last-diagnostic.v1';
const SETTINGS_KEY='music-chat-lab.api-settings.v1';
let diagnosticSettingsSnapshot=null,diagnosticProtectionUntil=0,diagnosticProtectionTimer=null;
const PENDING_KEYS=['music-chat-lab.pending-compositions.v2','music-chat-lab.pending-compositions.v1','music-chat-lab.pending-openai-compositions.v1'];
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}}
function activeChat(){const chats=readJSON(CHAT_KEY,[]),id=localStorage.getItem(ACTIVE_KEY);return chats.find(c=>c.id===id)||chats[0]||null}
function cleanMessage(m){return{id:m.id??null,role:m.role??null,provider:m.provider??null,model:m.model??null,text:String(m.text??''),displayText:m.displayText==null?null:String(m.displayText),files:Array.isArray(m.files)?clone(m.files):[],attachmentContext:m.attachmentContext==null?null:String(m.attachmentContext),usage:m.usage?clone(m.usage):null,isError:!!m.isError,thinking:!!m.thinking,createdAt:m.createdAt??null}}
function chatSnapshot(){const c=activeChat();if(!c)return null;return{id:c.id,title:c.title,provider:c.provider,model:c.model,createdAt:c.createdAt,updatedAt:c.updatedAt,messages:(c.messages||[]).map(cleanMessage)}}
function pendingSnapshot(){const out={};for(const key of PENDING_KEYS){const value=readJSON(key,{});out[key]=clone(value)}return out}
function workspaceSnapshot(){try{return (window.MCLMidiWorkspaceSources?.()||[]).map(x=>({slot:x.slot??null,name:x.name??x.score?.ti??'Stück',score:x.score?clone(x.score):null}))}catch{return[]}}
function parseSettings(raw){try{return JSON.parse(raw||'{}')||{}}catch{return{}}}
function protectDiagnosticSettings(){diagnosticSettingsSnapshot=localStorage.getItem(SETTINGS_KEY);diagnosticProtectionUntil=Date.now()+15000;clearTimeout(diagnosticProtectionTimer);diagnosticProtectionTimer=setTimeout(()=>{diagnosticSettingsSnapshot=null;diagnosticProtectionUntil=0},15000)}
function restoreMissingDiagnosticKeys(){if(!diagnosticSettingsSnapshot||Date.now()>diagnosticProtectionUntil)return false;const before=parseSettings(diagnosticSettingsSnapshot),current=parseSettings(localStorage.getItem(SETTINGS_KEY));let changed=false;for(const key of ['anthropicKey','openaiKey','googleKey']){if(before[key]&&!current[key]){current[key]=before[key];changed=true}}if(changed)localStorage.setItem(SETTINGS_KEY,JSON.stringify(current));return changed}
function currentAppVersion(){const text=document.querySelector('[data-app-version]')?.textContent||'';return String(text).trim().replace(/^v/i,'')||'unknown'}
function buildDiagnostic(){const base=readJSON(DIAG_KEY,{});let requestedSlots=[];try{requestedSlots=window.MCLMidiRequestedSlots?.()||[]}catch{}return{...base,diagnosticFormat:3,appVersion:currentAppVersion(),capturedAt:new Date().toISOString(),chatContext:chatSnapshot(),pendingCompositions:pendingSnapshot(),workspace:workspaceSnapshot(),autoRequestedSlots:requestedSlots}}
window.MCLDownloadDiagnostic=function(){protectDiagnosticSettings();const data=buildDiagnostic();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`Music-Chat-Lab-Diagnose-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.appendChild(a);a.click();a.remove();restoreMissingDiagnosticKeys();setTimeout(()=>{URL.revokeObjectURL(u);restoreMissingDiagnosticKeys()},1000)};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')restoreMissingDiagnosticKeys()});window.addEventListener('pageshow',restoreMissingDiagnosticKeys);
const modelExtension=document.createElement('script');modelExtension.src=`model-extension.js?v=1.3.16`;document.head.appendChild(modelExtension);
})();
(()=>{
'use strict';
if(window.__mclSettingsStoreV103)return;
window.__mclSettingsStoreV103=true;
const KEY='music-chat-lab.api-settings.v1',DB='music-chat-lab.settings.v1',STORE='settings',ID='api';
let dbPromise=null;
function openDB(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
  return dbPromise;
}
async function readVault(){
  try{const db=await openDB();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(ID);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}catch{return null}
}
async function writeVault(value){
  try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,ID);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});return true}catch{return false}
}
async function deleteVault(){
  try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(ID);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});return true}catch{return false}
}
function parseLocal(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function hasKey(s){return !!(s&&(s.anthropicKey||s.openaiKey||s.googleKey))}
async function restore(){
  const local=parseLocal();
  if(hasKey(local)){await writeVault(local);return local}
  const vault=await readVault();
  if(hasKey(vault)){try{localStorage.setItem(KEY,JSON.stringify(vault))}catch{} return vault}
  return local||{};
}
window.MCLSettingsStore={
  version:'1.0.3',
  save:async value=>{try{localStorage.setItem(KEY,JSON.stringify(value||{}))}catch{};return writeVault(value||{})},
  clear:async()=>deleteVault(),
  persistCurrent:async()=>{const local=parseLocal();return hasKey(local)?writeVault(local):false},
  restore,
  diagnostic:async()=>{
    const local=parseLocal(),vault=await readVault();
    const fp=async value=>{const s=String(value||'');if(!s)return {present:false,length:0,fingerprint:null};const bytes=new TextEncoder().encode(s),hash=await crypto.subtle.digest('SHA-256',bytes),hex=Array.from(new Uint8Array(hash)).slice(0,6).map(b=>b.toString(16).padStart(2,'0')).join('');return {present:true,length:s.length,fingerprint:hex}};
    const providers=['anthropicKey','openaiKey','googleKey'],out={};
    for(const key of providers)out[key]={local:await fp(local?.[key]),vault:await fp(vault?.[key]),same:String(local?.[key]||'')===String(vault?.[key]||''),runtimeSource:'localStorage'};
    return out;
  }
};
restore();
window.addEventListener('pageshow',()=>restore());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')restore()});
})();

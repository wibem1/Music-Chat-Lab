(()=>{
'use strict';
if(window.__mclSettingsStoreV102)return;
window.__mclSettingsStoreV102=true;
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
  version:'1.0.2',
  save:async value=>{try{localStorage.setItem(KEY,JSON.stringify(value||{}))}catch{};return writeVault(value||{})},
  clear:async()=>deleteVault(),
  persistCurrent:async()=>{const local=parseLocal();return hasKey(local)?writeVault(local):false},
  restore
};
restore();
window.addEventListener('pageshow',()=>restore());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')restore()});
})();

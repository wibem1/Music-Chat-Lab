(()=>{
'use strict';
if(window.__mclStateVaultV100)return;
window.__mclStateVaultV100=true;
const CHAT_KEY='music-chat-lab.chats.v1',ACTIVE_KEY='music-chat-lab.active-chat.v1';
const DB='music-chat-lab.state-vault.v1',STORE='state',CHAT_ID='chats',ACTIVE_ID='active';
let dbPromise;
function openDB(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
async function get(id){try{const db=await openDB();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).get(id);r.onsuccess=()=>resolve(r.result??null);r.onerror=()=>reject(r.error)})}catch{return null}}
async function put(id,value){try{const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});return true}catch{return false}}
async function mirrorChats(chats,active){if(Array.isArray(chats)&&chats.length){await put(CHAT_ID,chats);if(active)await put(ACTIVE_ID,active);return true}return false}
async function restoreIfMissing(){
  let current=null;try{current=JSON.parse(localStorage.getItem(CHAT_KEY)||'null')}catch{}
  if(Array.isArray(current)&&current.length){await mirrorChats(current,localStorage.getItem(ACTIVE_KEY));return false}
  const saved=await get(CHAT_ID);
  if(!Array.isArray(saved)||!saved.length)return false;
  localStorage.setItem(CHAT_KEY,JSON.stringify(saved));
  const active=await get(ACTIVE_ID);if(active)localStorage.setItem(ACTIVE_KEY,active);
  return true;
}
const ready=restoreIfMissing();
window.MCLStateVault={version:'1.0.0',ready,mirrorChats,restoreIfMissing};
window.addEventListener('pageshow',async()=>{if(await restoreIfMissing())location.reload()});
document.addEventListener('visibilitychange',async()=>{if(document.visibilityState==='visible'&&await restoreIfMissing())location.reload()});
})();
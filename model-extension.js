(()=>{
'use strict';
const OPENAI_MODELS=[
  {id:'gpt-6-astra',label:'GPT-6 Astra'},
  {id:'gpt-5.6-sol',label:'GPT-5.6 Sol'},
  {id:'gpt-5.6-terra',label:'GPT-5.6 Terra'},
  {id:'gpt-5.6-luna',label:'GPT-5.6 Luna'}
];
const CHAT_KEY='music-chat-lab.chats.v1';
const ACTIVE_KEY='music-chat-lab.active-chat.v1';
const provider=document.getElementById('providerSelect');
const models=document.getElementById('modelSelect');
if(!provider||!models)return;
let applying=false;
function savedModel(){
  try{
    const chats=JSON.parse(localStorage.getItem(CHAT_KEY)||'[]')||[];
    const id=localStorage.getItem(ACTIVE_KEY);
    const c=chats.find(x=>x.id===id)||chats[0];
    return c?.provider==='openai'?c.model:null;
  }catch{return null}
}
function apply(){
  if(applying||provider.value!=='openai')return;
  applying=true;
  const current=models.value;
  const preferred=current==='gpt-6-astra'?current:savedModel();
  const wanted=new Set(OPENAI_MODELS.map(x=>x.id));
  for(const m of OPENAI_MODELS){
    let o=[...models.options].find(x=>x.value===m.id);
    if(!o){o=document.createElement('option');o.value=m.id;models.appendChild(o)}
    o.textContent=m.label;
  }
  const astra=[...models.options].find(x=>x.value==='gpt-6-astra');
  if(astra&&models.firstElementChild!==astra)models.insertBefore(astra,models.firstElementChild);
  if(preferred&&wanted.has(preferred))models.value=preferred;
  applying=false;
}
provider.addEventListener('change',()=>queueMicrotask(apply));
new MutationObserver(()=>queueMicrotask(apply)).observe(models,{childList:true});
apply();
})();

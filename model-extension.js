(()=>{
'use strict';
const MODEL_SETS={
  openai:[
    {id:'gpt-6-astra',label:'GPT-6 Astra'},
    {id:'gpt-5.6-sol',label:'GPT-5.6 Sol'},
    {id:'gpt-5.6-terra',label:'GPT-5.6 Terra'},
    {id:'gpt-5.6-luna',label:'GPT-5.6 Luna'}
  ],
  anthropic:[
    {id:'claude-fable-5-1',label:'Claude Fable 5.1'},
    {id:'claude-opus-5',label:'Claude Opus 5'},
    {id:'claude-sonnet-5',label:'Claude Sonnet 5'},
    {id:'claude-sonnet-4-6',label:'Claude Sonnet 4.6'}
  ]
};
const CHAT_KEY='music-chat-lab.chats.v1';
const ACTIVE_KEY='music-chat-lab.active-chat.v1';
const provider=document.getElementById('providerSelect');
const models=document.getElementById('modelSelect');
if(!provider||!models)return;
let applying=false;
function activeChat(){try{const chats=JSON.parse(localStorage.getItem(CHAT_KEY)||'[]')||[];const id=localStorage.getItem(ACTIVE_KEY);return chats.find(x=>x.id===id)||chats[0]||null}catch{return null}}
function apply(){
  if(applying)return;
  const list=MODEL_SETS[provider.value];if(!list)return;
  applying=true;
  const current=models.value,c=activeChat();
  const preferred=(current&&list.some(x=>x.id===current))?current:(c?.provider===provider.value?c.model:null);
  models.innerHTML='';
  for(const m of list){const o=document.createElement('option');o.value=m.id;o.textContent=m.label;models.appendChild(o)}
  if(preferred&&list.some(x=>x.id===preferred))models.value=preferred;
  applying=false;
}
provider.addEventListener('change',()=>queueMicrotask(apply));
new MutationObserver(()=>queueMicrotask(apply)).observe(models,{childList:true});
apply();
})();
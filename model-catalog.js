(()=>{
'use strict';
if(window.MCLModelCatalog)return;

// One authoritative in-app catalog. Model IDs in this catalog are the API IDs
// sent by provider-gateway.js; display/product version labels must not be used here.
const CATALOG={
  anthropic:[
    {id:'claude-fable-5',label:'Claude Fable 5',capabilities:{thinking:'adaptive'}},
    {id:'claude-opus-5',label:'Claude Opus 5',capabilities:{thinking:'adaptive'}},
    {id:'claude-sonnet-5',label:'Claude Sonnet 5',capabilities:{thinking:'adaptive'}},
    {id:'claude-sonnet-4-6',label:'Claude Sonnet 4.6',capabilities:{thinking:'adaptive'}}
  ],
  openai:[
    {id:'gpt-6-astra',label:'GPT-6 Astra'},
    {id:'gpt-5.6-sol',label:'GPT-5.6 Sol'},
    {id:'gpt-5.6-terra',label:'GPT-5.6 Terra'},
    {id:'gpt-5.6-luna',label:'GPT-5.6 Luna'}
  ],
  google:[
    {id:'gemini-3.8-flash',label:'Gemini 3.8 Flash'},
    {id:'gemini-3.7-flash',label:'Gemini 3.7 Flash'},
    {id:'gemini-3.1-pro-preview',label:'Gemini 3.1 Pro Preview'}
  ]
};
function list(provider){return(CATALOG[provider]||[]).map(x=>JSON.parse(JSON.stringify(x)))}
function get(provider,id){const x=(CATALOG[provider]||[]).find(m=>m.id===id);return x?JSON.parse(JSON.stringify(x)):null}
window.MCLModelCatalog={version:'0.2.0',list,get};
})();
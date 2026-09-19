(()=>{
'use strict';
if(window.__mclAiTraceV100)return;window.__mclAiTraceV100=true;
const KEY='music-chat-lab.ai-trace.v1',MAX=40,clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function write(x){try{localStorage.setItem(KEY,JSON.stringify(x.slice(-MAX)))}catch(_){}}
function chatId(){return localStorage.getItem('music-chat-lab.active-chat.v1')||'default'}
function provider(url){url=String(url||'');if(url.includes('api.anthropic.com/v1/messages'))return'anthropic';if(url.includes('api.openai.com/v1/responses'))return'openai';if(url.includes('generativelanguage.googleapis.com/'))return'google';return'unknown'}
function safeUrl(url){try{const u=new URL(String(url));for(const k of['key','api_key','apikey','token','access_token'])if(u.searchParams.has(k))u.searchParams.set(k,'[REDACTED]');return u.toString()}catch{return String(url).replace(/([?&](?:key|api_key|apikey|token|access_token)=)[^&]*/gi,'$1[REDACTED]')}}
function safeHeaders(h){const out={};try{new Headers(h||{}).forEach((v,k)=>out[k]=/authorization|api[-_]?key|x-api-key/i.test(k)?'[REDACTED]':v)}catch{}return out}
function add(e){const a=read();a.push(e);write(a);return e.id}
function update(id,patch){const a=read(),i=a.findIndex(x=>x.id===id);if(i<0)return;a[i]={...a[i],...patch};write(a)}
function request(stage,url,init,body){const id='call-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);add({id,chatId:chatId(),stage:String(stage||'provider_call'),requestedAt:new Date().toISOString(),provider:provider(url),url:safeUrl(url),method:String(init?.method||'POST'),headers:safeHeaders(init?.headers),body:clone(body)});return id}
function response(id,res,raw){update(id,{receivedAt:new Date().toISOString(),status:res?.status??null,statusText:res?.statusText??'',responseHeaders:safeHeaders(res?.headers),rawResponse:String(raw??'')})}
window.MCLAiTrace={version:'1.0.0',request,response,snapshot:()=>clone(read()),clear:()=>write([])};
})();
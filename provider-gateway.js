(()=>{
'use strict';
if(window.MCLProviderGateway)return;

const ENDPOINTS={
  anthropic:'https://api.anthropic.com/v1/messages',
  openai:'https://api.openai.com/v1/responses',
  google:model=>`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
};

function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
function apiErrorMessage(d,status){return d?.error?.message||d?.message||`API-Fehler ${status}`}

function requestMessages(messages){
  return (Array.isArray(messages)?messages:[]).filter(m=>m&&(m.role==='user'||m.role==='assistant')).map(m=>({role:m.role,text:String(m.text||'')}));
}

function buildAnthropic(req){
  const body={model:req.model,max_tokens:Number(req.maxOutputTokens)||4096,messages:requestMessages(req.messages).map(m=>({role:m.role,content:m.text}))};
  if(req.system)body.system=String(req.system);
  if(req.technical?.thinking)body.thinking=clone(req.technical.thinking);
  if(req.technical?.outputConfig)body.output_config=clone(req.technical.outputConfig);
  return body;
}
function buildOpenAI(req){
  const input=requestMessages(req.messages).map(m=>({role:m.role,content:m.text}));
  if(req.system)input.unshift({role:'system',content:String(req.system)});
  return{model:req.model,input,store:false};
}
function buildGoogle(req){
  const body={contents:requestMessages(req.messages).map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.text}]}))};
  if(req.system)body.systemInstruction={parts:[{text:String(req.system)}]};
  if(req.maxOutputTokens)body.generationConfig={maxOutputTokens:Number(req.maxOutputTokens)};
  return body;
}
function build(provider,req){
  if(provider==='anthropic')return buildAnthropic(req);
  if(provider==='openai')return buildOpenAI(req);
  if(provider==='google')return buildGoogle(req);
  throw new Error('Unbekannter KI-Anbieter.');
}
function endpoint(provider,model){return provider==='google'?ENDPOINTS.google(model):ENDPOINTS[provider]}
function headers(provider,key){
  if(provider==='anthropic')return{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'};
  if(provider==='openai')return{'content-type':'application/json','authorization':`Bearer ${key}`};
  if(provider==='google')return{'content-type':'application/json','x-goog-api-key':key};
  throw new Error('Unbekannter KI-Anbieter.');
}
function responseText(provider,d){
  if(provider==='anthropic')return(d?.content||[]).filter(p=>p?.type==='text').map(p=>p.text||'').join('\n').trim();
  if(provider==='openai'){
    const direct=typeof d?.output_text==='string'?d.output_text:'';
    const nested=(d?.output||[]).flatMap(i=>i?.content||[]).filter(p=>p?.type==='output_text'||p?.type==='text').map(p=>p.text||'').join('\n');
    return(direct||nested).trim();
  }
  if(provider==='google')return(d?.candidates?.[0]?.content?.parts||[]).map(p=>p?.text||'').join('\n').trim();
  return'';
}
function usage(provider,d){
  if(provider==='openai'){const u=d?.usage||{};return{input:Number(u.input_tokens)||0,cached:Number(u.input_tokens_details?.cached_tokens)||0,output:Number(u.output_tokens)||0,reasoning:Number(u.output_tokens_details?.reasoning_tokens)||0}}
  if(provider==='anthropic'){const u=d?.usage||{};return{input:Number(u.input_tokens)||0,cached:Number(u.cache_read_input_tokens)||0,cacheWrite:Number(u.cache_creation_input_tokens)||0,output:Number(u.output_tokens)||0,reasoning:0}}
  if(provider==='google'){const u=d?.usageMetadata||{};return{input:Number(u.promptTokenCount)||0,cached:Number(u.cachedContentTokenCount)||0,output:Number(u.candidatesTokenCount)||0,reasoning:Number(u.thoughtsTokenCount)||0}}
  return{};
}

async function request(req){
  const provider=String(req?.provider||'');
  const key=String(req?.apiKey||'');
  if(!key)throw new Error('API-Schlüssel fehlt.');
  const body=build(provider,req);
  const response=await fetch(endpoint(provider,req.model),{method:'POST',headers:headers(provider,key),body:JSON.stringify(body),signal:req.signal});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(apiErrorMessage(data,response.status));
  const text=responseText(provider,data);
  if(!text)throw new Error('Der Anbieter hat keine Textantwort geliefert.');
  return{provider,model:req.model,text,usage:usage(provider,data),raw:data};
}

window.MCLProviderGateway={version:'0.1.0',build,request,responseText,usage};
})();

(()=>{
'use strict';
if(window.__mclSessionOutputGuardV115)return;
window.__mclSessionOutputGuardV115=true;

// The session orchestrator deliberately preserves a larger provider limit when
// one is already present in the original request.  Put that larger limit on
// composition-capable requests before they enter the orchestrator.  This is
// especially important for Gemini: its maxOutputTokens budget also has to
// accommodate internal thinking, so a 12k budget can leave only ~3k tokens for
// a structured MCL_ACTION and truncate the closing tag.
const previousFetch=window.fetch.bind(window);

function providerFor(url){
  const u=String(url||'');
  if(u.includes('generativelanguage.googleapis.com/')&&u.includes(':generateContent'))return'google';
  if(u.includes('api.anthropic.com/v1/messages'))return'anthropic';
  return null;
}

window.fetch=async function(input,init={}){
  const url=typeof input==='string'?input:input?.url||'';
  const provider=providerFor(url);
  if(!provider||typeof init.body!=='string')return previousFetch(input,init);

  let body;
  try{body=JSON.parse(init.body)}catch{return previousFetch(input,init)}

  if(provider==='google'){
    body.generationConfig={...(body.generationConfig||{})};
    body.generationConfig.maxOutputTokens=Math.max(Number(body.generationConfig.maxOutputTokens)||0,32768);
  }else if(provider==='anthropic'){
    body.max_tokens=Math.max(Number(body.max_tokens)||0,16000);
  }

  return previousFetch(input,{...init,body:JSON.stringify(body)});
};

window.MCLSessionOutputGuard={version:'1.1.5'};
})();

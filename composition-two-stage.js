(()=>{
'use strict';
if(window.__mclTwoStageV140)return;window.__mclTwoStageV140=true;
const previousFetch=window.fetch.bind(window);
const DRAFT_HEAD='Komponiere das verlangte Stück musikalisch frei und eigenständig. Konzentriere dich ausschließlich auf musikalische Gestalt, Verlauf, Stimmen, Rhythmus, Harmonik, Artikulation und Charakter. Denke noch NICHT an MIDI-Codierung, QN-Werte, JSON oder ein technisches Ausgabeformat. Schreibe einen vollständigen, konkret ausnotierbaren musikalischen Entwurf, aus dem anschließend eine andere technische Instanz die MIDI-Daten erzeugen kann. Gib in der ersten Zeile lediglich einen kurzen passenden Werktitel als „Titel: …“ an; dies soll die musikalische Gestaltung nicht einschränken. Mache keine Erläuterung über deine Arbeitsweise.';
function providerFor(u){u=String(u||'');if(u.includes('api.anthropic.com/v1/messages'))return'anthropic';if(u.includes('api.openai.com/v1/responses'))return'openai';if(u.includes('generativelanguage.googleapis.com/')&&u.includes(':generateContent'))return'google';return null}
function textOf(x){if(typeof x==='string')return x;if(Array.isArray(x))return x.map(y=>y?.text||y?.content||'').join('');return''}
function lastUser(provider,b){if(provider==='anthropic')return textOf([...(b.messages||[])].reverse().find(x=>x?.role==='user')?.content).trim();if(provider==='openai')return textOf([...(b.input||[])].reverse().find(x=>x?.role==='user')?.content).trim();return ([...(b.contents||[])].reverse().find(x=>x?.role==='user')?.parts||[]).map(x=>x?.text||'').join('').trim()}
function draftBody(provider,b,prompt){const x=JSON.parse(JSON.stringify(b));if(provider==='anthropic'){delete x.system;x.messages=[{role:'user',content:prompt}];x.max_tokens=Math.max(8192,Number(x.max_tokens)||0)}else if(provider==='openai'){x.input=[{role:'user',content:prompt}];delete x.instructions}else{delete x.systemInstruction;x.contents=[{role:'user',parts:[{text:prompt}]}]}return x}
function responseText(provider,d){if(provider==='anthropic')return(d?.content||[]).filter(x=>x?.type==='text').map(x=>x.text||'').join('').trim();if(provider==='openai'){if(typeof d?.output_text==='string'&&d.output_text.trim())return d.output_text.trim();return(d?.output||[]).flatMap(x=>x?.content||[]).map(x=>x?.text||'').join('\n').trim()}return(d?.candidates?.[0]?.content?.parts||[]).map(x=>x?.text||'').join('\n').trim()}
function addDraft(provider,b,draft){const x=JSON.parse(JSON.stringify(b));const appendix='\n\nFERTIGER FREIER MUSIKALISCHER ENTWURF — VERBINDLICHE GRUNDLAGE DER TECHNISCHEN UMSETZUNG:\n'+draft+'\n\nÜbertrage diesen Entwurf werkgetreu in die von MusicChat verlangte MIDI-Aktion. Komponiere nicht neu, vereinfache nicht und regularisiere keine ungewöhnlichen musikalischen Entscheidungen.';if(provider==='anthropic'){const i=[...(x.messages||[])].map((m,i)=>[m,i]).reverse().find(([m])=>m?.role==='user')?.[1];if(i!=null)x.messages[i].content=textOf(x.messages[i].content)+appendix}else if(provider==='openai'){const i=[...(x.input||[])].map((m,i)=>[m,i]).reverse().find(([m])=>m?.role==='user')?.[1];if(i!=null)x.input[i].content=textOf(x.input[i].content)+appendix}else{const i=[...(x.contents||[])].map((m,i)=>[m,i]).reverse().find(([m])=>m?.role==='user')?.[1];if(i!=null)x.contents[i].parts=[{text:(x.contents[i].parts||[]).map(p=>p?.text||'').join('')+appendix}]}return x}
window.fetch=async function(input,init={}){
 const url=typeof input==='string'?input:input?.url||'',provider=providerFor(url);
 if(!provider||window.MCLRequestMode!=='compose'||typeof init.body!=='string'||init.__mclRawStage)return previousFetch(input,init);
 let body;try{body=JSON.parse(init.body)}catch{return previousFetch(input,init)}
 const task=lastUser(provider,body);if(!task)return previousFetch(input,init);
 const note=document.getElementById('composerNote');if(note)note.textContent='Komponiere …';
 const prompt=DRAFT_HEAD+'\n\nAUFTRAG:\n'+task;
 const r1=await previousFetch(input,{...init,__mclRawStage:true,body:JSON.stringify(draftBody(provider,body,prompt))});
 const d1=await r1.clone().json().catch(()=>null);if(!r1.ok||!d1)return r1;
 const draft=responseText(provider,d1);if(!draft)throw new Error('Der freie musikalische Entwurf blieb leer.');
 window.__mclLastMusicalDraft={at:new Date().toISOString(),provider,model:body.model||'',task,draft};
 if(note)note.textContent='Übertrage musikalischen Entwurf in MIDI …';
 return previousFetch(input,{...init,body:JSON.stringify(addDraft(provider,body,draft))});
};
window.MCLTwoStageV140={version:'1.4.0',lastDraft:()=>window.__mclLastMusicalDraft||null};
})();
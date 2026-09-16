const CACHE_NAME='music-chat-lab-v1.3.27';
const APP_SHELL=['./styles.css','./ui-fixes.css','./execution-mode.css','./composition-idea-field.css','./icon.svg','./manifest.webmanifest','./music-file-processing.js','./download-compat.js','./model-catalog.js','./provider-policy.js','./provider-usage.js','./provider-gateway.js','./session-request.js','./session-core.js','./action-domain.js','./request-runtime.js','./api-usage.js','./composition-engine14.js','./request-control.js','./execution-mode.js','./session-orchestrator.js','./session-output-guard.js','./player-variants.js','./midi-player.js','./midi-input-sync.js','./midi-playback-scheduler.js','./midi-context.js','./clab-document-v1.js','./composition-idea-field.js','./runtime-compat.js','./app.js','./action-consumer.js','./composition-state.js','./usage-costs.js','./chat-delete.js','./chat-titles.js','./midi-memory.js','./midi-slot-delete.js','./midi-export.js','./backup-manager.js','./ui-enhancements.js','./diagnostic-enhancer.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('music-chat-lab-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function canonicalRequest(request){const u=new URL(request.url);u.search='';return new Request(u.toString(),{method:'GET',headers:request.headers,mode:request.mode,credentials:request.credentials,redirect:request.redirect})}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url),sameOrigin=url.origin===self.location.origin,isNavigation=event.request.mode==='navigate';
  if(!sameOrigin)return;
  if(isNavigation){
    // HTML navigation stays on the network. A broken/stale worker must never be able
    // to keep serving an obsolete index.html and trap the application on one build.
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone(),key=canonicalRequest(event.request);event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(key,copy)))}
    return response;
  }).catch(async()=>{
    const cache=await caches.open(CACHE_NAME),cached=await cache.match(canonicalRequest(event.request));
    return cached||Response.error();
  }));
});
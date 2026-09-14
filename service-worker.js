const CACHE_NAME = "music-chat-lab-v1-3-14-clean";
const APP_SHELL = [
  "./","./index.html",
  "./styles.css?v=1.0.20","./ui-fixes.css?v=1.1.18","./execution-mode.css?v=1.0.0","./composition-idea-field.css?v=1.0.0",
  "./music-file-processing.js?v=1.0.20","./download-compat.js?v=1.0.20","./api-usage.js?v=1.1.16","./composition-engine14.js?v=1.1.5","./request-control.js?v=1.1.35",
  "./execution-mode.js?v=1.0.0","./session-orchestrator.js?v=1.0.0","./player-variants.js?v=1.0.0","./midi-player.js?v=1.3.5","./midi-input-sync.js?v=1.1.10",
  "./midi-playback-scheduler.js?v=1.0.23","./midi-context.js?v=1.1.20","./clab-document-v1.js?v=1.3.12","./composition-idea-field.js?v=1.0.0","./runtime-compat.js?v=1.1.0",
  "./app.js?v=1.1.13","./composition-state.js?v=1.3.14","./usage-costs.js?v=1.1.18","./chat-delete.js?v=1.0.20","./chat-titles.js?v=1.0.20",
  "./midi-memory.js?v=1.1.8","./midi-slot-delete.js?v=1.0.20","./midi-export.js?v=1.0.20","./backup-manager.js?v=1.1.31","./ui-enhancements.js?v=1.1.31","./diagnostic-enhancer.js?v=1.1.31",
  "./manifest.webmanifest?v=1.0.20","./icon.svg?v=1.0.20"
];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    const fresh=new Request(event.request,{cache:"no-store"});
    event.respondWith(fetch(fresh).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));return response;}).catch(()=>caches.match("./index.html")||caches.match("./")));
    return;
  }
  event.respondWith(fetch(new Request(event.request,{cache:"no-store"})).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request)));
});

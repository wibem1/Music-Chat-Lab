const CACHE_NAME = 'music-chat-lab-v1.4.26';
const APP_SHELL = [
  './', './index.html', './styles.css', './app.js', './settings-store.js', './state-vault.js', './music-file-processing.js',
  './midi-player.js', './midi-export.js', './midi-context.js', './midi-memory.js',
  './composition-engine14.js', './composition-state.js', './session-orchestrator.js',
  './session-output-guard.js', './request-control.js', './runtime-compat.js',
  './api-usage.js', './usage-costs.js', './backup-manager.js', './chat-delete.js',
  './chat-titles.js', './clab-document-v1.js', './composition-idea-field.css',
  './composition-idea-field.js', './diagnostic-enhancer.js', './download-compat.js',
  './execution-mode.css', './execution-mode.js', './midi-input-sync.js',
  './midi-playback-scheduler.js', './midi-slot-delete.js', './player-variants.js',
  './ui-enhancements.js', './ui-fixes.css', './icon.svg', './musicchat-icon-180.png', './musicchat-icon-192.png', './musicchat-icon-512.png', './manifest.webmanifest',
  './model-extension.js', './composition-two-stage.js', './input-runtime-guard.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
const CACHE_NAME = 'music-chat-lab-v1.3.18';
const APP_SHELL = [
  './index.html', './styles.css', './app.js', './music-file-processing.js',
  './midi-player.js', './midi-export.js', './midi-context.js', './midi-memory.js',
  './composition-engine14.js', './composition-state.js', './session-orchestrator.js',
  './session-output-guard.js', './request-control.js', './runtime-compat.js',
  './api-usage.js', './usage-costs.js', './backup-manager.js', './chat-delete.js',
  './chat-titles.js', './clab-document-v1.js', './composition-idea-field.css',
  './composition-idea-field.js', './diagnostic-enhancer.js', './download-compat.js',
  './execution-mode.css', './execution-mode.js', './midi-input-sync.js',
  './midi-playback-scheduler.js', './midi-slot-delete.js', './player-variants.js',
  './ui-enhancements.js', './ui-fixes.css', './icon.svg', './manifest.webmanifest',
  './model-extension.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(APP_SHELL.map(url => cache.add(new Request(url, {cache:'reload'}))))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'MCL_SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(new Request(event.request, {cache:'no-store'}))
        .then(response => {
          if (response?.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(new Request(event.request, {cache:'no-cache'}))
      .then(response => {
        if (response?.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
(()=>{
'use strict';
if(window.__mclDownloadCompatV1021)return;
window.__mclDownloadCompatV1021=true;

// Blob-Downloads werden absichtlich nicht mehr global abgefangen.
// Der frühere Override von HTMLAnchorElement.prototype.click wandelte jeden
// Blob asynchron in eine Data-URL um. Auf iPad/PWA führte dieser künstliche
// zweite Downloadpfad zu einem abweichenden Seiten-/Speicher-Lebenszyklus.
// Alle Exporte benutzen wieder den nativen <a download>-Pfad des Browsers.
window.MCLDownloadCompat={version:'1.0.21',mode:'native'};
})();

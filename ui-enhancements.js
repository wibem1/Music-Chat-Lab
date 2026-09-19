(()=>{
'use strict';
const TABLET_BREAKPOINT=1180;
const sidebar=document.getElementById('sidebar');
const closeButton=document.getElementById('sidebarCloseButton');
const backdrop=document.getElementById('sidebarBackdrop');
const infoButton=document.getElementById('infoButton');
const infoDialog=document.getElementById('infoDialog');
const infoClose=document.getElementById('infoCloseButton');
function closeSidebar(){sidebar?.classList.remove('open');document.body.classList.remove('sidebar-open')}
closeButton?.addEventListener('click',closeSidebar);
backdrop?.addEventListener('click',closeSidebar);
const menu=document.getElementById('menuButton');
menu?.addEventListener('click',()=>{requestAnimationFrame(()=>{sidebar?.classList.contains('open')?document.body.classList.add('sidebar-open'):document.body.classList.remove('sidebar-open')})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSidebar();if(infoDialog?.open)infoDialog.close()}});
window.addEventListener('resize',()=>{if(window.innerWidth>TABLET_BREAKPOINT)closeSidebar()});
infoButton?.addEventListener('click',()=>{try{infoDialog?.showModal()}catch(_){infoDialog?.setAttribute('open','')}});
infoClose?.addEventListener('click',()=>{try{infoDialog?.close()}catch(_){infoDialog?.removeAttribute('open')}});
infoDialog?.addEventListener('click',e=>{if(e.target===infoDialog){try{infoDialog.close()}catch(_){infoDialog.removeAttribute('open')}}});
function fallbackWelcome(){const messages=document.getElementById('messages');if(!messages||messages.querySelector('.message-row,.welcome'))return;const w=document.createElement('div');w.className='welcome';w.innerHTML='<div class="welcome-logo">♪</div><h1>MusicChatLab</h1><p>Chatte mit Claude, Gemini und OpenAI und arbeite mit MIDI- und MusicXML-Dateien.</p>';messages.appendChild(w)}
function recoverChatShell(){const messages=document.getElementById('messages');if(!messages)return;if(messages.children.length===0){const list=document.getElementById('chatList'),n=document.getElementById('newChatButton');if(list&&n&&list.children.length===0){try{n.click()}catch(_){}}setTimeout(fallbackWelcome,80)}}
function bindClabToolbar(){return !!(document.getElementById('clabSaveBtn')&&window.MCLCLAB)}
function recoverClab(){if(bindClabToolbar())return;if(window.__mclClabRecoveryLoading)return;window.__mclClabRecoveryLoading=true;const s=document.createElement('script');s.src='clab-document-v1.js?v=1.3.15-recovery';s.onload=()=>{window.__mclClabRecoveryLoading=false;setTimeout(bindClabToolbar,20)};s.onerror=()=>{window.__mclClabRecoveryLoading=false;const n=document.getElementById('composerNote');if(n)n.textContent='CLAB-Modul konnte nicht geladen werden. Bitte die Seite neu laden.'};document.head.appendChild(s)}
function clearStaticComposerNote(){const note=document.getElementById('composerNote');if(note&&note.textContent.trim()==='MIDI und MusicXML werden lokal analysiert; API-Schlüssel bleiben auf diesem Gerät.')note.textContent=''}
function startRecovery(){clearStaticComposerNote();recoverChatShell();recoverClab();setTimeout(recoverChatShell,250);setTimeout(recoverClab,300)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startRecovery,{once:true});else startRecovery();
})();
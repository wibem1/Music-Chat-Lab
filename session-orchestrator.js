(()=>{
'use strict';
if(window.__mclSessionOrchestratorV200)return;
window.__mclSessionOrchestratorV200=true;
// Compatibility marker only. Session construction is owned by MCLSessionCore,
// protocol parsing by MCLSessionRequest, and provider transport by MCLRequestRuntime/MCLProviderGateway.
window.MCLSessionOrchestrator={version:'2.0.0',transportPatch:false,core:'MCLSessionCore',runtime:'MCLRequestRuntime'};
})();
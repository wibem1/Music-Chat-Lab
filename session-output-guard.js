(()=>{
'use strict';
if(window.__mclSessionOutputGuardV200)return;
window.__mclSessionOutputGuardV200=true;
// Token budgets are now owned by provider-policy.js and applied explicitly by request-runtime.js.
// This compatibility marker remains temporarily so older diagnostics can identify the migration.
window.MCLSessionOutputGuard={version:'2.0.0',transportPatch:false,policyOwner:'MCLProviderPolicy'};
})();
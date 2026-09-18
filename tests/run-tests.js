const {spawnSync}=require('child_process');
const path=require('path');
const tests=['model-catalog.test.js','provider-gateway.test.js','provider-policy.test.js','session-request.test.js','session-core.test.js','composition-intent.test.js','action-domain.test.js','request-runtime.test.js','request-architecture.test.js','transport-patch-inventory.test.js','release-shell.test.js'];
for(const test of tests){
  const r=spawnSync(process.execPath,[path.join(__dirname,test)],{stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
}
console.log('CONSOLIDATION_TESTS_OK');

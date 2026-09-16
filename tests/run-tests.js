const {spawnSync}=require('child_process');
const path=require('path');
const tests=['provider-gateway.test.js','session-request.test.js','request-architecture.test.js'];
for(const test of tests){
  const r=spawnSync(process.execPath,[path.join(__dirname,test)],{stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
}
console.log('CONSOLIDATION_TESTS_OK');

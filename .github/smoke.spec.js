const { test, expect } = require('@playwright/test');
test('core ui', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('[data-app-version]')).toHaveText('v1.4.28');
  await page.locator('#topSettingsButton').click();
  await expect(page.locator('#settingsDialog')).toHaveJSProperty('open',true);
  await page.locator('#settingsDialog .dialog-close').click();
  await page.locator('#newChatButton').click();
  await expect(page.locator('#chatList .chat-item')).toHaveCount(2);
  await page.locator('#providerSelect').selectOption('openai');
  await expect(page.locator('#modelSelect option')).not.toHaveCount(0);
  await expect(page.locator('#modelSelect')).toHaveValue(/.+/);
  await expect(page.locator('#adoptIdeaButton')).toBeDisabled();
  await page.evaluate(()=>window.MCLExplicitModeV135.storeProposal('Neue Idee: bewegter Mittelteil, kontrastierende Begleitung.'));
  await expect(page.locator('#adoptIdeaButton')).toBeEnabled();
  await page.locator('#adoptIdeaButton').click();
  await expect(page.locator('#compositionIdeaInput')).toHaveValue('Neue Idee: bewegter Mittelteil, kontrastierende Begleitung.');
  await page.locator('#compositionHistoryButton').click();
  await expect(page.locator('#compositionHistoryDialog')).toHaveJSProperty('open',true);
  await expect(page.locator('#compositionHistoryList')).toContainText('noch keine gespeicherte Kompositionsfassung');
  const provenance = await page.evaluate(() => {
    const source={slot:1,name:'Quelle',score:{ti:'Quelle',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,60,80,0,1]],ct:[]}]}};
    const fresh={ti:'Neu',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,64,80,0,1]],ct:[]}]};
    const withSummary=window.MCLSessionV138.materializeAction({type:'new_score',summary:'Aktuelle Fassung',score:fresh},[source],'');
    const withoutSummary=window.MCLSessionV138.materializeAction({type:'new_score',score:fresh},[source],'');
    return {a:withSummary.sm,b:withoutSummary.sm};
  });
  expect(provenance).toEqual({a:'Aktuelle Fassung',b:'Neu komponierte MIDI-Fassung.'});
  const validation = await page.evaluate(() => {
    const broken={ti:'Test',bpm:63,ts:{n:4,d:4},k:'Em',tr:[{nm:'Piano',nt:[[0,4,60,80,0,1],[32,4,64,80,0,1]]}]};
    const good={ti:'Test',bpm:88,ts:{n:4,d:4},k:'a-Moll',tr:[{nm:'Piano',nt:[[0,4,60,80,0,1],[4,4,64,80,0,1],[8,4,67,80,0,1],[12,4,65,80,0,1],[16,4,60,80,0,1],[20,4,64,80,0,1],[24,4,67,80,0,1],[28,4,65,80,0,1],[32,4,60,80,0,1],[36,4,64,80,0,1],[40,4,67,80,0,1],[44,4,65,80,0,1],[48,4,60,80,0,1],[52,4,64,80,0,1],[56,4,67,80,0,1],[60,4,65,80,0,1],[64,4,60,80,0,1],[68,4,64,80,0,1],[72,4,67,80,0,1],[76,4,65,80,0,1],[80,4,60,80,0,1],[84,4,64,80,0,1],[88,4,67,80,0,1],[92,4,65,80,0,1]]}]};
    return {broken:window.MCLSessionV138.scoreIssues(broken,{bpm:88,bars:24,key:'a-Moll'}),good:window.MCLSessionV138.scoreIssues(good,{bpm:88,bars:24,key:'a-Moll'})};
  });
  expect(validation.broken.some(x=>x.includes('88 BPM'))).toBeTruthy();
  expect(validation.broken.some(x=>x.includes('24 Takte'))).toBeTruthy();
  expect(validation.good).toEqual([]);
  const ideaState = await page.evaluate(() => {
    window.MCLCompositionIdea.set('Klavierstück in a-Moll, 56 Takte, 88 BPM.',{generated:false,source:'test'});
    const c=window.MCLSessionV138.explicitConstraints();
    const score={ti:'Frei',bpm:66,ts:{n:4,d:4},k:'e-Moll',tr:[{nm:'Piano',nt:[[0,4,60,80,0,1],[4,4,64,80,0,1]]}]};
    return {c,issues:window.MCLSessionV138.scoreIssues(score,c),reason:window.MCLSessionV138.deviationNote({deviationReason:'Die langsamere Bewegung trägt den Spannungsbogen.'},score)};
  });
  expect(ideaState.c.bars).toBe(56);
  expect(ideaState.c.bpm).toBe(88);
  expect(ideaState.c.key.toLowerCase()).toContain('moll');
  expect(ideaState.issues.some(x=>x.includes('56 Takte'))).toBeTruthy();
  expect(ideaState.reason).toContain('Spannungsbogen');
  const keyEquivalence = await page.evaluate(() => {
    const f={ti:'Barcarole',bpm:66,ts:{n:6,d:8},k:'F major',tr:[{nm:'Piano',nt:[[0,1,60,80,0,1],[1,1,62,80,0,1]]}]};
    return window.MCLSessionV138.scoreIssues(f,{bpm:66,key:'F-Dur'});
  });
  expect(keyEquivalence).toEqual([]);
  const traceSafety=await page.evaluate(()=>{
    const id=window.MCLAiTrace.request('test','https://example.test/api?key=secret',{headers:{Authorization:'Bearer secret','x-api-key':'secret','Content-Type':'application/json'}},{model:'test',messages:[{role:'user',content:'vollständiger Auftrag'}]});
    window.MCLAiTrace.response(id,{status:200,statusText:'OK',headers:new Headers({'content-type':'application/json'})},'{"answer":"vollständige Antwort"}');
    return window.MCLAiTrace.snapshot().at(-1);
  });
  expect(traceSafety.url).not.toContain('secret');
  expect(traceSafety.headers.authorization).toBe('[REDACTED]');
  expect(traceSafety.headers['x-api-key']).toBe('[REDACTED]');
  expect(JSON.stringify(traceSafety.body)).toContain('vollständiger Auftrag');
  expect(traceSafety.rawResponse).toContain('vollständige Antwort');
  expect(errors).toEqual([]);
});

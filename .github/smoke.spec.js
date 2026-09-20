const { test, expect } = require('@playwright/test');
test('core ui', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('[data-app-version]')).toHaveText('v1.5.1');
  await page.locator('#topSettingsButton').click();
  await expect(page.locator('#settingsDialog')).toHaveJSProperty('open',true);
  await page.locator('#settingsDialog .dialog-close').click();
  await page.locator('#compositionIdeaInput').fill('ALTE IDEE DARF NICHT ÜBERTRAGEN WERDEN');
  await page.locator('#newChatButton').click();
  await expect(page.locator('#chatList .chat-item')).toHaveCount(2);
  await expect(page.locator('#compositionIdeaInput')).toHaveValue('');
  await page.locator('#providerSelect').selectOption('openai');
  await expect(page.locator('#modelSelect option')).not.toHaveCount(0);
  await expect(page.locator('#modelSelect')).toHaveValue(/.+/);
  await expect(page.locator('#adoptIdeaButton')).toBeDisabled();
  const assignmentBox=page.locator('#compositionIdeaInput');
  expect(await assignmentBox.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(100);
  await expect(page.locator('#clabSaveBtn')).toBeVisible();
  await expect(page.locator('#clabOpenBtn')).toHaveCount(0);
  await expect(page.locator('#midiSlotFileInput')).toHaveAttribute('accept',/\.clab/);
  await page.locator('#composeButton').click();
  await expect(page.locator('#composerNote')).toHaveText('Bitte Kompositionsauftrag eintragen.');
  await expect(page.locator('#messageInput')).toHaveValue('');
  const loadedAssignment=await page.evaluate(()=>{const doc={format:'composition-lab-document',version:1,title:'Geladenes Stück',assignment:'Variiere das Thema frei für Klavier.',concept:'Beschreibung des Ergebnisses',score:{ti:'Geladenes Stück',bpm:80,ts:{n:4,d:4},k:'C major',sm:'Beschreibung des Ergebnisses',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,60,80,0,1]],ct:[]}]}};window.MCLCLAB.applyDocument(doc,'test.clab');return document.getElementById('compositionIdeaInput').value});
  expect(loadedAssignment).toBe('Variiere das Thema frei für Klavier.');
  await expect(page.locator('#compositionDescriptionDetails')).not.toHaveAttribute('open','');
  await page.locator('#compositionDescriptionDetails summary').click();
  await expect(page.locator('#compositionDescriptionText')).toHaveText('Beschreibung des Ergebnisses');
  const clabSeparation=await page.evaluate(()=>{const d=window.MCLCLAB.makeDocument();return {assignment:d.assignment,concept:d.concept,scoreSummary:d.score.sm}});
  expect(clabSeparation).toEqual({assignment:'Variiere das Thema frei für Klavier.',concept:'Beschreibung des Ergebnisses',scoreSummary:'Beschreibung des Ergebnisses'});
  await page.evaluate(()=>window.MCLCompositionIdea.set('Eigener Auftrag',{generated:false,source:'test'}));
  await page.locator('.mcl-midi-slot').first().click();
  await expect(page.locator('#compositionIdeaInput')).toHaveValue('Eigener Auftrag');
  await page.evaluate(()=>window.MCLExplicitModeV139.storeProposal('Neue Idee: bewegter Mittelteil, kontrastierende Begleitung.'));
  await expect(page.locator('#adoptIdeaButton')).toBeEnabled();
  await page.locator('#adoptIdeaButton').click();
  await expect(page.locator('#compositionIdeaInput')).toHaveValue('Neue Idee: bewegter Mittelteil, kontrastierende Begleitung.');
  await page.locator('#compositionHistoryButton').click();
  await expect(page.locator('#compositionHistoryDialog')).toHaveJSProperty('open',true);
  await expect(page.locator('#compositionHistoryList')).toContainText('noch keine gespeicherte Kompositionsfassung');
  const minimalEngine = await page.evaluate(() => {
    const api=window.MCLSessionV145;
    const claudeDraft=api.minimalStageBody('anthropic',{model:'claude-sonnet-5',max_tokens:4096},'ENTWURF','musical_draft');
    const claudeMidi=api.minimalStageBody('anthropic',{model:'claude-sonnet-5',max_tokens:4096},'MIDI','midi_translation');
    const openaiDraft=api.minimalStageBody('openai',{model:'gpt-5.6'},'ENTWURF','musical_draft');
    const googleDraft=api.minimalStageBody('google',{model:'gemini-3.1-pro-preview'},'ENTWURF','musical_draft');
    return {draftHead:api.MINIMAL_DRAFT_HEAD,technical:api.MINIMAL_TECHNICAL_CONTRACT,claudeDraft,claudeMidi,openaiDraft,googleDraft};
  });
  expect(minimalEngine.draftHead).toContain('Komponiere das verlangte Stück musikalisch frei und eigenständig.');
  expect(minimalEngine.draftHead).toContain('Denke noch NICHT an MIDI-Codierung');
  expect(minimalEngine.draftHead).not.toContain('ABC');
  expect(minimalEngine.technical).toContain('Antworte ausschließlich mit validem JSON');
  expect(minimalEngine.technical).toContain('"notes": [[StartBeat, DauerInBeats, MIDIPitch, Velocity], ...]');
  expect(minimalEngine.claudeDraft.max_tokens).toBe(32768);
  expect(minimalEngine.claudeDraft.thinking).toBeUndefined();
  expect(minimalEngine.claudeMidi.thinking).toEqual({type:'disabled'});
  expect(minimalEngine.openaiDraft.store).toBe(false);
  expect(minimalEngine.googleDraft.contents[0].parts[0].text).toBe('ENTWURF');
  const ideaStage=await page.evaluate(()=>window.MCLSessionV145.minimalStageBody('anthropic',{model:'claude-sonnet-5'},'IDEE','composition_idea_afterwards'));
  expect(ideaStage.max_tokens).toBe(32768);
  expect(ideaStage.thinking).toBeUndefined();
  expect(ideaStage.messages[0].content).toBe('IDEE');
  const ideaContract=await page.evaluate(()=>({
    chatDirective:window.MCLExplicitModeV139.directive('chat',''),
    noRef:window.MCLSessionV143.referencesWorkbench('Komponiere ein Klavierstück.',[{slot:1,name:'Stilles Wiegen',score:{ti:'Stilles Wiegen'}}]),
    slotRef:window.MCLSessionV143.referencesWorkbench('Überarbeite Stück 1.',[{slot:1,name:'Stilles Wiegen',score:{ti:'Stilles Wiegen'}}]),
    nameRef:window.MCLSessionV143.referencesWorkbench('Überarbeite Stilles Wiegen.',[{slot:1,name:'Stilles Wiegen',score:{ti:'Stilles Wiegen'}}])
  }));
  expect(ideaContract.chatDirective).toContain('als Kompositionsauftrag übernommen werden soll');
  expect(ideaContract.chatDirective).toContain('<MCL_ADOPT_CONCEPT/>');
  expect(ideaContract.noRef).toBeFalsy();
  expect(ideaContract.slotRef).toBeTruthy();
  expect(ideaContract.nameRef).toBeTruthy();
  const provenance = await page.evaluate(() => {
    const source={slot:1,name:'Quelle',score:{ti:'Quelle',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,60,80,0,1]],ct:[]}]}};
    const fresh={ti:'Neu',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,64,80,0,1]],ct:[]}]};
    const withSummary=window.MCLSessionV143.materializeAction({type:'new_score',summary:'Aktuelle Fassung',score:fresh},[source],'');
    const withoutSummary=window.MCLSessionV143.materializeAction({type:'new_score',score:fresh},[source],'');
    return {a:withSummary.sm,b:withoutSummary.sm};
  });
  expect(provenance).toEqual({a:'Aktuelle Fassung',b:'Neu komponierte MIDI-Fassung.'});
  const validation = await page.evaluate(() => {
    const good={ti:'Frei',bpm:66,ts:{n:6,d:8},k:'e-Moll',tr:[{nm:'Piano',nt:[[0,1,60,80,0,1],[1,1,64,72,0,1]]}]};
    const different={ti:'Frei',bpm:120,ts:{n:3,d:4},k:'Des-Dur',tr:[{nm:'Piano',nt:[[0,1,61,80,0,1],[1,2,68,90,0,1]]}]};
    const badPitch={ti:'Defekt',bpm:66,ts:{n:4,d:4},tr:[{nm:'Piano',nt:[[0,1,200,80,0,1]]}]};
    const badDuration={ti:'Defekt',bpm:66,ts:{n:4,d:4},tr:[{nm:'Piano',nt:[[0,0,60,80,0,1]]}]};
    return {good:window.MCLSessionV143.scoreIssues(good),different:window.MCLSessionV143.scoreIssues(different),badPitch:window.MCLSessionV143.scoreIssues(badPitch),badDuration:window.MCLSessionV143.scoreIssues(badDuration)};
  });
  expect(validation.good).toEqual([]);
  expect(validation.different).toEqual([]);
  expect(validation.badPitch.some(x=>x.includes('ungültige Note'))).toBeTruthy();
  expect(validation.badDuration.some(x=>x.includes('ungültige Note'))).toBeTruthy();
  const restPlaceholder = await page.evaluate(() => {
    const raw={title:'Pause',bpm:66,timeSignature:[4,4],tracks:[{name:'Piano',program:0,channel:0,notes:[[0,1,60,80],[1,0,0,0],[2,1,64,72]]}]};
    const score=window.MCLSessionV145.minimalToMclScore(raw,'Test');
    return {notes:score.tr[0].nt,issues:window.MCLSessionV145.scoreIssues(score)};
  });
  expect(restPlaceholder.notes).toHaveLength(2);
  expect(restPlaceholder.notes.map(n=>n[2])).toEqual([60,64]);
  expect(restPlaceholder.issues).toEqual([]);
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
  const traceIsolation=await page.evaluate(()=>{
    const current=localStorage.getItem('music-chat-lab.active-chat.v1');
    const all=window.MCLAiTrace.snapshot();
    return {current,all:all.length,currentOnly:window.MCLAiTrace.snapshotCurrentChat().every(x=>x.chatId===current)};
  });
  expect(traceIsolation.currentOnly).toBeTruthy();
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBeTruthy();
  expect(await assignmentBox.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(100);
  expect(errors).toEqual([]);
});

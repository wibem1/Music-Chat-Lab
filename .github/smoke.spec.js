const { test, expect } = require('@playwright/test');
test('core ui', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('[data-app-version]')).toHaveText('v1.9.0');
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
  await expect(page.locator('#compositionDescriptionText')).toContainText('Beschreibung des Ergebnisses');
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
  await expect(page.locator('#infoDialog')).toContainText('Composition Engine 2.1');
  await expect(page.locator('#infoDialog')).toContainText('Jetzt zu testen');
  const sharedEngine = await page.evaluate(() => {
    const api=window.CompositionEngine;
    const snap={visibleTask:'Komponiere ein Klavierstück.',provider:'anthropic',model:'claude-sonnet-5'};
    const prompts=api.createPrompts(snap,'ENTWURF');
    const claudeDraft=api.makeRequest('anthropic','claude-sonnet-5',prompts.musicalDraft,'composition.imagination');
    const claudeScore=api.makeRequest('anthropic','claude-sonnet-5',prompts.midiTranslation,'composition.score');
    const openaiDraft=api.makeRequest('openai','gpt-5.6',prompts.musicalDraft,'composition.imagination');
    const googleDraft=api.makeRequest('google','gemini-3.1-pro-preview',prompts.musicalDraft,'composition.imagination');
    return {name:api.name,version:api.version,technical:api.TECHNICAL_CONTRACT,prompts,claudeDraft,claudeScore,openaiDraft,googleDraft};
  });
  expect(sharedEngine.name).toBe('Composition Engine');
  expect(sharedEngine.version).toBe('2.1.0');
  expect(await page.evaluate(() => window.MCLSessionV145.version)).toBe('1.5.0');
  expect(sharedEngine.prompts.musicalDraft).toContain('Komponiere das verlangte Stück musikalisch frei und eigenständig');
  expect(sharedEngine.prompts.musicalDraft).toContain('Denke noch NICHT an MIDI-Codierung');
  expect(sharedEngine.technical).toContain('Nur valides JSON');
  expect(sharedEngine.technical).toContain('Jede klingende Note des Entwurfs genau einmal ausgeben');
  expect(sharedEngine.claudeDraft.body.max_tokens).toBe(32768);
  expect(sharedEngine.claudeDraft.body.messages[0].content).toContain('Komponiere das verlangte Stück');
  expect(sharedEngine.claudeScore.body.messages[0].content.toLowerCase()).toContain('keine neukomposition');
  expect(sharedEngine.openaiDraft.body.store).toBe(false);
  expect(sharedEngine.googleDraft.body.contents[0].parts[0].text).toContain('Komponiere das verlangte Stück');
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
  expect(await page.locator('.mcl-player-row').count()).toBe(3);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBeTruthy();
  expect(await assignmentBox.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(100);
  const uiSizing=await page.evaluate(()=>({chat:parseFloat(getComputedStyle(document.querySelector('.mcl-chat-section h2')).fontSize),assignment:parseFloat(getComputedStyle(document.querySelector('.composition-idea-header label')).fontSize),description:parseFloat(getComputedStyle(document.querySelector('.composition-description summary')).fontSize),desk:parseFloat(getComputedStyle(document.querySelector('.composition-workbar strong')).fontSize),playerButton:document.querySelector('#mainMidiPlay').getBoundingClientRect().height}));
  expect(uiSizing.assignment).toBe(uiSizing.chat); expect(uiSizing.description).toBe(uiSizing.chat); expect(uiSizing.desk).toBe(uiSizing.chat); expect(uiSizing.playerButton).toBeGreaterThanOrEqual(46);
  expect(errors).toEqual([]);
});

test('central composition architecture guard',async({page})=>{await page.goto('http://127.0.0.1:4173/index.html');const engine=await page.evaluate(()=>({version:window.CompositionEngine?.version,compose:typeof window.CompositionEngine?.compose,request:typeof window.CompositionEngine?.makeRequest}));expect(engine.compose).toBe('function');expect(engine.request).toBe('function');expect(engine.version).toBeTruthy();});

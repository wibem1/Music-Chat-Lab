const { test, expect } = require('@playwright/test');
test('core ui', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('[data-app-version]')).toHaveText('v1.4.20');
  await page.locator('#topSettingsButton').click();
  await expect(page.locator('#settingsDialog')).toHaveJSProperty('open',true);
  await page.locator('#settingsDialog .dialog-close').click();
  await page.locator('#newChatButton').click();
  await expect(page.locator('#chatList .chat-item')).toHaveCount(2);
  await page.locator('#providerSelect').selectOption('openai');
  await expect(page.locator('#modelSelect option')).not.toHaveCount(0);
  await expect(page.locator('#modelSelect')).toHaveValue(/.+/);
  await page.locator('#compositionHistoryButton').click();
  await expect(page.locator('#compositionHistoryDialog')).toHaveJSProperty('open',true);
  await expect(page.locator('#compositionHistoryList')).toContainText('noch keine gespeicherte Kompositionsfassung');
  const provenance = await page.evaluate(() => {
    const source={slot:1,name:'Quelle',score:{ti:'Quelle',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,60,80,0,1]],ct:[]}]}};
    const fresh={ti:'Neu',bpm:90,ts:{n:4,d:4},k:'Am',sm:'ALTE SYNTHESEBEHAUPTUNG',tr:[{nm:'Piano',ch:0,pg:0,nt:[[0,1,64,80,0,1]],ct:[]}]};
    const withSummary=window.MCLSessionV133.materializeAction({type:'new_score',summary:'Aktuelle Fassung',score:fresh},[source],'');
    const withoutSummary=window.MCLSessionV133.materializeAction({type:'new_score',score:fresh},[source],'');
    return {a:withSummary.sm,b:withoutSummary.sm};
  });
  expect(provenance).toEqual({a:'Aktuelle Fassung',b:'Neu komponierte MIDI-Fassung.'});
  expect(errors).toEqual([]);
});

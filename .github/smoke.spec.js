const { test, expect } = require('@playwright/test');
test('core ui', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('[data-app-version]')).toHaveText('v1.4.14');
  await page.locator('#topSettingsButton').click();
  await expect(page.locator('#settingsDialog')).toHaveJSProperty('open',true);
  await page.locator('#settingsDialog .dialog-close').click();
  await page.locator('#newChatButton').click();
  await expect(page.locator('#chatList .chat-item')).toHaveCount(2);
  await page.locator('#providerSelect').selectOption('openai');
  await expect(page.locator('#modelSelect option').first()).toBeVisible();
  await page.locator('#compositionHistoryButton').click();
  await expect(page.locator('#compositionHistoryDialog')).toHaveJSProperty('open',true);
  await expect(page.locator('#compositionHistoryList')).toContainText('noch keine gespeicherte Kompositionsfassung');
  expect(errors).toEqual([]);
});

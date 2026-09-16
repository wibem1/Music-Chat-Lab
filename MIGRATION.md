# MusicChatLab – Konsolidierungsmigration

## Grundsatz
Keine Big-Bang-Umschaltung und keine Veröffentlichung von Zwischenständen. Die neue Requestarchitektur wird zuerst vollständig neben dem Altpfad implementiert und mit Stubs getestet. Erst danach wird der UI-Einstieg auf den neuen Pfad umgestellt. Anschließend werden die alten Wrapper entfernt.

## Phase A – neue unabhängige Kernschicht
Status: begonnen.

- [x] Zielarchitektur dokumentiert.
- [x] Provider Gateway angelegt.
- [x] Provider-Policy angelegt.
- [x] Session-Request-Datentyp/Maschinenblock-Parser angelegt.
- [x] Request Runtime mit explizitem Abort angelegt.
- [x] nicht-invasiver Usage Recorder angelegt.
- [x] Contracttests und Architekturwächter angelegt.
- [x] CI-Workflow für Branch angelegt.

## Phase B – Session-Orchestrierung aus Fetch-Wrapper lösen
- [ ] Prompt-/Kontextaufbau aus `session-orchestrator.js` in explizite Session-Funktionen extrahieren.
- [ ] `MCL_NEED` als expliziten zweiten Runtime-Aufruf implementieren.
- [ ] `MCL_MEMORY` ohne Response-Umschreiben speichern.
- [ ] `MCL_ACTION` explizit an Domain-Schicht übergeben.
- [ ] Chat-/Komponier-Direktive aus `execution-mode.js` als Requestparameter integrieren.

## Phase C – UI auf neuen Pfad umstellen
- [ ] `sendMessage()` ruft Request Runtime statt direkte Provider-Clients auf.
- [ ] Komponiere-Button übergibt `mode=compose`, Chat `mode=chat`.
- [ ] Provider-/Modellwechsel ruft Runtime-Abort auf, ohne Fetch zu patchen.
- [ ] Usage wird aus Gateway-Ergebnis erfasst.

## Phase D – Alt-Wrapper entfernen
- [ ] `request-control.js` Transportpatch entfernen.
- [ ] `api-usage.js` Transportpatch entfernen/ersetzen.
- [ ] `session-orchestrator.js` Transportpatch entfernen.
- [ ] `execution-mode.js` Transportpatch entfernen.
- [ ] `session-output-guard.js` entfernen; Policy im Gateway.
- [ ] `composition-state.js` XHR-Promptpatch entfernen.
- [ ] direkte Provider-Clients aus `app.js` entfernen.
- [ ] `model-extension.js` in zentralen Modellkatalog integrieren.

## Phase E – vollständige Regression und erst dann Release
- [ ] alle JS-Syntaxchecks.
- [ ] alle Contracttests.
- [ ] Browser-Smoke-Test.
- [ ] Provider-Stubs: Chat + Compose für alle drei Provider.
- [ ] MIDI/CLAB/Diagnose/Backup/PWA-Regressionspfade.
- [ ] neue sichtbare Buildnummer erst für bestandenen Release Candidate.
- [ ] Deployment des RC.
- [ ] tatsächlichen Pages-Artefaktstand erneut testen.
- [ ] `DEVELOPMENT.md` aktualisieren.
- [ ] erst dann Merge nach `main` und Anwenderfreigabe.

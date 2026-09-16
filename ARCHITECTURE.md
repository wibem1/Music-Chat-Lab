# MusicChatLab – Zielarchitektur

## Zweck
Diese Datei beschreibt die verbindliche innere Architektur für die Konsolidierung. Die veröffentlichte App auf `main` bleibt während der Arbeiten unverändert. Erst ein vollständig getesteter konsolidierter Stand darf zurück nach `main`.

## Gefundene Hauptursache der Fragilität
Der Provider-Requestpfad wird derzeit von mehreren unabhängig geladenen Modulen durch Überschreiben von `window.fetch` bzw. `XMLHttpRequest.send` verändert. Dadurch hängt das Ergebnis von Script-Reihenfolge und impliziten Wrapper-Ketten ab. Eine lokale Änderung kann deshalb Chat, Komposition, Usage-Erfassung oder Provider-Kompatibilität gleichzeitig beeinflussen.

## Verbindliche Zielregel
**Genau ein Modul besitzt den Provider-Transport und den Request-Aufbau.** Andere Module dürfen Provider-Requests weder durch Überschreiben von `window.fetch` noch von `XMLHttpRequest.send` verändern.

## Zielschichten

1. **UI / Chat Controller**
   - liest Eingabe, Provider, Modell, Anhänge und Modus
   - verwaltet Chatdarstellung und lokalen Chatverlauf
   - kennt keine provider-spezifischen HTTP-Details

2. **Session / Composition Controller**
   - baut Gesprächskontext, MIDI-Arbeitstisch-Kontext und `MCL_ACTION`-Protokoll
   - entscheidet nicht über HTTP-Header oder Provider-Endpunkte
   - Chat/Komponiere ist ein expliziter Parameter des Requests, kein globaler Fetch-Patch

3. **Provider Gateway**
   - einzige Stelle für Anthropic/OpenAI/Google HTTP-Requests
   - besitzt Provider-Endpunkte, Header, Request-Body und Response-Parsing
   - besitzt provider-/modellabhängige technische Optionen (Thinking, Tokenbudget)
   - erhält AbortSignal explizit
   - liefert normalisierte Antwort + Usage zurück

4. **Domain / MIDI**
   - Score-Parsing, MCL_ACTION, MIDI-Import/-Export, Speicherplätze, Wiedergabe
   - kein Provider-Netzwerkcode

5. **Persistence / Diagnostics**
   - Chat, Einstellungen, CLAB, Usage und Diagnose
   - beobachtet normalisierte Ergebnisse bzw. explizite Events; verändert keine Requests

## Zu konsolidierende aktuelle Eingriffe
- `app.js`: enthält UI, Persistenz und drei direkte Provider-Clients zugleich.
- `request-control.js`: umschließt `window.fetch` für Abort-Kontrolle.
- `api-usage.js`: umschließt `window.fetch` und XHR zur Usage-Erfassung.
- `session-orchestrator.js`: umschließt `window.fetch`, ersetzt Provider-Bodies und verarbeitet Antworten.
- `execution-mode.js`: umschließt `window.fetch`, verändert Systemprompts und Antworten.
- `session-output-guard.js`: umschließt `window.fetch`, verändert Tokenlimits.
- `composition-state.js`: überschreibt `XMLHttpRequest.send` für einen Prompt-Zusatz.

Diese Eingriffe werden nicht durch weitere Wrapper ergänzt. Ihre notwendige Funktion wird schrittweise in die zuständige Zielschicht überführt.

## Provider-Request-Lebenszyklus nach Konsolidierung
`sendMessage()` → `buildSessionRequest()` → `providerGateway.request()` → Provider → normalisierte Antwort → Session-Auswertung → Chat/Kompositionsaktion → UI/Persistenz.

Abort, Usage, Tokenbudget und Thinking sind dabei Daten/Funktionen des Gateways und keine globalen Monkey-Patches.

## Sicherheitsregel für die Migration
Die Migration erfolgt auf `architecture-consolidation`. Jeder Schritt muss das bisherige Verhalten durch Tests absichern. Alte Wrapper werden erst entfernt, wenn ihre Funktion im neuen Pfad implementiert und getestet ist. Kein Zwischenstand wird deployed oder als Anwender-Build ausgegeben.

## Regressionstest-Matrix
Vor Merge nach `main` mindestens:
- App lädt alle lokalen JS/CSS-Ressourcen ohne Syntax-/Initialisierungsfehler.
- Neuer Chat, bestehender Chat, Verlauf öffnen/schließen.
- API-Einstellungen öffnen/speichern.
- Provider- und Modellwechsel.
- Chat-Request für Anthropic, OpenAI und Google mit Stub-Provider.
- Komponiere-Request für Anthropic, OpenAI und Google mit Stub-Provider.
- Anthropic-Modelloptionen/Thinking werden nur im Provider Gateway erzeugt.
- Abort eines laufenden Requests.
- Usage-Erfassung ohne Request-Manipulation.
- `MCL_NEED`-Nachforderung und `MCL_ACTION`-Verarbeitung.
- MIDI-Import, sechs Speicherplätze, Auswahl, Wiedergabe/Stop.
- CLAB Laden/Speichern.
- Diagnoseexport.
- Service-Worker/PWA-Grundstart.
- tatsächlicher GitHub-Pages-Artefaktstand wird nach Deployment erneut geprüft.

## Nicht verhandelbare Architektur-Invarianten
1. Kein neues Modul darf `window.fetch` oder `XMLHttpRequest.send` überschreiben.
2. Provider-spezifische Requestdetails existieren nur im Provider Gateway.
3. Modellkatalog und technische Modellfähigkeiten erhalten je eine eindeutige Quelle.
4. UI-Code verändert keine Provider-Request-Bodies.
5. Usage/Diagnose sind Beobachter normalisierter Daten, keine Transport-Wrapper.
6. Jede veröffentlichte Änderung bekommt eine neue Buildnummer und wird vor Freigabe funktional getestet.

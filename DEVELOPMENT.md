# MusicChatLab – Entwicklungsdokumentation

> **VERBINDLICHE ARBEITSREGEL:** Vor jeder zukünftigen Entwicklungsarbeit an MusicChatLab muss diese Datei vollständig gelesen werden. Danach ist zusätzlich `ARCHITECTURE.md` zu beachten. Erst dann dürfen Code, Konfiguration, Workflow, Service Worker oder andere App-Bestandteile geändert werden.

> **VERBINDLICHE FREIGABEREGEL:** Jeder neue Teststand erhält eine neue sichtbare Buildnummer. Kein Build wird zur Anwenderprüfung freigegeben, bevor Syntax, lokale Ressourcen, Initialisierung, zentrale Bedienwege und der PWA-Grundpfad technisch geprüft wurden. Commit oder Deployment allein sind kein Funktionstest. Gerätespezifische Restprüfungen müssen als solche benannt werden.

## Verbindlicher Arbeitsablauf
1. `DEVELOPMENT.md` vollständig lesen.
2. `ARCHITECTURE.md` und offene Architekturregeln berücksichtigen.
3. Ursache und zuständigen Codepfad bestimmen.
4. Änderungen in die zuständige Schicht integrieren; keine neuen Patch-Ketten.
5. Automatisierte Tests und Syntaxchecks ausführen.
6. Für einen freizugebenden Stand eine neue Buildnummer vergeben.
7. Deployment und veröffentlichten Stand prüfen.
8. Wesentliche Änderungen und Erkenntnisse hier dokumentieren.

## Entwicklungsgrundsätze
- **Eine Funktion – eine zuständige Schicht.** Keine übereinanderliegenden `fetch`-/XHR-Wrapper.
- **Eine Information – eine maßgebliche Quelle.** Versionen, Modelle und technische Providerregeln nicht mehrfach unabhängig pflegen.
- **Ursachen statt Symptome beheben.** Cache, Deployment, Laufzeit und gespeicherte Daten getrennt diagnostizieren.
- **Musikalische Freiheit erhalten.** Technisches Protokoll darf robust sein; musikalische Entscheidungen werden nicht unnötig festgeschrieben.
- **Daten erhalten.** PWA-/Cache-Reparaturen dürfen nicht leichtfertig lokale Chats oder API-Einstellungen löschen.

## Wichtige historische Erkenntnisse
- v1.3.15–v1.3.17: Mehrere Versionsquellen führten zu widersprüchlichen Anzeigen; Versionierung muss zentralisiert werden.
- v1.3.18–v1.3.20: Ein erfolgreicher Pages-Deploy garantierte keine bedienbare App. Daraus entstand die verbindliche technische Freigabeprüfung.
- v1.3.21: Eine selbst auslösende `MutationObserver`-Schleife in `model-extension.js` blockierte die gesamte Oberfläche. Seitdem müssen DOM-Patches idempotent sein. Der vollständige Script-Satz wurde in Chromium erfolgreich als Smoke-Test geladen.
- v1.3.22: Sidebar-Zustände wurden für Desktop und Mobil getrennt korrigiert.
- v1.3.23: Ein provider-spezifischer Request-Umbau in `request-control.js` zur Behebung eines Claude-Thinking-Problems verursachte eine allgemeine Chat-Regression. Die damalige Dokumentation stellte Modellannahmen zu sicher dar. Lehre: Providerfähigkeiten nur in der Provider-Schicht behandeln und Modell-/API-Annahmen vor produktiver Verwendung verifizieren.
- v1.3.24: Rücknahme des invasiven Request-Control-Umbaus. Der alte mehrfache Transport-Wrapper-Aufbau blieb jedoch grundsätzlich fragil und wurde deshalb nicht weiter gepatcht.

## v1.3.25 – Architektur-Konsolidierung
Die Requestarchitektur wurde auf dem isolierten Branch `architecture-consolidation` neu geordnet.

### Neuer Requestpfad
`app.js` → `MCLSessionCore` → `MCLRequestRuntime` → `MCLProviderGateway` → Provider → normalisierte Antwort → Maschinenblock-Auswertung → Domain/UI.

### Zuständigkeiten
- `model-catalog.js`: zentraler Modellkatalog für die App-Oberfläche.
- `provider-policy.js`: technische provider-/modellabhängige Requestoptionen und Tokenbudgets.
- `provider-gateway.js`: einzige Stelle für Provider-Endpunkte, Header, Bodies, Fetch und Response-Normalisierung.
- `session-core.js`: Gesprächskontext, Session-Gedächtnis, MIDI-Arbeitstisch, Chat-/Komponier-Direktive.
- `session-request.js`: neutraler Requestdatentyp und Parser für `MCL_ACTION`, `MCL_NEED`, `MCL_MEMORY`, `MCL_CONCEPT`.
- `request-runtime.js`: expliziter Requestlauf, Abort, Usage-Weitergabe und Maschinenblock-Verarbeitung.
- `action-domain.js`: lokale Materialisierung von `NEW_SCORE`, `REPLACE_SCORE`, `PATCH` und `MERGE`.
- `action-consumer.js`: übernimmt materialisierte Kompositionen in den MIDI-Arbeitstisch.
- `api-usage.js`/`provider-usage.js`: Usage wird beobachtet, ohne Providerrequests zu verändern.

### Entfernte Fehlerquelle
Alle globalen Überschreibungen von `window.fetch`, `XMLHttpRequest.open` und `XMLHttpRequest.send` wurden aus dem Laufzeitpfad entfernt. Der Architekturtest verlangt ab v1.3.25 ausdrücklich **null globale Transport-Patches**.

### Wiederhergestellte MIDI-Aktionsausführung
Beim Umbau wurde vor der Freigabe erkannt, dass der alte `session-orchestrator.js` neben dem Transportpatch auch die lokale Materialisierung von `MCL_ACTION` erledigt hatte. Diese Funktion durfte beim Entfernen des Wrappers nicht verloren gehen. Sie wurde deshalb als eigene Domain-Schicht (`action-domain.js`) wiederhergestellt und mit Tests für NEW_SCORE, PATCH, MERGE und Fehlerfälle abgesichert.

### PWA-Korrektur
Der Service Worker v1.3.24 cachete nackte Dateinamen, während `index.html` versionierte URLs mit Querystring lud. Im Offline-Fall konnte dadurch eine versionierte JS-Datei am Cache vorbeilaufen und fälschlich `index.html` als Fallback erhalten. v1.3.25 normalisiert lokale statische Requests auf queryfreie Cache-Keys und verwendet den HTML-Fallback ausschließlich für Navigationen.

### Automatisierte Prüfungen des Release Candidates
Der Testlauf umfasst:
- Provider-Gateway-Verträge für Anthropic/OpenAI/Google,
- Provider-Policy,
- Session-Request und Maschinenblock-Parser,
- Session-Core inklusive Chat-/Komponiermodus, Gedächtnis und MIDI-Kontext,
- MIDI-Action-Domain,
- Request-Runtime,
- Architekturwächter gegen neue Transportpatches,
- explizites Inventar mit 0 globalen Transportpatches,
- Release-Shell-Test: sichtbare Buildnummer, lokale Ressourcen vorhanden, neue Module in korrekter Reihenfolge, `app.js` ohne direkte Provider-Endpunkte, Service-Worker-Version und Offline-Strategie,
- `node --check` über alle JavaScript-Dateien.

Der GitHub-Actions-Lauf für RC v1.3.25 bestand `npm test` und sämtliche JavaScript-Syntaxchecks. Ein echter API-Aufruf mit den privaten Schlüsseln des Anwenders sowie der installierte iPad-PWA-Lebenszyklus können in CI nicht ausgeführt werden und bleiben gerätespezifische Anwenderprüfung.

## Weiter offene Konsolidierungsaufgaben
- Öffentliche/aktuelle Provider-Modell-IDs vor künftigen Modelländerungen anhand offizieller Providerdokumentation verifizieren.
- Versionsverwaltung weiter auf eine einzige technische Quelle reduzieren.
- API-Key-Persistenz und Backup-Roundtrip zusätzlich automatisiert testen.
- Vollständigen Browser-Smoke-Test dauerhaft in CI integrieren.
- `model-extension.js` vollständig durch den zentralen Modellkatalog ersetzen, sobald die aktuelle Modellliste verifiziert ist.
- `pwa-recover.html` nur als isoliertes Wartungswerkzeug behalten und nicht in normalen Updatepfad einbauen.

## Freigaberegel für v1.3.25
Nur der getestete Commit des Release Candidates darf nach `main` übernommen werden. Nach dem Pages-Deploy ist der veröffentlichte Stand erneut auf Version und Ressourcenauslieferung zu prüfen. Erst danach wird der WebApp-Link zur Anwenderprüfung genannt.
## v1.3.27 – Zweistufige Kompositionsarchitektur
Der in Composition Studio praktisch bestätigte Kompositionsweg wurde in den expliziten Komponiermodus übernommen: Stufe 1 erzeugt ausschließlich einen freien musikalischen Entwurf ohne MIDI-/Aktionsformat; Stufe 2 übersetzt diesen fertigen Entwurf werkgetreu in MCL_ACTION/MIDI. Die Übersetzungsstufe darf nicht neu komponieren, vereinfachen oder rhythmisch regularisieren. Der normale Chatmodus und die Provider-Gateway-Architektur bleiben unverändert.

## v2.0.0 – Aktuelles Kompositionsmodell
MusicChat Lab 2.0 konsolidiert das in Composition Studio bewährte zweistufige Modell als maßgeblichen Kompositionsweg: freier musikalischer Entwurf zuerst, technische MIDI-Übersetzung danach. Die Übersetzungsstufe bewahrt neben Noten, Rhythmus, Phrasierung und Dynamik nun auch ausdrücklich Tempo- und Taktwechsel über optionale `tm`- und `tsm`-Verläufe; der MIDI-Export schreibt diese als Standard-MIDI-Metaevents. Allgemeine Artikulation wird über Velocity, Gate und geeignete Standard-Controller erhalten. SWAM-spezifische Interpretation bleibt außerhalb von MusicChat Lab. Der normale Chatmodus und die konsolidierte Provider-Gateway-Architektur bleiben unverändert.

# MusicChatLab – Entwicklungsdokumentation

> **VERBINDLICHE ARBEITSREGEL:** Vor **jeder** zukünftigen Entwicklungsarbeit an MusicChatLab muss diese Datei (`DEVELOPMENT.md`) zuerst vollständig gelesen werden. Erst danach dürfen Code, Konfiguration, Workflow, Service Worker oder andere Bestandteile der App geändert werden. Diese Regel gilt auch für kleine Fehlerbehebungen, Modellupdates und scheinbar triviale Änderungen. Nach wesentlichen Änderungen ist die Dokumentation im selben Arbeitsgang zu aktualisieren.

> **VERBINDLICHE FREIGABEREGEL:** Jeder neue Teststand erhält eine neue, eindeutig sichtbare Buildnummer. Kein Build darf dem Anwender zur Abnahme oder zum Funktionstest herausgegeben werden, bevor er selbst technisch geprüft wurde. Ein erfolgreicher Commit oder GitHub-Pages-Deploy ist ausdrücklich **kein** Funktionstest. Vor Freigabe sind mindestens das Laden aller lokalen JavaScript-/CSS-Ressourcen, JavaScript-Syntax, App-Initialisierung, zentrale Button-/Event-Handler, Chat-/Komponier-Eingabe, Dialoge sowie der grundlegende PWA-Startpfad zu prüfen. Nur ein bestandener technischer Teststand darf als Testbuild bezeichnet und zur Abnahme freigegeben werden. Nicht automatisierbare geräte- oder iPad-spezifische Aspekte müssen ausdrücklich als solche benannt werden und dürfen nicht als selbst getestet ausgegeben werden.

Diese Datei ist das fortlaufende technische Entwicklungsprotokoll der MusicChatLab-App. Sie soll nicht nur neue Funktionen festhalten, sondern insbesondere Fehlerursachen, Architekturentscheidungen und daraus abgeleitete Regeln dokumentieren. Sie ist bei wesentlichen Änderungen künftig mitzuführen.

## Verbindlicher Arbeitsablauf

Jede zukünftige Arbeit an diesem Repository beginnt in dieser Reihenfolge:

1. `DEVELOPMENT.md` aus dem aktuellen Stand des GitHub-Repository vollständig lesen.
2. Die dort festgehaltenen Architekturentscheidungen, bekannten Problemfälle, offenen Konsolidierungsaufgaben und Entwicklungsgrundsätze auf die geplante Änderung anwenden.
3. Erst danach die betroffenen Quelldateien untersuchen und Änderungen vornehmen.
4. Neue Funktionen und Fehlerbehebungen möglichst in den bestehenden zuständigen Code einarbeiten statt weitere Patch-Schichten anzuhängen.
5. Nach der Änderung Build/Deployment und den betroffenen Funktionsweg **selbst technisch testen**. Deployment-Erfolg allein genügt nicht.
6. **Jeder neue Teststand erhält eine neue Buildnummer.** Erst nach bestandenem technischen Test darf dieser Build dem Anwender zur Abnahme/Funktionserprobung genannt werden.
7. Wenn die Änderung eine neue Funktion, einen relevanten Fehler, eine neue Ursache, eine Architekturentscheidung oder eine wichtige Erfahrung betrifft, `DEVELOPMENT.md` im selben Arbeitsgang ergänzen.

Ein Entwicklungsauftrag an MusicChatLab ist daher **nicht vollständig ausgeführt**, wenn diese Dokumentation vorher nicht gelesen, der neue Stand vor Freigabe nicht technisch getestet und bei relevanten Erkenntnissen anschließend nicht aktualisiert wurde.

## Entwicklungsgrundsätze

### 1. Funktionen einarbeiten statt Patch-Ketten aufbauen
Neue Funktionen und Fehlerbehebungen sollen möglichst in die bestehende Architektur und die zuständigen Module eingearbeitet werden. Es soll **nicht** für jede Korrektur ein weiteres nachträglich geladenes Patch-Skript an die App angehängt werden.

### 2. Eine Information – eine maßgebliche Quelle
Globale Zustände wie App-Version, Modellkatalog, Konfigurationswerte oder Dateiformat-Versionen dürfen nicht unabhängig an mehreren Stellen gepflegt werden.

### 3. Fehlerursache beheben, nicht nur Symptom überdecken
Vor einer Korrektur soll geprüft werden, warum ein Fehler entsteht. Cache, Deployment, Laufzeitcode und gespeicherte Zustände sind getrennt zu betrachten.

### 4. Deployment gehört zum Test, ersetzt ihn aber nicht
Eine Änderung gilt bei der WebApp nicht allein deshalb als fertig, weil sie im Repository committed oder erfolgreich über GitHub Pages veröffentlicht wurde. Nach erfolgreichem Deployment muss der veröffentlichte Stand technisch auf Ladefähigkeit, Initialisierung und die betroffenen Funktionswege geprüft werden. Erst danach ist eine Freigabe zulässig.

### 5. Musikalische Freiheit erhalten
Technische Protokolle, strukturierte Aktionen, Validierung und Fehlerbehandlung dürfen robuster gemacht werden. Der musikalische Kompositionsauftrag an die KI soll dadurch aber nicht unnötig mit zusätzlichen musikalischen Detailvorgaben eingeengt werden.

## Architektur – Leitgedanke
MusicChatLab ist eine dialogorientierte musikalische Arbeitsumgebung mit Chat-/Kompositionsmodus, direkter Provider-Anbindung, MIDI-/MusicXML-Verarbeitung, CLAB-Dokumenten, MIDI-Speicherplätzen, Wiedergabe, strukturierten Kompositionsaktionen, Diagnose/Kosten sowie Backup und PWA-Betrieb.

## Entwicklungsprotokoll

### Bis v1.3.14 – Konsolidierung
Die App wurde schrittweise um expliziten Chat-/Komponiermodus, MIDI-Arbeitsbereich, sechs MIDI-Speicherplätze, CLAB-Unterstützung, Diagnosefunktionen, Kostenanzeige und Backup-Funktionen erweitert. Die strukturierte Kommunikation zwischen KI-Antwort und musikalischer Aktion verwendet interne `MCL_ACTION`-Daten.

### September 2026 – unvollständige strukturierte Gemini-Aktion
Gemini konnte eine musikalische Änderung planen, aber der `MCL_ACTION`-Block wurde am Ausgabelimit abgeschnitten. Die Prüfung bleibt fail-closed. Technische Zuverlässigkeit soll über Validierung bzw. gezielte technische Wiederholung entstehen, nicht über stärkere musikalische Reglementierung.

### September 2026 – GitHub Pages blieb auf v1.3.14
Der Pages-Workflow prüfte auf nicht mehr vorhandene Dateien und brach ab. Lehre: Bei Versionsunterschieden zuerst Deployment prüfen.

### v1.3.15–v1.3.17 – widersprüchliche Versionsanzeigen
Mehrere unabhängige Versionsquellen führten zu widersprüchlichen Anzeigen. Sichtbare Version, Erweiterungsskript und Service-Worker-Cache wurden vereinheitlicht. Versionsverwaltung soll weiter zentralisiert werden.

### v1.3.16/v1.3.17 – Erweiterung der KI-Modelle
Die Modellauswahl wurde erweitert. Die Modellpflege soll künftig regulärer Bestandteil der Provider-/Modellarchitektur sein und nicht dauerhaft über UI-Patches erfolgen.

### v1.3.18 – Migration der installierten PWA
Die installierte iPad-PWA blieb trotz erfolgreichem Deployment zunächst auf älteren Ständen. Für den einmaligen Altbestand wurde `pwa-recover.html` als isoliertes Wartungswerkzeug angelegt; es löscht nur MusicChatLab-Service-Worker und MusicChatLab-Caches, nicht Local-Storage-Daten.

### v1.3.18 – Oberfläche sichtbar, aber Bedienung nach Migration tot
Nach dem Übergang zeigte die installierte App v1.3.18, reagierte aber auf keinerlei Bedienung. Der neu eingeführte Inline-Update-/Reload-Code wurde zurückgenommen; anschließend wurde auch der Service Worker auf das zuvor bewährte Verhalten zurückgeführt. Die Regression zeigte, dass Repository-/Deployment-Prüfung allein eine funktionsfähige App nicht garantiert.

### v1.3.19/v1.3.20 – Konsequenz aus den toten Testständen
Mehrere veröffentlichte Stände zeigten zwar die neue Versionsnummer, waren auf dem Zielgerät aber nicht bedienbar. Daraus folgt die verbindliche Freigaberegel am Anfang dieses Dokuments: **keine Herausgabe ohne vorherigen technischen Funktionstest und keine Wiederverwendung derselben Buildnummer für einen veränderten Teststand.** Automatisierbare Prüfungen müssen vor der Anwenderprüfung erfolgen; gerätespezifische Restprüfungen werden klar davon getrennt.

### v1.3.21 – Ursache der vollständig blockierten Oberfläche gefunden
Die Ursache lag nicht im Service Worker, sondern in `model-extension.js`. Ein `MutationObserver` beobachtete Änderungen am Modell-Auswahlfeld und rief `apply()` auf. `apply()` leerte und erzeugte die Optionen jedes Mal neu. Diese Änderung löste denselben Observer erneut aus; nach Rücksetzen des `applying`-Flags entstand dadurch eine endlose Microtask-/Mutation-Schleife. Der Browser bekam praktisch keine Gelegenheit mehr, Benutzerereignisse zu verarbeiten – die Oberfläche war sichtbar, aber vollständig tot.

Die Korrektur macht die Modellaktualisierung idempotent: Vor einer DOM-Änderung wird geprüft, ob die vorhandenen Optionen bereits dem gewünschten Modellset entsprechen. Der Observer plant `apply()` nur noch bei einer tatsächlichen Abweichung. Damit kann er seine eigene Änderung nicht mehr endlos erneut auslösen.

Für v1.3.21 wurde erstmals der veröffentlichte GitHub-Pages-Artefaktstand selbst heruntergeladen und geprüft. Alle JavaScript-Dateien bestanden `node --check`. Zusätzlich wurde der komplette Script-Satz in der realen Reihenfolge in Chromium geladen; es traten keine JavaScript-Laufzeitfehler auf. Der Smoke-Test prüfte Texteingabe, Öffnen des API-Einstellungsdialogs, Anlegen eines neuen Chats, Wechsel zwischen OpenAI/Anthropic einschließlich Modelllisten sowie anschließende Reaktionsfähigkeit der Oberfläche. Diese Prüfungen bestanden. Der GitHub-Pages-Deploy für v1.3.21 war ebenfalls erfolgreich. Der installierte iPad-PWA-Lebenszyklus bleibt eine gerätespezifische Restprüfung und kann nicht als lokal simuliert ausgegeben werden.

## Offene Konsolidierungsaufgaben
- Modellkatalog an einer eindeutigen Stelle pflegen.
- Versionsverwaltung zentralisieren.
- API-Key-Persistenz zuverlässig prüfen und absichern.
- Backup auf Mobilgeräten verbessern.
- ältere Patch-/Kompatibilitätsmodule konsolidieren.
- PWA-Updates inklusive installiertem Client-Lebenszyklus testen.
- `pwa-recover.html` nach erfolgreicher Migration als Wartungswerkzeug bewerten.
- Eine zukünftige Update-Architektur isoliert entwickeln und testen; bis dahin den bewährten Service-Worker-Pfad nicht erneut umbauen.
- Den jetzt verwendeten reproduzierbaren Chromium-Smoke-Test dauerhaft in den Entwicklungs-/Deployment-Prozess integrieren.

## Vorgehen bei zukünftigen Änderungen
1. `DEVELOPMENT.md` vollständig lesen,
2. bestehenden zuständigen Code und Datenfluss bestimmen,
3. Ursache bzw. gewünschte Architektur festhalten,
4. Änderung möglichst im zuständigen Modul integrieren,
5. keine neue Patch-Datei anlegen, wenn eine saubere Integration möglich ist,
6. neue Buildnummer vergeben,
7. Syntax, Ressourcen, Initialisierung und Kernbedienung technisch testen,
8. Deployment prüfen und veröffentlichten Stand erneut testen,
9. **erst danach** den Build zur Anwenderprüfung freigeben,
10. wesentliche Änderung, Problemursache und Lehre hier dokumentieren.

### v1.4.7 – veralteter API-Key wurde nach Backup wiederhergestellt
Die Ursache für wiederkehrende Meldungen wie „API key is invalid.“ lag in der Backup-Verwaltung: Beim Erstellen eines Backups wurde der damalige API-Einstellungsstand in `protectedSettings` festgehalten. Dieser alte Stand blieb im laufenden JavaScript erhalten. Bei späterem `pageshow` bzw. beim Zurückkehren der App in den Vordergrund stellte `restoreProtectedSettings()` diesen alten Stand erneut in Local Storage her. Ein danach neu gespeicherter API-Key konnte dadurch unbemerkt wieder durch den älteren Key ersetzt werden.

Die Korrektur entfernt diese dauerhafte Wiederherstellung. Die Backup-Erstellung liest die API-Einstellungen nur noch für das Backup und verändert sie nicht. `pageshow` und `visibilitychange` schreiben keine API-Einstellungen mehr zurück. Damit bleibt ein in den Einstellungen neu gespeicherter Key maßgeblich.


Für den Freigabestand v1.4.7 wurde zusätzlich der Service-Worker-Cache auf `music-chat-lab-v1.4.7` angehoben, damit installierte Clients nicht auf dem v1.4.6-App-Shell einschließlich der alten Backup-Verwaltung verbleiben. Der Versionsguard des Backup-Managers wurde auf v1.1.32 korrigiert.


### v1.4.8 – API-Key-Schutz während des mobilen Backup-Lebenszyklus
Auf dem iPad wurde reproduzierbar beobachtet: Ein neu gespeicherter Anthropic-Key funktionierte zunächst; nach „Backup erstellen“ waren die API-Einstellungen anschließend verschwunden. v1.4.7 hatte zwar die dauerhaft festgehaltene alte `protectedSettings`-Kopie entfernt, schützte den aktuellen Einstellungsstand während des mobilen Download-/Seitenlebenszyklus aber nicht.

v1.4.8 nimmt deshalb unmittelbar beim Start des Backups einen kurzlebigen Snapshot ausschließlich der aktuellen API-Einstellungen. Während eines 15-Sekunden-Fensters werden bei `pageshow` bzw. Rückkehr aus dem Hintergrund nur tatsächlich fehlende API-Key-Felder aus diesem Snapshot ergänzt; vorhandene oder neuere Werte werden nicht überschrieben. Vor und unmittelbar nach dem Download wird dieselbe Invariante geprüft. Der Schutz läuft automatisch aus und wird vor einer absichtlichen Backup-Wiederherstellung deaktiviert. Damit wird die fehlerhafte dauerhafte Rückschreibung aus v1.4.6 nicht wieder eingeführt.

Freigabekriterium für diesen Stand: API-Key speichern → Backup erstellen → API-Key bleibt vorhanden → Provider-Aufruf weiterhin möglich. Der iPad-spezifische Download-/PWA-Lebenszyklus bleibt eine gerätespezifische Restprüfung; er darf erst nach bestandenem automatisierbarem Syntax-/Ressourcen-/Initialisierungs-Smoke-Test dem Anwender zur Prüfung vorgelegt werden.


### v1.4.9 – API-Key-Schutz beim Diagnose-Download
Der iPad-Test von v1.4.8 hat den Fehler weiter eingegrenzt: Nach „Backup erstellen“ blieben die API-Keys erhalten; erst „Diagnose-Datei speichern“ ließ sie verschwinden. Damit ist der Backup-Pfad als unmittelbarer Auslöser ausgeschlossen und der mobile Download-Lebenszyklus des Diagnosepfads als eigener Fehlerweg bestätigt.

Der Diagnose-Download schützt deshalb analog, aber ausschließlich in `diagnostic-enhancer.js`, für 15 Sekunden den unmittelbar vor dem Download vorhandenen API-Einstellungsstand. Bei `pageshow`/Rückkehr aus dem Hintergrund und unmittelbar nach dem Download werden nur fehlende Key-Felder ergänzt; vorhandene oder neuere Werte werden nicht überschrieben. Die Diagnose-Datei selbst erhält dadurch keine zusätzliche Key-Kopie und der Schutz läuft automatisch aus.

Freigabekriterium: API-Key speichern → Diagnose-Datei speichern → API-Key bleibt vorhanden → Provider-Aufruf weiterhin möglich. Backup und Diagnose sind getrennte Pfade und werden getrennt geprüft.


### v1.4.10 – Diagnose-Download auf nativen Browserpfad zurückgeführt
Die iPad-Prüfung von v1.4.9 zeigte, dass der zusätzliche kurzlebige Key-Schutz den Verlust der API-Einstellungen nach dem Speichern der Diagnosedatei nicht verhindert. Die Schutzschicht war damit nicht die richtige Fehlerbehebung und wurde aus dem Diagnosemodul wieder entfernt.

Die Quellprüfung ergab einen gemeinsamen Sonderpfad für Dateidownloads: `download-compat.js` überschrieb global `HTMLAnchorElement.prototype.click`. Jeder Blob-Download wurde dadurch asynchron erneut per `fetch` gelesen, mit `FileReader` in eine Data-URL umgewandelt und anschließend über einen zweiten künstlichen Anchor ausgelöst. Diagnose-, Backup-, CLAB- und andere Exporte liefen damit nicht über den von ihren Modulen programmierten nativen Downloadpfad.

v1.4.10 entfernt diesen globalen Prototype-Override. Blob-Exporte verwenden wieder den nativen `<a download>`-Mechanismus des Browsers. Der Diagnosecode enthält keine eigene API-Key-Restaurierung mehr. Damit wird die Downloadarchitektur vereinfacht und die Ursache an der gemeinsamen Stelle statt durch weitere Key-Patches behandelt.

Freigabekriterium: Syntax-/Ressourcen-/Initialisierungstest sowie Download-Smoke-Test müssen bestehen. Der iPad-spezifische Test bleibt: API-Key speichern → Diagnose-Datei speichern → Key bleibt vorhanden; zusätzlich muss die Diagnosedatei auf dem iPad weiterhin tatsächlich gespeichert werden können.


### v1.4.11 – API-Einstellungen mit persistentem IndexedDB-Spiegel
Der iPad-Test von v1.4.10 zeigte: Auch nach Entfernung des globalen Download-Overrides verschwanden die API-Einstellungen nach dem Speichern der Diagnosedatei. Damit ist der frühere Blob-/Data-URL-Sonderpfad als Ursache widerlegt. Der gerätespezifische Download-/PWA-Lebenszyklus kann den Local-Storage-Eintrag weiterhin verlieren.

v1.4.11 behandelt die API-Einstellungen deshalb nicht mehr als ausschließliches Local-Storage-Datum. `settings-store.js` spiegelt den gespeicherten Einstellungsstand zusätzlich in einer eigenen IndexedDB. Beim Start, bei `pageshow` und bei Rückkehr in den Vordergrund wird ein fehlender Local-Storage-Eintrag aus diesem persistenten Spiegel wiederhergestellt. Ein vorhandener aktueller Local-Storage-Stand bleibt maßgeblich und aktualisiert den Spiegel. „Schlüssel löschen“ löscht bewusst beide Speicherorte. Es werden keine Schlüssel in Diagnose, Backup-Code oder GitHub übertragen.

Freigabekriterium: Syntax-/Ressourcen-/Initialisierungstest; Speichern und bewusstes Löschen müssen beide Speicherpfade konsistent behandeln. Gerätespezifischer iPad-Test: Key einmal neu speichern → Diagnose-Datei speichern → Einstellungen erneut öffnen → Key vorhanden → Provider-Aufruf funktioniert.


### v1.4.12 – Persistenzabschluss vor Diagnose-Download
Der iPad-Test von v1.4.11 zeigte, dass der zusätzliche IndexedDB-Spiegel allein den Key-Verlust noch nicht verhindert. Die Prüfung des neuen Speichercodes ergab eine konkrete Lücke: `saveSettings()` startete das Schreiben in IndexedDB nur asynchron, die Oberfläche meldete aber sofort „gespeichert“ und schloss den Dialog. Damit war vor einem anschließenden Diagnose-Download nicht garantiert, dass die dauerhafte Kopie bereits committed war. Auch das Öffnen der Einstellungen wartete nicht auf eine eventuell laufende Wiederherstellung.

v1.4.12 schließt diese Lücke: Das Speichern bestätigt den Vorgang erst nach Abschluss des IndexedDB-Schreibens. Vor dem Diagnose-Download wird der aktuelle Local-Storage-Stand nochmals explizit und abgewartet in IndexedDB geschrieben. Das Öffnen der API-Einstellungen wartet auf die Wiederherstellung aus dem persistenten Speicher. Der iPad-Download-Lebenszyklus selbst bleibt gerätespezifisch und ist erst durch den Gerätetest verifizierbar.


### v1.4.13 – Diagnoseexport ohne PWA-Blob-Navigation und dauerhafter Verlaufsspiegel
Der iPad-Test von v1.4.11 zeigte zusätzlich zum Key-Verlust einen vollständig leeren Chatverlauf. Damit ist der Fehler nicht auf API-Einstellungen begrenzt. Die Quellprüfung des Übergangs 1.4.10→1.4.11 ergab keinen Codepfad, der den Chat-Local-Storage löscht; `settings-store.js` arbeitet ausschließlich mit `music-chat-lab.api-settings.v1`. Der Verlust des Verlaufs kann daher nicht als Folge des neuen Key-Spiegels erklärt werden.

Für installierte iOS/iPadOS-WebApps ist dagegen dokumentiert, dass ein programmatischer Blob-Download über `<a download>` in der Home-Screen-App nicht wie in Safari als normaler Download behandelt werden muss, sondern als Dateivorschau geöffnet werden kann. Genau dieser Pfad wurde für die Diagnosedatei verwendet. v1.4.13 vermeidet ihn auf Geräten mit Web-Share-Dateiunterstützung: Die Diagnose wird als `File` über den nativen Share-Dialog übergeben; der Anchor/Blob-Pfad bleibt nur Fallback. Vorher wird weiterhin die Key-Sicherung abgeschlossen.

Zusätzlich erhält der Chatverlauf mit `state-vault.js` einen unabhängigen IndexedDB-Spiegel. `saveChats()` spiegelt nichtleere Verläufe dorthin. Beim Start sowie nach `pageshow`/Rückkehr in den Vordergrund wird ein fehlender Local-Storage-Verlauf aus dem Spiegel wiederhergestellt. Ein leerer Zustand überschreibt den Spiegel nicht. Die automatische Erzeugung eines neuen Chats wartet beim Start auf diese Wiederherstellungsprüfung, damit ein leer geladener Zustand nicht vorzeitig den Rettungspfad überholt. Der Initialisierungs-Guard von `settings-store.js` wurde außerdem korrigiert.

Wichtig: Diese Architektur kann bereits vor v1.4.13 verlorene Chats nicht rekonstruieren; dafür bleibt ein vorhandenes MusicChatLab-Backup die Wiederherstellungsquelle. Gerätespezifisches Freigabekriterium: vorhandenen Verlauf erzeugen/prüfen → Diagnose über Share-Dialog sichern → zur App zurückkehren → Verlauf und API-Key bleiben vorhanden.


### v1.4.14 – Chatbezogener Kompositionsverlauf
Die sechs MIDI-Speicher bleiben der aktuelle Arbeitstisch und werden nicht als Historie umgedeutet. Zusätzlich erhält jeder Chat einen eigenen, unveränderlichen Kompositionsverlauf. Jede von der KI tatsächlich erzeugte JSON-Partitur wird anhand der Assistant-Nachricht automatisch mit Titel, Zeitpunkt, Provider, Modell, zugehörigem Nutzerauftrag und vollständigem Score in der bestehenden State-Vault-IndexedDB abgelegt. Die Message-ID verhindert Doppelaufnahmen.

Beim Öffnen des Verlaufs werden auch bereits im aktuellen Chat vorhandene Assistant-Nachrichten mit gültiger Partitur nachträglich erfasst. Dadurch beginnt der Verlauf nicht erst mit Installation dieses Builds, soweit die betreffenden Kompositionen noch im Chat gespeichert sind.

„In Slot laden“ kopiert eine historische Fassung auf den Arbeitstisch, ohne den historischen Eintrag zu verändern. Zuerst wird ein freier der sechs Speicher verwendet. Sind alle belegt, muss ein aktiver Speicher markiert sein und dessen Ersetzung wird ausdrücklich bestätigt. Der Kompositionsverlauf ist damit Gedächtnis, die Slots bleiben Arbeitskopien.

Die Backup-Verwaltung exportiert und importiert die chatbezogenen Kompositionsverläufe zusätzlich zum bisherigen Local-Storage- und MIDI-Arbeitstisch-Zustand. Große Scores werden weiterhin nicht in Local Storage gespeichert.


### v1.4.15 – Herkunftsbehauptungen in Kompositions-Metadaten entkoppelt
Die Analyse einer Diagnosedatei zeigte, dass eine neu erzeugte Komposition („Chant du crépuscule“) im Feld `sm` noch die Herkunftsbeschreibung einer älteren Drei-Stücke-Synthese tragen konnte, obwohl die Notendaten diese Herkunft nicht belegten. Ursache war, dass NEW_SCORE/REPLACE_SCORE ein von der KI geliefertes `score.sm` unverändert übernahmen. Damit konnte alter Gesprächs- oder Score-Kontext als scheinbare Provenienz in eine neue Partitur gelangen.

v1.4.15 macht die Kurzbeschreibung bei vollständig neu erzeugten bzw. vollständig neu geschriebenen Scores explizit zur Eigenschaft der aktuellen Aktion: `score.sm` aus dem gelieferten Score wird nicht mehr als maßgeblich übernommen. Stattdessen setzt der Orchestrator `sm` aus der aktuellen `action.summary`; fehlt diese, wird eine neutrale technische Beschreibung verwendet. Der Systemauftrag verlangt außerdem, dass eine Herkunft aus Ausgangsmaterial nur behauptet wird, wenn dieses Material im aktuellen Zug als vollständiger `<MCL_SCORE>` vorliegt und tatsächlich verarbeitet wurde. Ein Browser-Smoke-Test prüft ausdrücklich, dass ein absichtlich veraltetes `score.sm` bei NEW_SCORE weder mit noch ohne aktuelle Summary in das Ergebnis durchsickert.


### v1.4.16 – Release-Workflow: Playwright-Abhängigkeit korrekt installiert
Der Release-Check von v1.4.15 scheiterte nicht an MusicChatLab, sondern bereits beim Start des Browser-Smoke-Tests. Das Actions-Log zeigte `Error: Cannot find module '@playwright/test'` und anschließend `No tests found`. Ursache war die Verwendung von `npx -y @playwright/test ...`: damit wurde zwar der Playwright-Befehl ausgeführt, das Testmodul stand beim Laden von `.github/smoke.spec.js` aber nicht als Projektabhängigkeit für `require('@playwright/test')` zur Verfügung.

v1.4.16 installiert `@playwright/test@1.55.0` im Workflow vor dem Browser-Test explizit per npm und verwendet danach `npx playwright`. Damit prüft der Release-Workflow wieder tatsächlich die Anwendung statt an seiner eigenen Testumgebung zu scheitern. Die Änderung erhält wegen der verbindlichen Buildregel eine neue sichtbare Buildnummer.


### v1.4.17 – Smoke-Test prüft Select-Optionen semantisch statt visuell
Der v1.4.16-Workflow erreichte den Browser-Test vollständig. Er scheiterte ausschließlich an der Assertion `toBeVisible()` für das erste `<option>` des Modell-Selects. Das Log zeigte gleichzeitig, dass die Option `GPT-6 Astra` korrekt im DOM vorhanden war. Einzelne `<option>`-Elemente gelten in Headless Chromium jedoch als nicht sichtbar, solange das native `<select>` nicht geöffnet ist; die Assertion testete damit Browserdarstellung statt App-Funktion.

v1.4.17 prüft stattdessen, dass nach dem Providerwechsel mindestens eine Modelloption vorhanden und im Modell-Select ein nichtleerer Wert ausgewählt ist. Damit entspricht der Smoke-Test der eigentlichen Funktionsanforderung, ohne Produktionscode wegen eines fehlerhaften Tests zu verändern.


### v1.4.18 – PWA-Updatepfad von festgefrorener v1.4.14 entkoppelt
Nach erfolgreichem v1.4.17-Release zeigte Safari den aktuellen Stand, während die bereits installierte iPad-PWA weiterhin v1.4.14 ausführte. Die Quellprüfung ergab eine konkrete Versionsinkonsistenz in `index.html`: Obwohl sichtbare App-Version und Service-Worker-Cache inzwischen v1.4.17 waren, registrierte ein zweiter Service-Worker-Pfad weiterhin explizit `service-worker.js?v=1.4.14`. Auch Manifest-, Favicon- und Apple-Touch-Icon-URLs waren auf v1.4.14 eingefroren; das Manifest selbst referenzierte Icons sogar noch mit v1.4.6.

v1.4.18 beseitigt diese eingefrorenen PWA-Ressourcenkennungen: Service-Worker-Registrierung, Manifest-URL, Icons, Manifest-Icon-URLs, sichtbare Version und Cache tragen denselben aktuellen Buildstand. Die bestehende Netzwerk-zuerst-Strategie des Service Workers und die lokalen Datenbanken/Local-Storage-Daten werden dabei nicht verändert. Ziel ist ausdrücklich, den Updatepfad zu korrigieren, ohne Chatverlauf oder API-Einstellungen anzutasten.


### v1.4.19 – Key-sichere Diagnose von Local Storage und IndexedDB
Nach dem erfolgreichen PWA-Update auf v1.4.18 blieb Chat-/MIDI-Zustand erhalten, der Anthropic-Aufruf meldete jedoch erneut `API key is invalid.`, obwohl im Einstellungsdialog ein Anthropic-Key vorhanden war. Die Prüfung von `settings-store.js` zeigt: Sobald Local Storage irgendeinen API-Key enthält, behandelt `restore()` diesen gesamten Zustand als maßgeblich und schreibt ihn in den IndexedDB-Spiegel. Damit kann ein alter Local-Storage-Key einen abweichenden Vault-Wert überschreiben.

v1.4.19 ändert diese Speichersemantik bewusst noch nicht. Stattdessen erhält der bestehende Settings Store eine rein lesende, key-sichere Diagnosefunktion. Für jeden Provider werden für Local Storage und IndexedDB nur Vorhandensein, Zeichenlänge und ein gekürzter SHA-256-Fingerabdruck geliefert; der Schlüssel selbst wird weder ausgegeben noch in Diagnosecode kopiert. Zusätzlich wird ausgewiesen, dass der aktuelle Laufzeitpfad `apiKeyFor()` aus Local Storage liest. Damit kann zunächst eindeutig festgestellt werden, ob die beiden Speicherquellen auseinanderlaufen, bevor eine weitere Persistenzänderung vorgenommen wird.


### v1.4.20 – Sichere Speicherdiagnose in Diagnoseexport eingebunden
Der Gerätetest von v1.4.19 zeigte, dass die neue `MCLSettingsStore.diagnostic()`-Funktion zwar vorhanden war, vom bestehenden Diagnoseexport aber nicht aufgerufen wurde. Die gespeicherte Diagnosedatei konnte deshalb noch keinen Vergleich zwischen Local Storage und IndexedDB liefern.

v1.4.20 bindet diese bereits vorhandene, rein lesende Diagnose in `diagnostic-enhancer.js` ein und erhöht das Diagnoseformat auf 4. Der Export wartet auf die Diagnose und schreibt sie als `settingsStorage` in die JSON-Datei. Rohwerte der API-Keys werden weiterhin nicht exportiert; enthalten sind ausschließlich Vorhandensein, Länge, gekürzter Fingerabdruck, Gleichheit der beiden Speicherstände und die Laufzeitquelle. Die Persistenz- und Wiederherstellungslogik selbst bleibt unverändert.


### v1.4.21 – PWA-Updatepfad auf eine Registrierung konsolidiert
Der iPad-Test zeigte, dass die installierte PWA trotz veröffentlichtem v1.4.20 nach vollständigem Beenden auf v1.4.19 blieb. Die Quellprüfung fand zwei konkrete Ursachen im aktuellen Stand: `app.js` registrierte weiterhin zusätzlich einen unversionierten Service Worker, während `index.html` einen zweiten Registrierungsweg enthielt; außerdem waren Manifest-, Icon- und versionierte Service-Worker-URLs in `index.html` noch auf v1.4.18 festgeschrieben. Damit war die in v1.4.18 beabsichtigte Synchronisierung in späteren Builds nicht dauerhaft erhalten geblieben.

v1.4.21 entfernt die Service-Worker-Registrierung aus `app.js`. Maßgeblich ist nur noch der eine Registrierungsweg in `index.html`, mit `updateViaCache: "none"` und explizitem `registration.update()`. Alle PWA-Ressourcenkennungen, sichtbare Version, Manifest-Icons und Service-Worker-Cache sind auf v1.4.21 synchronisiert. Der Service Worker verwendet weiterhin `skipWaiting()` und `clients.claim()`; Local Storage und IndexedDB werden nicht verändert.


### v1.4.22 – Technische Plausibilitätsprüfung für erzeugte Partituren
Die Diagnose einer Claude-Komposition zeigte eine strukturell zerrissene Zeitachse mit einer globalen Leerstelle von mehreren Takten sowie deutliche Abweichungen von zuvor ausdrücklich bestätigten Eckdaten. Der bisherige Orchestrator akzeptierte NEW_SCORE/REPLACE_SCORE bereits dann, wenn eine Spur mit einem Notenarray vorhanden war; zeitliche Konsistenz und explizite numerische Vorgaben wurden nicht geprüft.

v1.4.22 ergänzt die Prüfung direkt im zuständigen `session-orchestrator.js`, ohne musikalische Stilregeln einzuführen. Erkannt werden globale innere Leerstellen von mindestens vier Takten sowie klare Abweichungen von in den letzten Dialogzügen ausdrücklich genannten BPM-, Taktzahl- und Dur/Moll-Angaben. Ein auffälliges Ergebnis wird nicht auf den Arbeitstisch übernommen. Stattdessen erhält dieselbe KI genau einen technischen Korrekturversuch mit den konkret gefundenen Inkonsistenzen; Melodik, Harmonik und Form werden dabei nicht zusätzlich vorgeschrieben. Bleibt die korrigierte Fassung technisch auffällig, wird sie fail-closed verworfen und der Nutzer erhält eine verständliche Meldung.

Der Browser-Smoke-Test enthält nun zusätzlich einen absichtlich zerrissenen Score, der erkannt werden muss, sowie eine konsistente 24-Takt-/88-BPM-/a-Moll-Fassung, die ohne Beanstandung passieren muss.


### v1.4.23 – Kompositionsidee als maßgebliche Referenz
Der Gerätetest von v1.4.22 zeigte, dass die Plausibilitätsprüfung zwar große globale Zeitlöcher erkennen konnte, die Eckdaten aber aus den letzten Chatnachrichten rekonstruierte. In längeren Dialogen konnten dadurch ältere Ideen (z. B. 24 Takte) mit dem aktuellen Auftrag (z. B. 56 Takte) verwechselt werden.

v1.4.23 verwendet deshalb für Taktzahl, BPM und Dur/Moll nicht mehr eine Textsuche im Nachrichtenfenster, sondern ausschließlich den aktuellen Inhalt des bereits vorhandenen editierbaren Felds „Kompositionsidee“ als maßgebliche Referenz. Das Feld bleibt chatbezogen persistent.

Abweichungen von diesen Eckdaten bleiben aus kompositorischen Gründen ausdrücklich erlaubt. Die KI muss eine bewusste Abweichung im strukturierten MCL_ACTION-Feld `deviationReason` knapp musikalisch begründen. Eine so begründete Abweichung wird akzeptiert und als „Bewusste Abweichung“ in der Kompositionsbeschreibung dokumentiert. Unbegründete Abweichungen lösen weiterhin genau einen technischen Korrekturversuch aus. Große globale innere Zeitlöcher gelten weiterhin als technische Auffälligkeit und können nicht allein durch eine Begründung freigegeben werden.

Der Smoke-Test setzt eine aktuelle Idee mit 56 Takten, 88 BPM und a-Moll und prüft, dass genau diese Werte – nicht ältere Chatwerte – von der Validierung verwendet werden.


### v1.4.24 – Fehler im neuen Constraint-Test behoben
Der Release-Check von v1.4.23 scheiterte im Browser-Smoke-Test: Die aktuelle Idee „56 Takte, 88 BPM, a-Moll“ wurde gesetzt, aber `bars` blieb `null`. Ursache waren versehentlich doppelt escapte RegExp-Metazeichen in den neu eingeführten JavaScript-RegExp-Literalen (`\\d`, `\\s`, `\\b`). Dadurch suchte der Parser nach den Zeichenfolgen „\d“ usw. statt nach Ziffern, Leerraum und Wortgrenzen. Die JavaScript-Syntaxprüfung konnte diesen semantischen Fehler naturgemäß nicht erkennen; der neue Browser-Test hat ihn korrekt abgefangen.

v1.4.24 korrigiert die RegExp-Literale im zuständigen Orchestrator. Der Test für die maßgebliche Kompositionsidee bleibt unverändert streng: 56 Takte, 88 BPM und a-Moll müssen tatsächlich aus dem Ideenfeld erkannt werden.


## v1.4.25 – gründliche Reparatur von Kompositionsidee und Plausibilitätsprüfung
- Die editierbare Kompositionsidee bleibt die maßgebliche Referenz und wird nach einer erzeugten Fassung nicht mehr automatisch durch deren score.sm überschrieben.
- Die Plausibilitätsprüfung unterscheidet wieder technische Inkonsistenzen von musikalischen Entscheidungen. Eine längere Pause wird nicht allein wegen ihrer Länge als Fehler verworfen.
- Tonartbezeichnungen aus deutscher und englischer Schreibweise werden bei der Prüfung äquivalent behandelt (z. B. F-Dur / F major).
- Ein Korrekturversuch erhält die tatsächlich beanstandete KI-Aktion als unmittelbaren Kontext; dadurch korrigiert die KI die konkrete Fassung statt blind neu anzusetzen.
- Bewusste Abweichungen von ausdrücklich genannten Eckdaten bleiben musikalisch zulässig, müssen aber weiterhin mit deviationReason begründet werden.
- Diagnoseformat 5 trennt den aktuellen Snapshot von älteren Routing-Diagnosedaten, damit historische Fehler nicht mehr wie aktuelle Zustände erscheinen.
- Regressionstest ergänzt: F major und F-Dur dürfen keinen falschen Tonartfehler erzeugen; die alte pauschale Leerstellentestannahme wurde entfernt.
- PWA-, Manifest-, Script- und sichtbare Versionsreferenzen auf v1.4.25 synchronisiert.


### v1.4.26 – PWA-Referenzen nach v1.4.25 vollständig synchronisiert
Die zusätzliche Freigabeprüfung von v1.4.25 fand trotz grünem Workflow noch veraltete Query-Versionen für Manifest und Service-Worker-Registrierung in index.html. Nach der verbindlichen Buildregel wird der geänderte Stand nicht unter derselben Nummer weitergeführt. v1.4.26 synchronisiert sichtbare Version, Manifest-URL, Icons, Service-Worker-Registrierung, Service-Worker-Cache, Manifest-Icons und Smoke-Test. An der musikalischen Reparatur von v1.4.25 wird dabei nichts weiter verändert.


### v1.4.27 – Vorschlag bewusst in die Kompositionsidee übernehmen
Die bisherige Automatik schrieb einen im Chat von der KI formulierten ausführbaren Vorschlag über den verborgenen `<MCL_CONCEPT>`-Block sofort in das Feld „Kompositionsidee“. Das vermischte zwei verschiedene Zustände: Die Kompositionsidee beschreibt den bewusst übernommenen musikalischen Arbeitsstand; der Chat kann dagegen Änderungen diskutieren, neue Vorschläge entwickeln oder einen völlig neuen kompositorischen Weg beginnen.

v1.4.27 trennt diese Zustände ausdrücklich. Ein im Chat erzeugter `<MCL_CONCEPT>` wird chatbezogen als noch nicht übernommener Vorschlag gespeichert, verändert das Ideenfeld aber nicht. Der neue Button **„Idee übernehmen“** wird nur aktiv, wenn im aktuellen Chat ein solcher Vorschlag vorliegt. Erst ein bewusster Klick kopiert genau diesen Vorschlag in das editierbare Feld „Kompositionsidee“; dort kann er anschließend manuell verändert und mit „Komponiere“ ausgeführt werden. Ein neuerer Vorschlag desselben Chats ersetzt lediglich den noch nicht übernommenen Vorschlag, nicht automatisch die Kompositionsidee.

Der Komponiermodus behandelt eine vorhandene Kompositionsidee als bewusst übernommenen Arbeitsstand, aber nicht als Zwang für jeden späteren Auftrag: Ein ausdrücklich neuer Nutzerauftrag darf eine neue Komposition beginnen. Der aktuelle Nutzertext und der Dialog entscheiden, ob die Idee weiterentwickelt, verändert oder ersetzt wird.

### Entwicklungsablauf ab v1.4.27 – erst prüfen, dann veröffentlichen
Um Wartezeit und unnötige öffentliche Zwischenversionen zu vermeiden, werden zusammengehörige Änderungen künftig zunächst auf einem Entwicklungszweig gesammelt. Pull Requests führen Syntax- und Browser-Smoke-Tests aus, veröffentlichen aber keine GitHub-Pages-Version. Erst ein geprüfter, konsolidierter Stand wird nach `main` übernommen; nur dieser Merge löst die Pages-Veröffentlichung aus. GitHub bleibt damit Versionsarchiv, Testplattform und Release-Host, ohne jeden internen Arbeitsschritt sofort als PWA-Release auszuliefern.


### v1.4.28 – vollständiges, schlüsselfreies KI-Aufrufprotokoll
Die Untersuchung schwacher Kompositionen zeigte eine Diagnose-Lücke: MusicChatLab speicherte sichtbaren Chat, Scores, Usage und ältere Routing-Daten, aber nicht den tatsächlich an den Provider gesendeten Gesamtauftrag jeder KI-Stufe. Damit war im Nachhinein nicht sicher unterscheidbar, ob ein schwaches Ergebnis vom Modell selbst oder von Orchestrator-, Zwei-Stufen-, Kontext- oder Reparaturprompts verursacht wurde. Minimal Composer besitzt aus genau diesem Grund bereits eine vollständige Request-/Response-Protokollierung.

v1.4.28 übernimmt dieses Diagnoseprinzip in die bestehende MusicChat-Architektur. Jeder vom Orchestrator ausgeführte Provider-Aufruf wird mit Stufenbezeichnung, Zeitpunkt, Provider, bereinigter URL, bereinigten Headern, vollständigem tatsächlich gesendetem Request-Body und vollständiger roher Provider-Antwort protokolliert. Der freie musikalische Entwurf der Zwei-Stufen-Komposition wird als eigene Stufe `musical_draft` ebenfalls vollständig erfasst; nachfolgende Orchestrator-Aufrufe enthalten dadurch auch den tatsächlich angehängten Entwurf. Notendaten in `<MCL_SCORE>`, Systemprompt, Chatkontext, Kompositionsidee und Reparaturauftrag bleiben im Request-Body erhalten, soweit sie tatsächlich an das Modell gesendet wurden.

API-Schlüssel und Authorization-Header werden ausdrücklich nicht gespeichert: bekannte Key-Queryparameter werden durch `[REDACTED]` ersetzt, Auth-/API-Key-Header ebenfalls. Die Diagnose erhält Format 6 und exportiert die chronologische Liste als `aiCalls`. Das lokale Trace-Protokoll ist auf die letzten 40 Aufrufe begrenzt. Der Browser-Smoke-Test prüft sowohl vollständigen Request-/Response-Inhalt als auch die Entfernung von URL- und Header-Geheimnissen.

Diese Protokollierung ist Diagnose und verändert weder den musikalischen Auftrag noch die erzeugte Partitur.


### v1.4.29 – Rückkehr zur direkten Komposition
Die vollständige Aufrufdiagnose von v1.4.28 zeigte, dass die neu eingeführte Zwei-Stufen-Komposition die ursprüngliche Stärke der Engine beeinträchtigen kann. Eine erste KI-Instanz schrieb aus einem offenen musikalischen Auftrag einen detaillierten Prosabauplan; die eigentliche MIDI-Instanz erhielt anschließend die Anweisung, diesen Plan „werkgetreu“ zu übertragen, „nicht neu“ zu komponieren und ungewöhnliche Entscheidungen nicht zu regularisieren. Damit wurden musikalische Erfindung und konkrete Notenentscheidung künstlich getrennt. Zugleich bekam die Entwurfsstufe nicht zuverlässig den vollständigen aktuellen musikalischen Kontext.

v1.4.29 entfernt `composition-two-stage.js` vollständig aus dem aktiven Lade- und PWA-Pfad. Die komponierende Provider-Instanz erhält wieder unmittelbar den aktuellen Dialog, den ausdrücklichen Kompositionsauftrag, die bewusst übernommene Kompositionsidee sowie bei Bedarf die vollständigen Scores aus dem Arbeitstisch und erzeugt daraus selbst die tatsächlichen Noten und die `MCL_ACTION`. Es gibt keinen vorgeschalteten Prosabauplan mehr.

Die Plausibilitätsprüfung wird zugleich auf ihre technische Aufgabe zurückgeführt. Sie vergleicht eine neue Komposition nicht mehr mechanisch mit aus dem Ideenfeld herausgelesenen Taktzahlen, Tempi oder Tonarten und löst deshalb auch keine musikalische Neukomposition wegen solcher Abweichungen aus. Geprüft werden ausschließlich formal unbrauchbare MIDI-Daten: Partitur-/Spurstruktur, Startzeiten, positive Dauern, MIDI-Pitches 0–127, Velocity 0–127, Controllerdaten, positives Tempo und gültige Taktart. Nur solche technischen Defekte dürfen den einmaligen technischen Reparaturpfad auslösen.

Die vollständige Diagnose bleibt erhalten. Zusätzlich wurde ihre Position im Fetch-Pfad korrigiert: Der Trace wird nun erst nach Einfügung des Chat-/Komponiermodus und der aktuellen Kompositionsidee unmittelbar vor dem Provider-Aufruf aufgezeichnet. Damit enthält `aiCalls` den tatsächlich gesendeten finalen Request statt einer noch nachgelagert veränderten Vorstufe.

Leitregel: Technische Robustheit darf die musikalische Entscheidung des Modells nicht ersetzen. Musikalische Qualität wird nicht durch nachträgliche starre Tempo-/Tonart-/Taktzahlregeln erzwungen.


### v1.4.30 – Chat-Isolation von Kompositionsidee und Diagnose
Die vollständige Diagnose eines frischen Chats zeigte: Der tatsächlich an Claude gesendete erste Request enthielt weder die im UI noch sichtbare alte Kompositionsidee noch altes Kompaktgedächtnis. Die fast gleiche Nocturne-Idee entstand daher nicht durch eine im protokollierten Request erkennbare Übertragung der alten Idee. Gleichzeitig bewies die Oberfläche aber eine echte Isolationslücke: Das Feld „Kompositionsidee“ zeigte im neuen Chat weiterhin den alten Wert.

Ursache war `composition-idea-field.js`: Wenn für einen neuen Chat noch kein eigener Entwurf gespeichert war, fiel `restoreDraft()` auf ein geladenes CLAB-Konzept oder den aktuell aktiven MIDI-Slot zurück. Ein neuer Chat begann dadurch im UI nicht zuverlässig mit leerer Kompositionsidee. v1.4.30 macht das Ideenfeld strikt chatbezogen: Existiert für die aktuelle Chat-ID kein eigener gespeicherter Wert, wird das Feld leer gesetzt. CLAB-/Slot-Inhalte gelangen weiterhin nur über ihre ausdrücklichen Arbeitswege in die Idee, nicht als impliziter Fallback eines neuen Chats.

Auch die Diagnose wird chat-isoliert: Das lokale Trace-Archiv darf weiterhin die letzten Provider-Aufrufe zur technischen Historie behalten, aber der Diagnoseexport enthält unter `aiCalls` nur Aufrufe, deren `chatId` der aktuell aktiven Chat-ID entspricht. Alte Zwei-Stufen- oder andere Provider-Aufrufe aus vorherigen Chats können damit bei der Analyse eines frischen Chats nicht mehr wie aktuelle Requests erscheinen.

Regressionstest: Eine in Chat A eingetragene Idee muss nach „Neuer Chat“ in Chat B leer sein; der aktuelle Trace-Snapshot darf nur Einträge der aktiven Chat-ID liefern.


### v1.4.31 – Prompt-Architektur: musikalischen Dialog von MIDI-Protokoll getrennt
Die vollständige Request-Diagnose von v1.4.30 zeigte einen grundlegenden Architekturfehler: Selbst der fünf Wörter lange Chat-Auftrag „Komponiere ein Klavierstück.“ wurde zusammen mit dem vollständigen technischen MusicChatLab-Protokoll an die KI geschickt. Der Request enthielt Arbeitstisch-, MCL_NEED-, PATCH-, MERGE-, NEW_SCORE-, REPLACE_SCORE-, Notenformat- und Gedächtnisregeln und erreichte bei leerem Arbeitstisch 2768 Input-Tokens. Damit konkurrierte technischer Steuerungskontext mit der eigentlichen musikalischen Aufgabe und verletzte den bereits dokumentierten Grundsatz „Musikalische Freiheit erhalten“.

v1.4.31 trennt die Kontexte nach tatsächlichem Bedarf. CHAT erhält standardmäßig nur eine kurze musikalische Rollenbeschreibung, den expliziten Chatmodus und den tatsächlichen Dialog. Bei leerem Arbeitstisch werden keinerlei MIDI-Aktionsformate mehr geladen. Ein vorhandener Arbeitstisch ergänzt nur einen knappen Katalog und die Möglichkeit, für eine konkrete Analyse gezielt Notendaten per MCL_NEED nachzufordern.

KOMPONIERE lädt technische Regeln bedarfsgerecht: Für ein vollständig neues Stück ohne Quellen steht nur NEW_SCORE samt kompaktem Notenformat zur Verfügung. PATCH, MERGE, REPLACE_SCORE, Quellenkatalog und MCL_NEED werden nur ergänzt, wenn tatsächlich musikalische Quellen auf dem Arbeitstisch vorhanden sind. Die bewusst übernommene Kompositionsidee wird weiterhin unmittelbar vor dem Provider-Aufruf ergänzt, ohne daraus zusätzliche Stilregeln abzuleiten.

Die bisherige CHAT-Anweisung, einen offenen Kompositionswunsch zwingend in 2–4 kurze Sätze bzw. ungefähr 350 Zeichen zu pressen und dabei alle musikalischen Entscheidungen vorab festzulegen, wurde entfernt. Im Chat darf das Modell wieder frei musikalisch antworten. MCL_CONCEPT bleibt ausschließlich als knappe verborgene Zusammenfassung einer tatsächlich entstandenen konkreten Idee für „Idee übernehmen“.

Die Architektur ist zusätzlich in PROMPT_ARCHITECTURE.md dokumentiert. Der Browser-Smoke-Test prüft künftig als Invariante: leerer CHAT-Prompt < 700 Zeichen und ohne PATCH/MERGE/NEW_SCORE/MIDI-AKTION; neue Komposition ohne Quellen enthält NEW_SCORE, aber kein PATCH/MERGE; quellenbasierte Komposition enthält die dafür benötigten Protokolle. Damit wird nicht nur die Funktion der Oberfläche, sondern auch der tatsächlich beabsichtigte Kontextumfang als Release-Kriterium überwacht.


### v1.4.32 – Claude: musikalisches Denken nicht mehr abgeschaltet
Der Vergleich mit Minimal Composer 0.4.24 und MIDI Agent zeigte, dass Claude Sonnet 5 in beiden Vergleichsumgebungen respektable kleine Klavierstücke erzeugen kann, während MusicChatLab deutlich schwächer blieb. Die Quellprüfung fand einen konkreten Unterschied im aktuellen MusicChat-Orchestrator: `buildProviderBody()` setzte für **jeden** Anthropic-Aufruf ausdrücklich `thinking: {type:"disabled"}` und entfernte `output_config`. Damit wurde ausgerechnet bei Claude Sonnet 5 dessen standardmäßig verfügbares adaptives Denken sowohl im musikalischen Chat als auch bei der direkten Komposition abgeschaltet.

Das ist nicht mit dem Minimal-Composer-Fix 0.4.24 zu verwechseln. Dort wurde Thinking ausschließlich für die zweite, rein technische MIDI-Übersetzungsstufe deaktiviert, nachdem die Diagnose bewiesen hatte, dass diese Stufe 32.768 Tokens vollständig als Thinking verbrauchte und keinen Text ausgab. Die eigentliche musikalische Draft-Stufe blieb mit dem Modellstandard erhalten.

v1.4.32 korrigiert MusicChatLab deshalb gezielt: Für Claude Sonnet 5, Opus 5 und Sonnet 4.6 verwendet der Anthropic-Pfad adaptives Thinking mit `effort:"high"`. Im Chat stehen mindestens 12.000 Output-Tokens zur Verfügung; im Modus KOMPONIERE mindestens 32.768, weil dort Thinking und die vollständige strukturierte Partitur in dasselbe Ausgabelimit fallen. Die schlanke Prompt-Architektur aus v1.4.31 bleibt unverändert; es werden keine neuen musikalischen Stilregeln eingeführt.

Regressionstest: Der Browser-Smoke-Test prüft für Claude Sonnet 5 explizit `thinking.type === "adaptive"`, `output_config.effort === "high"` sowie das größere Kompositionsbudget. Damit darf eine spätere technische Optimierung das musikalische Thinking nicht wieder stillschweigend global abschalten.


### v1.4.33 – Kompositionsidee als verbindlicher Ausführungsvertrag
Der Gerätetest von v1.4.32 zeigte eine semantische Vermischung: Ein neuer Chat mit „Komponiere ein Klavierstück.“ erhielt trotz leerer Kompositionsidee den vorhandenen Arbeitstisch als Orientierung. Claude bezog sich dadurch ungefragt auf „Stilles Wiegen“, stellte eine Rückfrage statt einen eindeutigen neuen Arbeitsstand zu erzeugen, und der Button „Komponiere“ konnte anschließend einen nicht übernommenen Chatvorschlag implizit ausführen.

v1.4.33 zieht deshalb eine klare Grenze. **Komponieren ist nur zulässig, wenn das Feld „Kompositionsidee“ nicht leer ist.** Ist es leer, wird lokal ohne Provider-Aufruf „Bitte Kompositionsidee eintragen.“ angezeigt. Die Idee darf bewusst minimal sein, z. B. „ein Klavierstück“; fehlende musikalische Entscheidungen bleiben dann der KI überlassen. Beim Komponieren ist der Inhalt dieses Felds der verbindliche aktuelle Kompositionsauftrag.

Der Chat bleibt der Ort für Ideenentwicklung. Formuliert die KI eine konkrete Idee, soll sie sichtbar fragen, ob diese als Kompositionsidee übernommen werden soll, und sie weiterhin intern als MCL_CONCEPT markieren. Bestätigt der Nutzer den unmittelbar vorher angebotenen Vorschlag eindeutig, kann die KI MCL_ADOPT_CONCEPT ausgeben; die App übernimmt dann den gespeicherten Vorschlag in das Ideenfeld, entfernt den internen Marker aus der sichtbaren Antwort und wartet weiterhin auf den ausdrücklichen Klick auf „Komponiere“. Der manuelle Button „Idee übernehmen“ bleibt als direkter Weg erhalten.

Der Arbeitstisch ist ab v1.4.33 **kein impliziter musikalischer Auftrag mehr**. Vorhandene oder aktive Slots werden einem normalen neuen Chat-/Kompositionsauftrag nicht allein wegen ihrer Existenz als Kontext angeboten. Quellenprotokoll und Quellenkatalog werden nur aktiviert, wenn der aktuelle Auftrag bzw. die Kompositionsidee ausdrücklich auf den Arbeitstisch, einen Speicher/Slot/Stück-Index oder den Namen eines vorhandenen Stücks Bezug nimmt. Damit darf ein aktiver alter Slot einen offenen Neuauftrag nicht mehr stilistisch kontaminieren.

Regressionstests prüfen: leere Idee blockiert „Komponiere“ ohne Eingabetext zu erzeugen; ein freier Auftrag „Komponiere ein Klavierstück.“ referenziert einen vorhandenen Slot nicht; ausdrückliche Referenzen wie „Stück 1“ oder ein vorhandener Titel aktivieren den Quellenweg; der Chat-Prompt enthält den Übernahme-Dialog und den internen Bestätigungsmarker.


### v1.4.34 – Geladener Kompositionsauftrag bleibt Auftrag, nicht Beschreibung
Die begriffliche Trennung wird auf geladene Stücke ausgedehnt: Das Chat-Eingabefeld dient ausschließlich dem Gespräch und löst niemals selbst eine Komposition aus. Das Feld „Kompositionsidee“ enthält ausschließlich den frei wählbaren **Kompositionsauftrag**, der beim Klick auf „Komponiere“ ausgeführt wird.

Beim Öffnen einer CLAB-Datei wird deshalb deren gespeichertes Feld `assignment` in „Kompositionsidee“ geladen. `concept` bzw. `score.sm` sind Beschreibungen des musikalischen Ergebnisses und werden nicht mehr ersatzweise als Auftrag eingesetzt. Enthält eine ältere CLAB-Datei keinen gespeicherten Auftrag, bleibt das Feld leer; ein Auftrag wird nicht erfunden.

Auch die bloße Auswahl eines MIDI-Slots überschreibt den Kompositionsauftrag nicht mehr mit `score.sm`. Reine MIDI-Dateien besitzen im Dateiformat keinen ursprünglichen natürlichsprachlichen Kompositionsauftrag; deshalb kann MusicChatLab beim MIDI-Import keinen solchen Auftrag zuverlässig rekonstruieren. Für diese Stücke kann ein neuer Auftrag frei eingetragen werden.

Regressionstest: Eine CLAB-Datei mit `assignment` und abweichendem `concept` muss exakt `assignment` in das Ideenfeld laden; anschließendes Anklicken eines Slots darf einen dort bereits eingetragenen Auftrag nicht verändern.


### v1.4.35 – Kompositionsauftrag und sichtbare Ergebnisbeschreibung
Die Begriffe werden in der Oberfläche entsprechend dem Arbeitsablauf präzisiert: Eine **Kompositionsidee** entsteht im Chat. Wird sie bewusst übernommen, steht sie im editierbaren Feld **„Kompositionsauftrag“**. Erst der Klick auf „Komponiere“ führt diesen Auftrag aus. Das Chat-Eingabefeld bleibt reiner Gesprächskanal und löst keine Komposition aus. Ein Kompositionsauftrag darf weiterhin maximal offen sein, etwa „ein Klavierstück“.

Davon getrennt ist die **Kompositionsbeschreibung** des tatsächlich entstandenen Stücks. Sie bleibt im Score als `score.sm` gespeichert und wird nun direkt unter dem Kompositionsauftrag in einem kompakten, standardmäßig eingeklappten Bereich angezeigt. Damit kann der Nutzer Soll (Auftrag) und Ist (Beschreibung) vergleichen, ohne die Oberfläche insbesondere auf Handys im Hochformat dauerhaft zu vergrößern. Beim Wechsel des aktiven Arbeitstisch-Stücks aktualisiert sich die Beschreibung, der Kompositionsauftrag wird durch die bloße Slot-Auswahl weiterhin nicht überschrieben.

Die CLAB-Trennung wurde dabei korrigiert: `assignment` speichert den tatsächlichen Inhalt des Felds „Kompositionsauftrag“, während `concept` und `score.sm` die Ergebnisbeschreibung behalten. Das Speichern einer CLAB-Datei darf `score.sm` nicht mehr mit dem Auftrag überschreiben. Beim Laden erscheint `assignment` im Auftragsfeld und `score.sm` im einklappbaren Beschreibungsbereich.

Regressionstests prüfen die eingeklappte mobile-kompakte Beschreibung, die getrennte CLAB-Speicherung von Auftrag und Beschreibung, das Laden des Auftrags sowie die unveränderte Slot-Auswahl.

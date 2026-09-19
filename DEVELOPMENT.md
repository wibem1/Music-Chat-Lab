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

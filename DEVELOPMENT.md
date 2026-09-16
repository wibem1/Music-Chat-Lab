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
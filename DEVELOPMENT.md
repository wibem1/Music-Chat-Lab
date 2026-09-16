# MusicChatLab – Entwicklungsdokumentation

> **VERBINDLICHE ARBEITSREGEL:** Vor **jeder** zukünftigen Entwicklungsarbeit an MusicChatLab muss diese Datei (`DEVELOPMENT.md`) zuerst vollständig gelesen werden. Erst danach dürfen Code, Konfiguration, Workflow, Service Worker oder andere Bestandteile der App geändert werden. Diese Regel gilt auch für kleine Fehlerbehebungen, Modellupdates und scheinbar triviale Änderungen. Nach wesentlichen Änderungen ist die Dokumentation im selben Arbeitsgang zu aktualisieren.

Diese Datei ist das fortlaufende technische Entwicklungsprotokoll der MusicChatLab-App. Sie soll nicht nur neue Funktionen festhalten, sondern insbesondere Fehlerursachen, Architekturentscheidungen und daraus abgeleitete Regeln dokumentieren. Sie ist bei wesentlichen Änderungen künftig mitzuführen.

## Verbindlicher Arbeitsablauf

Jede zukünftige Arbeit an diesem Repository beginnt in dieser Reihenfolge:

1. `DEVELOPMENT.md` aus dem aktuellen Stand des GitHub-Repository vollständig lesen.
2. Die dort festgehaltenen Architekturentscheidungen, bekannten Problemfälle, offenen Konsolidierungsaufgaben und Entwicklungsgrundsätze auf die geplante Änderung anwenden.
3. Erst danach die betroffenen Quelldateien untersuchen und Änderungen vornehmen.
4. Neue Funktionen und Fehlerbehebungen möglichst in den bestehenden zuständigen Code einarbeiten statt weitere Patch-Schichten anzuhängen.
5. Nach der Änderung Build/Deployment und den betroffenen Funktionsweg prüfen.
6. Wenn die Änderung eine neue Funktion, einen relevanten Fehler, eine neue Ursache, eine Architekturentscheidung oder eine wichtige Erfahrung betrifft, `DEVELOPMENT.md` im selben Arbeitsgang ergänzen.

Ein Entwicklungsauftrag an MusicChatLab ist daher **nicht vollständig ausgeführt**, wenn diese Dokumentation vorher nicht gelesen und bei relevanten Erkenntnissen anschließend nicht aktualisiert wurde.

## Entwicklungsgrundsätze

### 1. Funktionen einarbeiten statt Patch-Ketten aufbauen

Neue Funktionen und Fehlerbehebungen sollen möglichst in die bestehende Architektur und die zuständigen Module eingearbeitet werden. Es soll **nicht** für jede Korrektur ein weiteres nachträglich geladenes Patch-Skript an die App angehängt werden.

Ein separates Übergangsmodul ist nur dann sinnvoll, wenn es eine klar abgegrenzte Funktion besitzt oder eine kurzfristige, kontrollierte Migration ermöglicht. Sobald die Lösung stabil ist, soll sie konsolidiert und an der fachlich richtigen Stelle integriert werden.

Ziel ist eine verständliche Codebasis mit klaren Zuständigkeiten statt einer wachsenden Kette von Überschreibungen, MutationObserver-Patches oder Laufzeitkorrekturen.

### 2. Eine Information – eine maßgebliche Quelle

Globale Zustände wie App-Version, Modellkatalog, Konfigurationswerte oder Dateiformat-Versionen dürfen nicht unabhängig an mehreren Stellen gepflegt werden, wenn dadurch widersprüchliche Zustände entstehen können.

Wo mehrere Darstellungen derselben Information nötig sind, sollen sie aus einer gemeinsamen Quelle gespeist werden.

### 3. Fehlerursache beheben, nicht nur Symptom überdecken

Vor einer Korrektur soll geprüft werden, warum ein Fehler entsteht. Cache, Deployment, Laufzeitcode und gespeicherte Zustände sind getrennt zu betrachten. Ein sichtbares Problem darf nicht vorschnell als Browser- oder PWA-Cacheproblem behandelt werden, wenn beispielsweise der aktuelle Stand überhaupt nicht erfolgreich veröffentlicht wurde.

### 4. Deployment gehört zum Test

Eine Änderung gilt bei der WebApp nicht allein deshalb als fertig, weil sie im Repository committed wurde. Der GitHub-Pages-Workflow muss erfolgreich durchlaufen und der veröffentlichte Stand muss mit dem Repository-Stand übereinstimmen.

### 5. Musikalische Freiheit erhalten

Technische Protokolle, strukturierte Aktionen, Validierung und Fehlerbehandlung dürfen robuster gemacht werden. Der musikalische Kompositionsauftrag an die KI soll dadurch aber nicht unnötig mit zusätzlichen musikalischen Detailvorgaben eingeengt werden. Die Erfahrung mit MusicChatLab und Composition Lab zeigt, dass zu enge musikalische Vorgaben die Qualität und Eigenständigkeit der Ergebnisse verschlechtern können.

## Architektur – Leitgedanke

MusicChatLab ist eine dialogorientierte musikalische Arbeitsumgebung. Die KI soll nicht nur einen isolierten Generator darstellen, sondern Musik analysieren, Varianten und Kompositionen erzeugen und im laufenden Gespräch weiterentwickeln können.

Wichtige Bereiche sind:

- Chat- und Kompositionsmodus
- direkte Provider-Anbindung für Anthropic, OpenAI und Google
- MIDI-/MusicXML-Verarbeitung
- CLAB-Dokumente und musikalischer Kontext
- MIDI-Speicherplätze und Wiedergabe
- strukturierte interne Kompositionsaktionen
- Diagnose und Kostenanzeige
- Backup/Wiederherstellung
- PWA-/GitHub-Pages-Betrieb

## Entwicklungsprotokoll

### Bis v1.3.14 – Konsolidierung der musikalischen Arbeitsumgebung

Die App wurde schrittweise um expliziten Chat-/Komponiermodus, MIDI-Arbeitsbereich, sechs MIDI-Speicherplätze, CLAB-Unterstützung, Diagnosefunktionen, Kostenanzeige und Backup-Funktionen erweitert. Die strukturierte Kommunikation zwischen KI-Antwort und musikalischer Aktion verwendet interne `MCL_ACTION`-Daten.

### September 2026 – unvollständige strukturierte Gemini-Aktion

**Beobachtung:** Gemini konnte einen musikalischen Änderungsauftrag inhaltlich korrekt planen und beschreiben, die interne MIDI-Aktion wurde jedoch als unvollständig erkannt und verworfen. Die App veränderte die Datei richtigerweise nicht.

**Diagnose:** Die Kombination aus Reasoning- und Outputumfang lag sehr nahe am konfigurierten Ausgabelimit. Dadurch konnte der abschließende strukturierte `MCL_ACTION`-Block abgeschnitten werden.

**Maßnahme:** Die Ausgabeprüfung wurde robuster und bleibt fail-closed: Eine unvollständige Aktion darf keine teilweise oder beschädigte MIDI-Datei erzeugen. Für partielle musikalische Änderungen soll weiterhin PATCH statt unnötiger vollständiger Wiederholung des Stücks verwendet werden.

**Lehre:** Technische Zuverlässigkeit sollte über Validierung und gegebenenfalls gezielte technische Wiederholung hergestellt werden, nicht über eine stärkere musikalische Reglementierung des Prompts.

### September 2026 – GitHub Pages blieb auf v1.3.14

**Beobachtung:** Im Repository lagen neuere Änderungen, online blieb jedoch v1.3.14 sichtbar.

**Ursache:** Der GitHub-Pages-Workflow prüfte beim Build noch auf zwei inzwischen nicht mehr vorhandene Dateien (`concept-openai.js` und `midi-stop-reset.js`). Der Build brach deshalb ab. Die neuen Commits waren vorhanden, wurden aber nicht veröffentlicht.

**Maßnahme:** Die veralteten Dateiprüfungen im Pages-Workflow wurden durch Prüfungen der tatsächlich aktuellen App-Dateien ersetzt.

**Lehre:** Bei einem Versionsunterschied zwischen Repository und WebApp zuerst den Deployment-Workflow prüfen. Ein Cacheproblem darf erst angenommen werden, wenn der aktuelle Build tatsächlich erfolgreich veröffentlicht wurde.

### v1.3.15–v1.3.17 – widersprüchliche Versionsanzeigen

**Beobachtung:** Beim Start erschien zunächst v1.3.15; anschließend sprang die Anzeige auf v1.3.16 bzw. wurde von Laufzeitcode verändert.

**Ursache:** Mehrere voneinander unabhängige Versionsstände existierten gleichzeitig:

- `index.html` enthielt v1.3.15,
- ein Erweiterungsskript enthielt eine eigene v1.3.17-Konstante und konnte die Anzeige nachträglich überschreiben,
- der Service-Worker-Cache hieß noch v1.3.16.

Zusätzlich war das Modell-Erweiterungsskript zeitweise nicht sauber in die App-/Cache-Struktur eingebunden.

**Maßnahme:** Die sichtbaren Versionsangaben wurden auf v1.3.17 vereinheitlicht. Das Modell-Erweiterungsskript darf die App-Version nicht mehr als eigene konkurrierende Quelle überschreiben. Der Service-Worker-Cache wurde auf denselben Release-Stand gebracht und das Modellmodul in den App-Shell-Cache aufgenommen.

**Lehre:** Die Versionsnummer darf nicht durch unabhängige Patch-Skripte korrigiert werden. Künftig soll eine maßgebliche Versionsquelle verwendet werden; Cache-Versionen sind bewusst mit dem Release zu synchronisieren.

### v1.3.16/v1.3.17 – Erweiterung der KI-Modelle

Die Modellauswahl wurde für neuere OpenAI- und Anthropic-Modelle erweitert, darunter GPT-6 Astra und Claude Fable 5.1. Bestehende Modelle sollen für direkte musikalische Vergleichstests grundsätzlich erhalten bleiben, solange sie noch sinnvoll nutzbar sind.

Die Modellpflege soll künftig als regulärer Bestandteil der Provider-/Modellarchitektur erfolgen und nicht als dauerhafte Folge von UI-Patches.

### v1.3.18 – installierte PWA blieb nach erfolgreichem Deployment auf v1.3.15

**Beobachtung:** Nach vollständigem Schließen und erneutem Öffnen der installierten App zeigte das Gerät weiterhin v1.3.15, obwohl `index.html` und Service Worker im Repository bereits v1.3.17 enthielten und GitHub Pages erfolgreich deployt hatte.

**Diagnose:** Damit waren Repository- und Deployment-Stand als primäre Ursache ausgeschlossen. Das Problem lag im Lebenszyklus der installierten PWA: Eine bereits installierte App kann einen älteren App-Shell-/Service-Worker-Stand weiterverwenden, wenn die Aktualisierung nicht aktiv und eindeutig gesteuert wird. Nur den Cache-Namen bei einem Release zu ändern ist dafür nicht ausreichend zuverlässig.

**Maßnahme:** Die Update-Logik wurde in die bestehende PWA-Start- und Service-Worker-Architektur eingearbeitet. Der Service Worker verwendet für Navigationen `cache: 'no-store'`, für statische Ressourcen `cache: 'no-cache'`, übernimmt Clients nach Aktivierung und entfernt alte App-Caches. Der Installations-Cache wird mit `cache: 'reload'` aufgebaut. Release-Stand ist v1.3.18.

**Lehre:** Bei installierten PWAs müssen Deployment und Client-Aktualisierung als zwei getrennte Stufen behandelt werden. Ein erfolgreicher Pages-Deploy beweist nicht, dass eine bereits installierte PWA den neuen App-Shell-Stand übernommen hat. Der Update-Lebenszyklus muss Bestandteil der App-Architektur sein und bei künftigen Releases mitgetestet werden.

### Übergang v1.3.17 → v1.3.18 – Recovery für bereits festhängende Installationen

**Beobachtung:** Die installierte iPad-PWA wechselte nach mehreren Neustarts von v1.3.15 auf v1.3.17, blieb anschließend jedoch auf v1.3.17. Der neue Update-Code aus v1.3.18 kann naturgemäß erst wirken, nachdem der Client v1.3.18 wenigstens einmal geladen hat.

**Maßnahme:** Für diesen Altbestand wurde ein bewusst getrenntes Wartungswerkzeug `pwa-recover.html` angelegt. Es ist **kein dauerhaft in die App geladener Patch**. Beim gezielten Aufruf deregistriert es ausschließlich Service Worker im Scope `/Music-Chat-Lab/`, löscht ausschließlich Caches mit dem Präfix `music-chat-lab-` und lädt anschließend `index.html` mit einem einmaligen Cache-Buster neu. Lokale Chats, MIDI-Arbeitsdaten und API-Einstellungen im Local Storage werden dabei nicht gelöscht.

**Lehre:** Eine neue Update-Architektur kann einen bereits festhängenden alten Client nicht rückwirkend ausführen. Für solche einmaligen Migrationen ist ein expliziter, isolierter Recovery-Einstieg sauberer als weitere Laufzeit-Patches im normalen App-Code.

### v1.3.18 – Oberfläche sichtbar, aber Bedienung nach Migration tot

**Beobachtung:** Nach erfolgreichem Übergang zeigte die installierte App v1.3.18, reagierte aber auf keinerlei Bedienung.

**Diagnose:** Der einzige funktionale Unterschied in `index.html` zwischen dem zuletzt bedienbaren v1.3.17-Stand und v1.3.18 war der neu eingefügte Inline-Code zur aktiven Service-Worker-Registrierung, `registration.update()`, `skipWaiting` und automatischem Reload bei `controllerchange`. Damit war dieser neue Startpfad der unmittelbar verdächtige Regressionsbereich; die eigentlichen App-Skripte und ihre Reihenfolge waren unverändert.

**Maßnahme:** Der v1.3.18-Startcode wurde auf den zuletzt funktionierenden v1.3.17-Startpfad zurückgesetzt, während Versionsanzeige, Manifest-Release und der v1.3.18-Service-Worker erhalten bleiben. Damit wird die Update-Logik nicht mehr während der normalen UI-Initialisierung erzwungen. Kein neuer Patch wurde hinzugefügt.

**Lehre:** Service-Worker-Aktualisierung darf den normalen App-Start nicht kontrollieren oder durch Reload-/Controller-Wechsel beeinflussen. Zuerst muss die Anwendung vollständig bedienbar starten; Update-Mechanik muss davon entkoppelt und anschließend separat getestet werden.

## Offene Konsolidierungsaufgaben

- Modellkatalog langfristig an einer fachlich eindeutigen Stelle pflegen und provisorische Erweiterungslogik gegebenenfalls in die Provider-Architektur integrieren.
- Versionsverwaltung weiter zentralisieren, sodass sichtbare Version, Diagnose und Cache-Release nicht manuell auseinanderlaufen können.
- API-Key-Persistenz über Neustarts/PWA-Lebenszyklus zuverlässig prüfen und gegebenenfalls mit einer robusteren persistenten Speicherung absichern.
- Backup auf Mobilgeräten, insbesondere iPad/iOS, hinsichtlich auffindbarer Speicherung, Dateiname und Wiederherstellung weiter verbessern.
- Bei Änderungen regelmäßig prüfen, ob ältere Kompatibilitäts- oder Patchmodule inzwischen in Kernmodule übernommen und entfernt werden können.
- PWA-Updates künftig nicht nur im Pages-Workflow, sondern auch hinsichtlich des installierten Client-Lebenszyklus prüfen.
- `pwa-recover.html` nach erfolgreicher Migration des Altbestands als Wartungswerkzeug bewerten; es darf nicht als reguläre Patch-Schicht in die App eingebunden werden.
- Update-Mechanik nach Wiederherstellung der Bedienbarkeit isoliert testen, ohne den normalen App-Start erneut mit erzwungenem Reload zu koppeln.

## Vorgehen bei zukünftigen Änderungen

Bei einer größeren Funktion oder Fehlerbehebung:

1. bestehenden zuständigen Code und Datenfluss bestimmen,
2. Ursache bzw. gewünschte Architektur festhalten,
3. Änderung möglichst im zuständigen Modul integrieren,
4. keine neue Patch-Datei anlegen, wenn eine saubere Integration möglich ist,
5. Versions- und Cachezustand konsistent aktualisieren,
6. Deployment prüfen,
7. wesentliche Änderung, Problemursache und Lehre hier dokumentieren.

Damit soll MusicChatLab nicht nur funktionsreicher, sondern mit jeder Entwicklungsstufe auch strukturell klarer werden.
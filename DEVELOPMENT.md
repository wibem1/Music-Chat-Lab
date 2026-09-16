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

## Offene Konsolidierungsaufgaben

- Modellkatalog langfristig an einer fachlich eindeutigen Stelle pflegen und provisorische Erweiterungslogik gegebenenfalls in die Provider-Architektur integrieren.
- Versionsverwaltung weiter zentralisieren, sodass sichtbare Version, Diagnose und Cache-Release nicht manuell auseinanderlaufen können.
- API-Key-Persistenz über Neustarts/PWA-Lebenszyklus zuverlässig prüfen und gegebenenfalls mit einer robusteren persistenten Speicherung absichern.
- Backup auf Mobilgeräten, insbesondere iPad/iOS, hinsichtlich auffindbarer Speicherung, Dateiname und Wiederherstellung weiter verbessern.
- Bei Änderungen regelmäßig prüfen, ob ältere Kompatibilitäts- oder Patchmodule inzwischen in Kernmodule übernommen und entfernt werden können.

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
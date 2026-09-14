# Music Chat Lab

Music Chat Lab ist die aktive Web-Anwendung für den dialogorientierten Kompositionsworkflow.

## Rolle

Dieses Repository ist die **einzige aktive Entwicklungsquelle** von Music Chat Lab und zugleich die Basis für das GitHub-Pages-Deployment.

Aktueller freigegebener Stand:

- Music Chat Lab **v1.3.14**
- Kompositionskern: **Engine Build 14**
- gemeinsames Projektformat: **CLAB v1**

## Schwerpunkte

- Komponieren im Dialog mit der KI
- Fortsetzen, Variieren und gezieltes Bearbeiten bestehender Kompositionen
- MIDI-Import, -Export und Wiedergabe
- mehrere Kompositions-Slots zum Vergleichen und Weiterarbeiten
- Verlauf, Wiederaufnahme und Backup
- CLAB-v1-Projektdokumente
- gemeinsame musikalische Basis mit Composition Lab Native

## Technische Besonderheit

Der aktuelle Player verwendet `Soundfont.instrument(...)` für FluidR3-GM-Klänge. In `index.html` besteht derzeit noch ein historischer externer Script-Verweis auf `wibem1/Composer-Lab/soundfont-player.js`. Diese Abhängigkeit soll durch eine direkte Soundfont-Player-Abhängigkeit ersetzt werden; bis dahin darf die Zeile nicht ersatzlos entfernt werden.

## Entwicklungsregel

Neue Funktionen und Reparaturen werden direkt in diesem Repository konsolidiert. Historische Patch-Module dürfen erst entfernt werden, wenn ihre Funktion vollständig in den aktuellen Kern übernommen wurde und keine aktive Referenz mehr besteht.

`Composer-Lab` ist keine aktive Architekturquelle mehr. Gemeinsame Formate und Verträge sollen lokal dokumentiert oder mit den verbleibenden aktiven Projekten abgestimmt werden.

# Music Chat Lab

Music Chat Lab ist die aktive Web-Anwendung für den dialogorientierten Kompositionsworkflow.

## Rolle

Dieses Repository ist die **einzige aktive Entwicklungsquelle** von Music Chat Lab und zugleich die Basis für das GitHub-Pages-Deployment.

Aktueller Repository-Stand:

- Music Chat Lab **v1.9.5**
- Kompositionskern: **zentraler stabiler Composition-Engine-Entry-Point (aktuell 2.3.2)**
- Status: **CURRENT CODE**; praktischer Runtime-Test von v1.9.5 ist noch nicht als SAFE dokumentiert
- gemeinsames Projektformat: **CLAB v1**

## Schwerpunkte

- Komponieren im Dialog mit der KI
- Fortsetzen, Variieren und gezieltes Bearbeiten bestehender Kompositionen
- MIDI-Import, -Export und Wiedergabe
- mehrere Kompositions-Slots zum Vergleichen und Weiterarbeiten
- Verlauf, Wiederaufnahme und Backup
- CLAB-v1-Projektdokumente
- gemeinsame musikalische Basis mit Composition Lab Native

## Audio-Wiedergabe

Der Player verwendet `soundfont-player` direkt über dessen Browser-Build und lädt FluidR3-GM-Klänge über `Soundfont.instrument(...)`. Es besteht keine Laufzeit-Abhängigkeit mehr vom ehemaligen `Composer-Lab`-Repository.

## Entwicklungsregel

Neue Funktionen und Reparaturen werden direkt in diesem Repository konsolidiert. Historische Patch-Module dürfen erst entfernt werden, wenn ihre Funktion vollständig in den aktuellen Kern übernommen wurde und keine aktive Referenz mehr besteht.

`Composer-Lab` ist keine aktive Architekturquelle mehr. Gemeinsame Formate und Verträge sollen lokal dokumentiert oder mit den verbleibenden aktiven Projekten abgestimmt werden.

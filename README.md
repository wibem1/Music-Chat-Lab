# Music Chat Lab

Music Chat Lab ist die aktive Web-Anwendung für den dialogorientierten Kompositionsworkflow.

## Rolle

Dieses Repository ist die **einzige aktive Entwicklungsquelle** von Music Chat Lab und zugleich die Basis für das GitHub-Pages-Deployment.

Aktueller freigegebener Stand:

- Music Chat Lab **v2.0.0**
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

## Audio-Wiedergabe

Der Player verwendet `soundfont-player` direkt über dessen Browser-Build und lädt FluidR3-GM-Klänge über `Soundfont.instrument(...)`. Es besteht keine Laufzeit-Abhängigkeit mehr vom ehemaligen `Composer-Lab`-Repository.

## Entwicklungsregel

Neue Funktionen und Reparaturen werden direkt in diesem Repository konsolidiert. Historische Patch-Module dürfen erst entfernt werden, wenn ihre Funktion vollständig in den aktuellen Kern übernommen wurde und keine aktive Referenz mehr besteht.

`Composer-Lab` ist keine aktive Architekturquelle mehr. Gemeinsame Formate und Verträge sollen lokal dokumentiert oder mit den verbleibenden aktiven Projekten abgestimmt werden.

## Kompositionsmodell 2.0

Neue Kompositionen entstehen zweistufig: Zuerst komponiert die gewählte KI einen freien musikalischen Entwurf ohne MIDI-Protokoll. Erst danach übersetzt eine technische Stufe den fertigen Entwurf werkgetreu in das MCL-Aktions-/MIDI-Format. Tempo- und Taktwechsel können als `tm`- bzw. `tsm`-Verläufe erhalten und in die exportierte MIDI-Datei geschrieben werden. Dynamik und Artikulation werden mit allgemeinen MIDI-Mitteln bewahrt; instrumentenspezifische SWAM-Steuerungen gehören ausdrücklich nicht zu MusicChat Lab.

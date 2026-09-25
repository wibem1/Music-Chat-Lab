# Music Chat Lab – Stabilitätsstand

## Aktueller Stand: v1.9.0

Der freigegebene Kompositionspfad verwendet den zentralen Composition-Engine-Entry-Point und darf keine eigene musikalische Prompt- oder Reparaturpipeline daneben führen.

Verbindlicher Ablauf:
1. Kompositionsauftrag des Nutzers, gegebenenfalls ausdrücklich referenziertes Material.
2. Freie vollständige Komposition ohne vorgeschalteten Klang-/Formplan.
3. Werkgetreue technische Übersetzung durch die zentrale Engine.
4. Beschreibung erst nach der fertigen Komposition.

Kompositionsauftrag und Kompositionsbeschreibung bleiben im CLAB-Dokument getrennte Felder. Der Auftrag darf `score.sm` nicht überschreiben.

Der Look-ahead-Player ist der aktive Playback-Scheduler. Browser-/Geräteaudio bleibt ein manueller Runtime-Test und darf nicht allein aus statischen Tests als behoben bezeichnet werden.

Historische Recovery-Branches bleiben Referenzen, bestimmen aber nicht die aktuelle Runtime-Architektur.

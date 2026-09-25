# Music Chat Lab – Stabilitätsstand

## Aktueller Stand: v1.9.1

Der freigegebene Kompositionspfad verwendet den zentralen Composition-Engine-Entry-Point **2.1.0** und darf keine eigene musikalische Prompt- oder Reparaturpipeline daneben führen.

Verbindlicher Ablauf:
1. Kompositionsauftrag des Nutzers, gegebenenfalls ausdrücklich referenziertes Material.
2. Freie vollständige Komposition ohne vorgeschalteten Klang-/Formplan.
3. Werkgetreue technische Übersetzung durch die zentrale Engine.
4. Beschreibung erst nach der fertigen Komposition.

Kompositionsauftrag und Kompositionsbeschreibung bleiben im CLAB-Dokument getrennte Felder. Der Auftrag darf `score.sm` nicht überschreiben.

Der Look-ahead-Player ist der aktive Playback-Scheduler. Browser-/Geräteaudio bleibt ein manueller Runtime-Test und darf nicht allein aus statischen Tests als behoben bezeichnet werden.

Historische Recovery-Branches bleiben Referenzen, bestimmen aber nicht die aktuelle Runtime-Architektur.


## 25.09.2026 – v1.9.1 Runtime-Recovery
- Falsche historische Behauptung einer freigegebenen Composition Engine 2.2 verworfen; tatsächlich freigegeben ist 2.1.0.
- Externe Engine-Runtime explizit mit `?v=2.1.0` gebunden.
- Veraltete Pages-Deploy-Prüfung auf nicht mehr vorhandene Engine 1.3 korrigiert; sie blockierte den aktuellen Deploy.
- Interne Engine-/Orchestratorfehler werden mit Engine-Version, Provider, Modell, Meldung und Stack diagnostiziert und nicht mehr als pauschaler API-Fehler 500 ausgegeben.

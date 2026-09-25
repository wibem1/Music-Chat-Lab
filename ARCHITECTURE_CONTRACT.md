# ARCHITECTURE CONTRACT – Music Chat Lab

## Trennung von Chat und Komposition

**Chat** darf analysieren, diskutieren und ausdrücklich angefordertes Material aus dem Arbeitstisch berücksichtigen.

**Komponiere** ruft den zentralen freigegebenen Composition-Engine-Pfad auf. Music Chat darf dessen musikalische Prompts, Provider-Request-Bodies oder technische Fortsetzungslogik nicht durch eigene Varianten ersetzen.

## Standard-Kompositionspfad

1. Verbindlicher aktueller Kompositionsauftrag des Nutzers; ausdrücklich referenziertes Ausgangsmaterial darf als Teil dieses Auftrags mitgegeben werden.
2. Freie vollständige Komposition. Keine von Music Chat oder der Engine erfundene vorgeschaltete Form-, Harmonie-, Dramaturgie- oder Klangplan-Stufe.
3. Rein technische, werkgetreue Übersetzung der fertigen Komposition.
4. Deterministische technische Verarbeitung.
5. Beschreibung erst nach der fertigen Komposition.

## Zuständigkeiten

- Composition Engine: musikalische Pipeline, Provider-Adapter für Kompositionsstufen, Partiturvertrag, technische Fortsetzung abgeschnittener Engine-Ausgaben.
- Music Chat: Chat-Kontext, Arbeitstisch, UI, CLAB, Player, Verlauf und Diagnose.
- Der Orchestrator darf Engine-Aufrufe transportieren und protokollieren, aber keine zweite Kompositions- oder Reparaturengine bilden.

## Datenfelder

Kompositionsauftrag und Kompositionsbeschreibung sind getrennte Daten. Beim CLAB-Speichern darf der aktuelle Auftrag `score.sm` / die erzeugte Beschreibung nicht überschreiben.

## Freigabe

Vor Freigabe werden geladene Engine-Version, tatsächlich versendete Prompts, Service-Worker-/Asset-Versionen, CLAB-Felder und Player-Diagnose geprüft. Ein erfolgreicher Build ist kein musikalischer Hörtest.

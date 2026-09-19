# MusicChatLab – Prompt-Architektur

Stand: v1.4.43

## Grundsatz
Die App organisiert; die KI musiziert. Musikalische Komposition und technische MIDI-Materialisierung sind getrennte Aufgaben. Der verbindliche übergeordnete Rahmen steht in `ARCHITECTURE_CONTRACT.md`.

## CHAT
Der Chat dient Gespräch, Analyse, Kritik und Ideenentwicklung. Er enthält kein MIDI-Aktionsprotokoll. Eine konkrete Kompositionsidee kann mit `MCL_CONCEPT` zur bewussten Übernahme in das Feld „Kompositionsauftrag“ angeboten werden.

## KOMPONIERE – Stufe 1: musikalische Komposition
Der gewählte Provider erhält den aktuellen Dialog, den verbindlichen Kompositionsauftrag und nur dann vorhandenes musikalisches Ausgangsmaterial, wenn der Auftrag darauf Bezug nimmt.

Diese Stufe ist die eigentliche Komposition. Sie trifft konkrete musikalische Entscheidungen über Tonhöhen, Rhythmen, Pausen, Stimmen, Form, Harmonik, Artikulation, Dynamik, Instrumentation und Verlauf. Sie ist weder Prosabauplan noch technische MIDI-Ausgabe.

Das fertige musikalische Ergebnis wird als vollständige ABC-Partiturnotation in einem `<MCL_MUSIC>`-Block ausgegeben. ABC ist hier ein musiknahes Zwischenformat: vollständig genug, um die musikalischen Entscheidungen festzuhalten, aber unabhängig von MCL_ACTION, MIDI-Pitchnummern und der internen JSON-Score-Struktur.

Für Claude Sonnet 5, Opus 5 und Sonnet 4.6 verwendet diese Stufe adaptive Thinking mit `effort: high`. Die musikalische Kompositionsstufe wird nicht wegen der späteren strukturierten Ausgabe gedrosselt.

## KOMPONIERE – Stufe 2: technische Materialisierung
Erst nach erfolgreicher musikalischer Komposition erhält eine zweite Provider-Anfrage das fertige `<MCL_MUSIC>`-Manuskript und das technische MCL_ACTION-/Score-Schema.

Diese Stufe darf nicht neu komponieren, ergänzen, vereinfachen oder musikalisch regularisieren. Ihre Aufgabe ist ausschließlich die Übertragung der bereits bestimmten Musik in die interne MIDI-Partitur.

Bei Claude wird Thinking in dieser technischen Stufe deaktiviert. Diese Drosselung betrifft ausdrücklich nicht die musikalische Komposition.

## Technische Validierung und Reparatur
Nach der Materialisierung werden ausschließlich formale Eigenschaften geprüft: Score-/Spurstruktur, gültige Startzeiten und Dauern, MIDI-Pitches, Velocity, Controllerwerte, positives Tempo und gültige Taktart.

Nur formale Fehler dürfen einen technischen Reparaturaufruf auslösen. Dieser erhält weiterhin das fertige musikalische Manuskript und darf keine musikalischen Entscheidungen ändern.

## Providerneutralität
Sol, Claude und Gemini erhalten denselben musikalischen Auftrag und dieselbe musikalische Freiheit. Provider-spezifische Einstellungen sind nur technische Anpassungen an die jeweilige API. Die Trennung Komposition → Materialisierung gilt für alle Provider.

## Diagnose
Die Diagnose unterscheidet die Aufrufstufen:
- `musical_composition`
- `midi_materialization`
- gegebenenfalls `midi_repair`
- `orchestrator_chat`

Damit lässt sich prüfen, ob technische MIDI-Regeln tatsächlich erst nach der musikalischen Komposition auftreten.

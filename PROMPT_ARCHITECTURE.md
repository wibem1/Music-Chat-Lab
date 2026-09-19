# MusicChatLab – Prompt-Architektur

Stand: v1.4.35

## Grundsatz
Die App organisiert; die KI musiziert. Kontext wird nur dann an ein Modell gesendet, wenn er für den aktuellen Zug tatsächlich gebraucht wird. Technische MIDI-Protokolle dürfen den normalen musikalischen Dialog nicht belasten.

## Datenweg
1. app.js baut den Provider-Request aus dem sichtbaren Chat.
2. session-orchestrator.js reduziert den Verlauf und ergänzt nur den für den Modus nötigen Kontext.
3. execution-mode.js fügt unmittelbar vor dem Provider-Aufruf nur den expliziten Modus und – im Komponiermodus – gegebenenfalls die bewusst übernommene Kompositionsidee ein.
4. ai-call-trace.js protokolliert genau diesen finalen Request schlüsselfrei.
5. Die Provider-Antwort wird anschließend technisch ausgewertet.

## CHAT
Zweck: musikalisches Gespräch, Analyse, Kritik, Ideenentwicklung.

Standardkontext bei leerem Arbeitstisch:
- eine kurze Rollenbeschreibung als musikalischer Gesprächs- und Kompositionspartner,
- expliziter CHAT-Modus,
- tatsächlicher Gesprächsverlauf.

Nicht enthalten:
- PATCH,
- MERGE,
- NEW_SCORE,
- REPLACE_SCORE,
- MIDI-Notenformat,
- vollständiges MIDI-Aktionsprotokoll.

Ein vorhandener Arbeitstisch wird nicht automatisch in den Chat eingebracht. Erst wenn der aktuelle Auftrag ausdrücklich den Arbeitstisch, einen Speicher/Slot/Stück-Index oder den Namen eines vorhandenen Stücks referenziert, wird der knappe Katalog ergänzt. Für eine Analyse, die exakte Noten benötigt, darf die KI dann mit einem kleinen MCL_NEED-Block gezielt Notendaten anfordern. Erst der Folgeaufruf erhält diese Notendaten.

Eine konkrete im Chat formulierte Kompositionsidee wird als MCL_CONCEPT zur Übernahme angeboten. Die KI fragt sichtbar, ob sie übernommen werden soll. Bestätigt der Nutzer den unmittelbar vorherigen Vorschlag, signalisiert MCL_ADOPT_CONCEPT die Übernahme ins Ideenfeld; komponiert wird dadurch noch nicht. Der Chat-Prompt schreibt weder Stil, Tonart, Form, Tempo noch eine stereotype Ideenstruktur vor.

## KOMPONIERE – neues Stück ohne Quellen
Zweck: direkte musikalische Erfindung und unmittelbare Ausgabe als MIDI-Partitur.

Voraussetzung: Das Feld „Kompositionsidee“ ist nicht leer. Ein leerer Wert blockiert den Komponiermodus lokal ohne Provider-Aufruf. Eine minimale Idee wie „ein Klavierstück“ ist vollständig zulässig und überlässt alle weiteren Entscheidungen der KI.

Kontext:
- die bewusst eingetragene Kompositionsidee als verbindlicher aktueller Kompositionsauftrag,
- relevanter Dialog,
- nur das NEW_SCORE-Übertragungsformat,
- kompaktes Notenformat.

Nicht enthalten:
- PATCH,
- MERGE,
- REPLACE_SCORE,
- Arbeitstisch-/Quellenprotokoll, wenn keine Quellen existieren.

Die KI komponiert die tatsächlichen Noten selbst. Es gibt keinen vorgeschalteten Prosabauplan.

## KOMPONIERE – Bearbeitung/Synthese mit Quellen
Nur wenn tatsächlich MIDI-Quellen auf dem Arbeitstisch vorhanden sind, werden zusätzlich geladen:
- knapper Katalog der vorhandenen Quellen,
- MCL_NEED für gezieltes Nachladen vollständiger Notendaten,
- PATCH,
- MERGE,
- REPLACE_SCORE.

Vollständige MCL_SCORE-Daten werden erst nach konkreter Anforderung geliefert. NEW_SCORE bleibt verfügbar, falls der aktuelle Auftrag tatsächlich eine neue Fassung verlangt.

## TECHNISCHE REPARATUR
Nur wenn eine erzeugte Aktion formal unbrauchbare MIDI-Daten enthält, erhält das Modell genau einen Reparaturauftrag mit den gefundenen technischen Fehlern. Musikalische Entscheidungen wie Tonart, Tempo, Form oder Pausen sind keine technischen Fehler.

## Diagnose- und Freigaberegel
Jeder Release-Smoke-Test prüft zusätzlich die Prompt-Architektur:
- leerer CHAT-Prompt bleibt klein und enthält kein MIDI-Aktionsprotokoll,
- neues Stück ohne Quellen enthält NEW_SCORE, aber weder PATCH noch MERGE,
- quellenbasierte Ausführung enthält die dafür nötigen Protokolle,
- vollständiger finaler Provider-Request bleibt in der Diagnose sichtbar.

Bei Qualitätsproblemen wird zuerst der tatsächlich gesendete Request untersucht. Zusätzliche Promptregeln werden nicht prophylaktisch angehängt.

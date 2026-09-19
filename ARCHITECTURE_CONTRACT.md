# MusicChatLab – Verbindlicher Architekturvertrag

## Zweck und Vorrang
Diese Datei enthält die **aktuell verbindlichen Architekturentscheidungen** des Projekts. Sie ist keine Entwicklungshistorie.

Vor jeder Änderung an MusicChatLab müssen zuerst diese Datei und danach `DEVELOPMENT.md` gelesen werden. Bei einem Widerspruch zwischen einer älteren historischen Notiz und diesem Architekturvertrag gilt dieser Vertrag. Ein Widerspruch darf nicht stillschweigend durch Code oder eine neue Interpretation aufgelöst werden.

Eine Änderung dieser Datei ist **keine normale Fehlerbehebung**. Grundsätze dürfen nur nach ausdrücklicher gemeinsamer Architekturentscheidung geändert werden. Ein einzelner Fehler, Provider-Ausfall, Test oder eine frühere Commit-Historie hebt sie nicht auf.

## A. Musikalische Komposition und technische Materialisierung

### A1. Getrennte Aufgaben
Musikalische Komposition und technische MIDI-/Score-Materialisierung sind zwei getrennte Aufgaben.

### A2. Volle Leistung beim Komponieren
In der musikalischen Kompositionsstufe erhält das gewählte Modell seine volle für die Aufgabe vorgesehene Denk-/Reasoning-Leistung. Die App darf die musikalische Leistungsfähigkeit eines Providers nicht drosseln, nur um die anschließende technische Ausgabe zuverlässiger zu machen.

Das gilt insbesondere für Claude: Claude wird **beim Komponieren nicht gedrosselt**.

### A3. Keine technische Schemafessel in der kreativen Stufe
Die kreative Stufe soll musikalische Entscheidungen treffen: Form, Melodik, Rhythmik, Harmonik, Stimmenführung, Instrumentation, Dynamik und konkrete musikalische Ereignisse. Sie darf nicht zu einer bloßen Beschreibung eines später erst zu komponierenden Stücks werden.

Technische MCL-/MIDI-/JSON-Protokolle und deren Validierungsanforderungen gehören nicht in diese kreative Aufgabe, soweit sie die musikalische Erfindung beeinflussen können.

### A4. Technische Materialisierung danach
Erst nach der musikalischen Komposition wird das bereits musikalisch bestimmte Ergebnis in das interne Score-/MCL_ACTION-/MIDI-Format übertragen.

In dieser **technischen** Stufe darf die Denk-/Reasoning-Leistung reduziert oder deaktiviert werden, wenn dies für eine vollständige und zuverlässige strukturierte Ausgabe erforderlich ist. Diese Stufe darf keine neue musikalische Komposition erfinden und musikalische Entscheidungen nicht eigenmächtig „verbessern“ oder regularisieren.

### A5. Kein Prosabauplan als Ersatz für Komposition
Die Trennung darf nicht den Fehler des früheren v1.4.28-Ansatzes wiederholen: Stufe 1 darf nicht lediglich einen Prosabauplan erzeugen, den Stufe 2 erst musikalisch konkretisieren müsste. Vor der technischen Materialisierung müssen die für das Stück maßgeblichen musikalischen Entscheidungen bereits vorliegen.

## B. Providerneutralität
Sol, Claude und Gemini erhalten musikalisch denselben Auftrag und dieselbe Freiheit. Provider-spezifische Unterschiede sind nur dort zulässig, wo die jeweilige API technisch unterschiedliche Mechanismen verlangt.

Provider-spezifische Token-, Thinking- oder Reasoning-Sonderregeln benötigen eine dokumentierte technische Ursache. Sie dürfen die musikalische Kompositionsstufe nicht qualitativ herabsetzen.

## C. Technische Validierung
Validierung nach der Materialisierung prüft technische Integrität und ausdrücklich messbare Anforderungen. Sie ist keine zweite Kompositionsinstanz.

Eine technische Reparatur darf fehlerhafte Struktur korrigieren, aber nicht ohne ausdrücklichen Auftrag Stil, Harmonik, Melodik, Rhythmik oder Form umgestalten.

## D. Entwicklungsdisziplin

### D1. Erst Vertrag, dann Historie, dann Code
Vor jeder Codeänderung:
1. diesen Architekturvertrag vollständig lesen,
2. `DEVELOPMENT.md` vollständig lesen,
3. den betroffenen Daten- und Aufrufpfad bestimmen,
4. geplante Änderung gegen die Invarianten dieses Vertrags prüfen.

### D2. Kein Patchen gegen die Architektur
Eine Änderung wird in der zuständigen bestehenden Architektur vorgenommen. Keine zusätzlichen Override-, Wrapper- oder Hotfix-Schichten, wenn die verantwortliche Stelle korrigiert werden kann.

### D3. Inhaltsprüfung vor Commit/PR
Bevor ein geänderter Stand als Kandidat auf GitHub weitergegeben wird, wird der vollständige Diff zum letzten stabilen Stand inhaltlich geprüft:
- entspricht er diesem Vertrag?
- gibt es doppelte oder widersprüchliche Logik?
- entstehen neue Provider-Sonderwege?
- werden nicht betroffene Funktionen verändert?
- sind Annahmen als Annahmen kenntlich und nicht als bewiesene Ursache dokumentiert?
- stimmen Versionsangaben und Tests mit dem tatsächlichen Stand überein?

### D4. Automatische Tests sind die letzte, nicht die erste Qualitätskontrolle
CI/Smoke-Tests prüfen kodierte technische Erwartungen. Ein grüner Test beweist nicht, dass eine Architekturentscheidung richtig ist. Automatische Tests erfolgen **nach** der inhaltlichen Code-/Diff-Prüfung.

### D5. Keine Freigabe ohne Nachweis
Ein Stand darf erst als Testbuild weitergegeben werden, wenn die automatisierbaren Prüfungen bestanden sind. Nicht automatisierbare Provider-, Musikqualitäts- oder Geräteeigenschaften werden ausdrücklich als noch ungeprüft bezeichnet.

## E. Aktueller Konflikt im Code
Der stabile Stand v1.4.41 enthält derzeit einen kombinierten direkten Kompositions-/MCL_ACTION-Aufruf. Bei Claude wird in diesem kombinierten Aufruf Thinking deaktiviert. Das widerspricht A1–A4 und ist deshalb als zu korrigierende Architekturabweichung zu behandeln, nicht als neuer Grundsatz.

Der verworfene v1.4.42-Versuch mit `adaptive/medium` und 20.000 Tokens löst diesen Widerspruch nicht, weil Komposition und technische Materialisierung weiterhin im selben Aufruf gekoppelt bleiben. Dieser Ansatz darf nicht als Ausgangspunkt der Korrektur verwendet werden.

## F. Änderung dieses Vertrags
Änderungen an den Abschnitten A–C bedürfen einer ausdrücklichen Architekturentscheidung. Sie dürfen nicht allein aufgrund eines fehlgeschlagenen Builds, einer Diagnose oder einer vermeintlich einfacheren Implementierung vorgenommen werden.

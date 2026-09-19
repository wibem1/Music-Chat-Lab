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

### A3. Referenz-Engine: Minimal Composer
Die Kompositionsengine von `wibem1/Minimal-Composer` ist der verbindliche Referenzstand für Music Chat Lab. Sie wird ohne kompositorische oder promptseitige Änderungen übernommen; zulässig sind ausschließlich notwendige Anpassungen an die Music-Chat-Umgebung, insbesondere Übergabe des aktuellen Kompositionsauftrags bzw. ausdrücklich referenzierten Ausgangsmaterials und die lokale Konvertierung des unveränderten technischen Partiturformats in das interne Music-Chat-Scoreformat.

Die musikalische erste Stufe bleibt frei von MIDI-, JSON-, ABC- oder MCL-Ausgabeformaten und verwendet den Prompt der Referenz-Engine unverändert.

### A4. Technische Materialisierung danach
Erst nach der musikalischen Komposition wird das bereits musikalisch bestimmte Ergebnis in das interne Score-/MCL_ACTION-/MIDI-Format übertragen.

In dieser **technischen** Stufe darf die Denk-/Reasoning-Leistung reduziert oder deaktiviert werden, wenn dies für eine vollständige und zuverlässige strukturierte Ausgabe erforderlich ist. Diese Stufe darf keine neue musikalische Komposition erfinden und musikalische Entscheidungen nicht eigenmächtig „verbessern“ oder regularisieren.

### A5. Keine eigenmächtige Optimierung der Referenz-Engine
Minimal Composer gilt nicht als ideal oder fehlerfrei. Verbesserungen bleiben ausdrücklich möglich, sind aber ein eigener späterer Entwicklungsschritt. Beim jetzigen Transfer nach Music Chat Lab darf die Engine nicht aufgrund theoretischer Architekturüberlegungen umgebaut, ergänzt oder „verbessert“ werden.

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

## E. Aktueller Referenzstand
Der direkte A/B-Test vom 19.09.2026 mit Claude Sonnet 5 und demselben offenen Klavierauftrag zeigte die derzeit deutlich höhere kompositorische Qualität von Minimal Composer gegenüber Music Chat Lab v1.4.43. Deshalb ist die aktuelle Aufgabe ausdrücklich der getreue Transfer der Minimal-Composer-Engine nach Music Chat Lab, nicht die Entwicklung einer neuen Kompositionsarchitektur.

## F. Änderung dieses Vertrags
Änderungen an den Abschnitten A–C bedürfen einer ausdrücklichen Architekturentscheidung. Sie dürfen nicht allein aufgrund eines fehlgeschlagenen Builds, einer Diagnose oder einer vermeintlich einfacheren Implementierung vorgenommen werden.

# Architektur-Konsolidierung – Baseline

Stand nach erster Codeanalyse auf `architecture-consolidation`.

## Aktuelle Transport-Patch-Kette

| Modul | Eingriff | Soll-Zustand |
|---|---|---|
| `request-control.js` | `window.fetch`, XHR open/send | AbortSignal explizit über Gateway |
| `api-usage.js` | `window.fetch`, XHR open/send | Usage aus Gateway-Ergebnis |
| `session-orchestrator.js` | `window.fetch`, Request/Response-Umbau | Session Builder + Session Controller |
| `execution-mode.js` | `window.fetch`, Prompt/Response-Umbau | expliziter `mode` im Session Request |
| `session-output-guard.js` | `window.fetch`, Tokenbudget | technische Provider-Policy im Gateway |
| `composition-state.js` | XHR send, Prompt-Patch | Session-/Kompositionsprompt an einer Stelle |

## Neue Grundlage
- `provider-gateway.js`: einzige vorgesehene Transportgrenze.
- `session-request.js`: explizites Requestobjekt und Parsing der Maschinenblöcke.
- `tests/provider-gateway.test.js`: Provider-Body-/Response-Verträge.
- `tests/session-request.test.js`: Session-/Maschinenblock-Verträge.
- `tests/request-architecture.test.js`: verhindert zusätzliche globale Transport-Patches während der Migration.
- `ARCHITECTURE.md`: verbindliche Zielarchitektur und Regressionstest-Matrix.

## Merge-Kriterium
Dieser Branch ist **nicht** mergefähig, solange die oben aufgeführten Alt-Wrapper noch Provider-Requests verändern. Sie werden nicht auf einmal gelöscht, sondern Funktion für Funktion durch explizite Aufrufe der neuen Schichten ersetzt und anschließend getestet.

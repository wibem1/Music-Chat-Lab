# Konsolidierungstests

Aus dem Repository-Root:

```bash
node tests/run-tests.js
```

Die Tests sind absichtlich zunächst unabhängig von der veröffentlichten WebApp. Sie sichern die neue Provider-Gateway-Schnittstelle und verhindern, dass während der Konsolidierung weitere globale Fetch-/XHR-Patches hinzukommen.

Der Architekturtest führt die bekannten Alt-Wrapper explizit als Migrationsschuld auf. Zielzustand vor Merge: diese Liste ist leer; anschließend wird die temporäre Ausnahme `legacyAllowed` entfernt und jeder globale Transport-Patch außerhalb des Gateways schlägt den Test fehl.

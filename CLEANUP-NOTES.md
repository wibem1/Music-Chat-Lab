# Cleanup status

This repository is the active source repository for Music Chat Lab.

Cleanup work is in progress. Historical patch modules must not be removed unless they are no longer referenced by the active runtime (`index.html`, `app.js`, or imported modules).

Current project role:
- dialogue and composition workflow reference
- Engine Build 14 integration
- CLAB v1 project format
- MIDI import/export/playback and slot workflow

`Composer-Lab` is no longer an active architectural dependency. Any remaining references to it are historical and should be removed or replaced with local documentation as the cleanup proceeds.

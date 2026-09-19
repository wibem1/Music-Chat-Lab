# MusicChat Lab v1.4.0 development baseline

Runtime-stable recovery point: branch `stable-runtime-v1.3.21`.

v1.4.0 is rebuilt directly from that runtime-confirmed baseline. Failed 2.x experiments are not a code base for this release.

## Composition rule

For an explicit **Komponiere** turn the new composition path is:

1. free musical draft — musical decisions only, no MIDI/JSON;
2. faithful technical translation into MusicChat's existing MIDI action contract.

The second stage must not recompose, simplify, or regularize the musical draft.

Chat mode remains the existing MusicChat conversation workflow.

## Stability rule

The branch `stable-runtime-v1.3.21` remains untouched. v1.4.0 is a development candidate until runtime-tested by the user. Static/syntax checks do not establish runtime stability.

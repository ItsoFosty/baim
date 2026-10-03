# Bai Mitko look into distance — historical source provenance

Preservation audit: 2026-10-03. This is a historical provenance index, not an animation configuration or a new approval gate. No generation, runtime asset, playback, dialogue or approval state is changed by preserving these records.

## Original record

The [unchanged production notes](historical/look-east-c02-production-notes.json) preserve the full original prompt, recorded Hydra settings, candidate selection and rejection narrative from the legacy Windows checkout. Original location: `assets_src/characters/bai_mitko/external_animation_v1/animation-production-notes.json` in that checkout.

- Original note SHA-256: `8b270c9904000ca0cb1d87b51631d769016478b1c0e98adaeffeaa8bf413827f` (1,789 bytes).
- Historical source key: `look_east_1`; recorded Ludo label: `bm-look-e-c02-selected`.
- Historical export filename: `bai-mitko-look-east-1.zip`.
- The old `selected`, pending complete-motion/in-game review, and rejected-c01 statements are historical observations. They are not current review instructions, live status fields or proof that c01 is still available in Ludo. This preservation does not assign a new `runtime_approved` status.

## Verified mapping to the existing canonical source

The historical ZIP is byte-identical to the existing [canonical original ZIP](input/bai-mitko-look-into-distance-east-1.zip): SHA-256 `8a1615cba2023a851065aaf81c53cb2e5f7577ed87780ac9683a0f729ffcbb7c`, 7,057,771 bytes. No duplicate ZIP was imported.

Canonical integration is recorded in Git commit `e684644447a20f34f1cc087e751eee290933f5c5` (`feat: add Bai Mitko look into distance animation`, 2026-09-29). The current [selection configuration](external-animation-selection.json) uses `look_into_distance_east_1` and mirrored `look_into_distance_west_1`; the active east animation is 16 frames at 6 fps, non-looping. These names and playback settings remain unchanged. The [catalog metadata](animation-catalog-metadata.json) remains the current display description.

## Evidence limits

The preserved JSON records Animate/Hydra, a 3-second maximum, Auto margin, 16 maximum frames, True Size, loop OFF, trim OFF and a 9-credit cost. These are historical recorded settings, not independently recovered service telemetry or a verified spending receipt. Generation settings and current runtime timing are different concepts; do not use this note to restore the superseded 12-fps Windows integration.

The historical `sourceImage` path identifies the intended reference but does not establish its exact original bytes or hash. No unique generation ID, original generation timestamp, service share URL, reference-image hash or independent credit receipt is present in this record. None has been invented or inferred from the candidate label. The record's selection statement is preserved as historical evidence, not upgraded into new approval authority.

Keep the original note and canonical ZIP intact. This index is outside the runtime ingestion configuration; future animation work follows the current production workflow, not the historical note's pending wording.

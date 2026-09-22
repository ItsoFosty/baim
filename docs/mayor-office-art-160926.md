# Mayor office and character art — 16 September 2026

User approved a separate office and the preview character identities, with a
more fashionable but imperfect early-1990s hairstyle for the journalist.

Built-in imagegen produced four individually prompted assets. Sources and exact
prompts are preserved in `assets_src/chapter1/mayor-office-v1/`. Runtime cutouts:

- `assets/chapter1/characters/journalist/standing-v1.png`
- `assets/chapter1/characters/mayor/standing-v1.png`

Both retain generated alpha, trimmed and resized to 800 pixels high. The office
background is normalized to 1280×720. Only the generated door region (x674,
y212, width78, height241) is composited onto the approved municipal background;
every other original background pixel and existing foreground prop is preserved.
The plaque reads КМЕТ / MAYOR; localized exit text identifies the office.

New stable IDs: scene.chapter1.mayor_office, npc.mayor,
exit.municipality.to_mayor_office, exit.mayor_office.to_municipality,
hotspot.mayor_office.desk. Geometry/layer sources are under
`assets_src/chapter1/scenes/mayor_office/`; builders include the new room.

The office is currently enterable for staging review. Its eventual story gate,
Mayor dialogue, receipt confrontation and stamp action are not implemented by
this art pass. Journalist timing still follows the old ballot-recovery trigger;
her early-campaign appearance remains the next gameplay task. Existing approved
Mitko animation, table and seal assets remain in use.

Validation: all 222 tests pass. Added door/return landing and furniture navigation
checks; browser clicks verified entry and return, plus office save/reload. Updated
the source stamp hotspot to include its visible seal after rebuilding exposed a
stale polygon. Runtime previews are saved beside the generation sources.

Registration follow-up: the office is now gated by the journalist's receipt
(or existing registration for legacy saves). Its reporter cutout follows the
local NPC's availability and appears after handover, remaining through validation
until the clerk registers Mitko. The conversation sequence is now implemented;
the dedicated stamping animation remains presentation work. See
`registration-witness-preview.png` for the in-room staging.

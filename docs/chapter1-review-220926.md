# Chapter 1 browser review — 22 September 2026

## Implemented in this pass

The polling room now has a painted background, the existing Mayor/reporter/Penka
art, conditional Baba/Tony attendance, a delivered ballot-box layer and a new
creditor pair. Use the commission table (or talk to the Mayor/Penka) to deliver
the box, answer three objections and explicitly commit to voting. Objections may
be answered in any order. Until the final confirmation, the player can leave,
finish support quests and return. Dropping the box before delivery remains
recoverable through the normal dropped-item system. Delivery never respawns it.

The dialogue covers registration, the checked expense record and the transparent
container classification. It uses recorded progress, not continued possession of
already-submitted evidence. Legacy registered/recovered saves can continue without
replaying the replacement registration/archive routes.

All three results now include a saved explanation, supporter report and three
short epilogue beats. The outgoing Mayor hands over keys only on wins. The
fountain callback depends on actual repair; creditors appear in every ending.
Outcome and explanation are selected once. Reloads preserve the epilogue position.

Every inventory item now has an icon. The diploma changes appearance after its
stamp. Existing approved assets are preserved; new room/art is awaiting human
visual approval. New prompts, originals, chroma sources and icon crop coordinates
are in `assets_src/chapter1/scenes/election_booth/`.

Optional sound is available in the pause menu: quiet synthesized paper/stamp
cues, distinct result motifs and a polling-room fluorescent hum. Default is muted.
This is an initial sound pass, not a commissioned soundtrack or voice acting.

## Deterministic outcome contract

Rules are tested in this order:

1. Convincing victory: both named supporters, influence >= 40, public mood >= 55,
   suspicion <= 35.
2. Narrow victory: both named supporters, regardless of meters; OR at least one
   supporter with influence >= 15, public mood >= 35, suspicion <= 70.
3. Loss: all other campaigns.

Rationale: the two support puzzles award 15 + 25 influence, making a clean full
campaign eligible for a clear win. Their combined backing guarantees victory;
meters determine its margin. One supporter leaves the campaign vulnerable to
low public confidence or high suspicion. No supporter means meter farming cannot
substitute for earned backing. Support affects outcome, never access to voting.

## Review entry points

Open the development home `/` for links, or use:

- `/?play=1&review=election` — room, handover and objections, both supporters present.
- `/?play=1&review=convincing_win` — clear win and repaired fountain callback.
- `/?play=1&review=narrow_win` — narrow win despite both supporters and weak meters.
- `/?play=1&review=loss` — absent supporters, dry fountain, losing ending.
- `/?play=1` — your normal game/save.
- `/?edit=1&scene=scene.chapter1.election_booth` — editable geometry and layers.

Review links use memory-only saves. Reload resets the preview. They never read,
write or reset the normal localStorage save. Use BG/EN in the room or on the ending panel. Previews start in Bulgarian;
the normal game keeps its saved language.

## Human review checklist

- Room perspective, character scale, seated supporters, Penka/table occlusion.
- Box appears on delivery; supporters appear only after their votes are earned.
- Creditor pair and Mitko remain visible beside the result record.
- Read all three epilogue beats; check BG and EN wording and line wrapping.
- Check diploma before/after, receipt/pamphlet and tavern inventory icons.
- Leave voting unfinished, return to town, reload, finish support, then vote.
- Try the chapter without puzzle instructions; note the first unclear objective.

## Remaining production work

Dedicated posting, accordion playing, pouring/drinking, valve turning, paper
handover/stamp, archive pulling/swapping and ballot-box delivery animations still
need reviewed Ludo.ai ZIP + JSON exports. The provided external animation inputs
contain walks, idles, talks, rejection, take and window opening; they do not contain
these dedicated performances. State changes and dialogue currently stage them.
No alternative rig, fake animation sheet or pipeline replacement was introduced.

NPC poses are static. First-time-player review and art approval remain human
milestones. Existing square style and optional UI/art restyling remain separate
review work, not grounds to replace approved art automatically.

## New art files and provenance

Generated with the built-in imagegen tool; no API/CLI fallback.

- Room: `assets/chapter1/scenes/election_booth/background-v1.png`.
- Derived room layers: `table-occluder-v1.png` and `penka-seated-v1.png` in that
  same directory, extracted from the room and existing Penka art respectively.
- Creditors: `assets/chapter1/characters/creditors/pair-v1.png`.
- Inventory: `assets/chapter1/items/{fake-diploma,stamped-diploma,campaign-pamphlets,suspicious-receipt,rakia,shopska-salad,tripe-soup,village-wine}-v1.png`.
- Exact prompts: `assets_src/chapter1/scenes/election_booth/background-v1-prompt.md`,
  `creditors-v1-prompt.md`, and `inventory-v1-prompt.md`.
- Full-size originals, background-only chroma revisions and icon extraction bounds
  are preserved beside those prompt files. Existing approved art was not replaced.

## Validation

22 September: `npm test` — 243 passed, zero failures/skips. Ordinary-click fresh
journeys cover BG loss and EN narrow/convincing wins, branching from an earned
one-supporter save rather than injecting progression. They include returning from
the polling room to finish support, cancelled voting, archive/registration reloads
and ending reloads. Boundary tests cover all supporter combinations and the
both-supporter guarantee. Review presets are tested for isolation.

Browser checks: public HTTPS room and editor load with no page errors; BG/EN
ending controls remain reachable at 1280×720, 640×360 and 390×844 viewport sizes.
Sound opt-in creates a running audio context and polling-room ambience; mute
works. Human art approval and first-time-player review remain outstanding.

## Accordion and volume follow-up

The accordion now plays an original 2.1-second synthesized reed melody when used
on Mitko or performed for an NPC, including Tony's distraction. Detuned reed
ranks give it an accordion-like timbre; this is synthesized audio, not a recording.
Using the accordion strap on the archive does not play music. Repeating an action
restarts the phrase instead of layering multiple melodies.

The pause menu has a localized Volume slider immediately below Sound on/off.
It controls all cues and ambience, defaults to 60%, updates live, and persists in
normal saves. Zero volume and muting both remain silent. Old saves get the default.
Browser validation exercised the actual inventory action and slider; offline audio
rendering confirmed a non-silent, unclipped signal at full volume.

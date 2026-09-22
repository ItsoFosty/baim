# Data-Driven Content Effects

`src/engine/EffectSystem.js` provides the reusable requirement and effect vocabulary used by chapter
content. Keep puzzle outcomes in content definitions when they can be expressed with this vocabulary;
do not add Chapter 1-specific conditionals to `Game`.

## Effect Definitions

An effect definition contains an ordered `effects` array and may provide localized presentation
metadata:

```js
{
  effects: [
    { type: "setFlag", key: "npcDistracted" },
    { type: "adjustState", key: "influence", amount: 5 },
    { type: "completeQuest", questId: "quest.chapter1.example" }
  ],
  messageKey: "msg.example_success",
  reject: false
}
```

- `effects` are applied in array order.
- `messageKey` is optional and must resolve in both Bulgarian and English localization.
- `reject: true` gives the resulting status message the rejection presentation. It does not cancel
  the effects.
- Applying a definition through `Game` saves afterward, even when the definition has no effects.
- Unknown effect types throw an error so misspelled content does not fail silently.

Supported effects:

| Type | Required fields | Result |
| --- | --- | --- |
| `setFlag` | `key`; optional `value` | Writes `state.flags[key]`. The default value is `true`. |
| `setState` | `key`, `value` | Replaces the top-level save-state value at `state[key]`. |
| `adjustState` | `key`, `amount` | Adds a numeric amount to the current top-level state value. Missing or non-numeric values start at zero. |
| `addItem` | `itemId` | Adds the stable item ID to inventory. |
| `removeItem` | `itemId` | Removes the stable item ID from inventory. |
| `startQuest` | `questId` | Starts the stable quest ID. |
| `completeQuest` | `questId` | Completes the stable quest ID. |

Use `setFlag` for open-ended boolean facts under `state.flags`. Use `setState` or `adjustState` for
fields that are part of the explicit save schema, such as meters and puzzle-state values. Requirement
checks follow the same distinction.

## Requirements And Use Rules

Scene hotspots and NPCs may define `lookRules` and `talkRules` for state-aware
inspection and conversation, as well as `useRules` for the selected Use verb. Explicit inventory targeting
uses `itemUseRules`, where each rule also declares its stable `itemId`. The first rule whose requirements
all pass is applied:

```js
useRules: [
  {
    requirements: {
      items: ["item.example"],
      flags: ["challengeStarted"],
      notFlags: ["guardAlerted"],
      state: { voteWon: false }
    },
    effects: [{ type: "setState", key: "voteWon", value: true }],
    messageKey: "msg.example_success"
  }
]
```

All requirement groups are optional:

| Requirement | Pass condition |
| --- | --- |
| `items` | Inventory contains every listed stable item ID. |
| `absentItems` | No listed item is in inventory or any saved dropped-item record. Useful for recoverable supplies without duplicates. |
| `flags` | Every listed key is truthy in `state.flags`. |
| `notFlags` | Every listed key is falsy or absent in `state.flags`. |
| `state` | Every key strictly equals its authored value in the top-level save state. |
| `stateMin` | Every top-level numeric state value is greater than or equal to its authored threshold. |
| `stateMax` | Every top-level numeric state value is less than or equal to its authored threshold. |

An omitted or empty `requirements` object always matches. Because only the first matching rule is
used, place narrow cases before broad fallbacks. If no rule matches, the normal localized
`msg.no_use` rejection is shown.

Inventory items may additionally define:

- `selfUseRules`: effects applied by the direct Use on Bai Mitko inventory action;
- `targetUseRules`: reusable fallbacks selected by `targetIds`, `targetKinds`, or `targetTags`.

Target-authored `itemUseRules` are evaluated before item-authored `targetUseRules`. This allows Tony's
accordion puzzle effect to override the accordion's generic NPC reaction. A future dog or cat can carry
the `animal` tag and receive the existing animal reaction without adding a Chapter-specific engine branch.
Consumable self-use rules remove their item explicitly; non-consumable rules such as the accordion omit
`removeItem`.

When an inventory item targets an NPC, an authored rule's `messageKey` is spoken by that NPC and uses the
NPC's scene `speechAnchor` and visual bubble style. If no rule matches, the NPC speaks `itemRejectKey` from
its scene definition, falling back to `msg.inventory.npc_reject_generic`. Non-NPC targets keep the normal
Bai Mitko rejection. This speaker routing is presentation-only and does not change requirement priority,
effects, inventory consumption, or quest state.

## Dialogue Choices

A dialogue choice uses the same effect definition under its `effect` field:

```js
{
  textKey: "dialogue.example.choice.accept",
  effect: {
    effects: [{ type: "startQuest", questId: "quest.chapter1.example" }],
    messageKey: "dialogue.example.accepted"
  }
}
```

After an effect is applied, the choice follows normal dialogue navigation: a choice with `next`
continues to that node, while a choice without `next` closes the dialogue. This allows one choice to
start a quest and immediately show the NPC's response node. Keep choice labels, response nodes, and
effect messages authored naturally in both supported languages.

An informational response node may declare `choicesFrom: "start"`. Its response line remains visible,
but the currently available choices from the referenced node render immediately underneath it. Prefer
this over a one-option Back response node for ordinary conversation answers.

## Extending The Vocabulary

When adding a new requirement or effect type:

1. Implement it generically in `src/engine/EffectSystem.js`.
2. Preserve existing stable IDs and save-state meanings.
3. Add focused coverage in `test/content-effects.test.js`.
4. Add or update save, inventory, quest, or localization tests when those contracts change.
5. Run `npm test`.

## Stateful scene effects

A scene may define `effects` alongside its raster layers. Effects use the same
visibility flags and depth ordering as scene layers. `waterStream` takes four
Bezier `points` in scene coordinates, optional `width`, `speed`, `color` and
`highlight`, and a `zIndex`. `visibleWhenFlag` can reveal it after an interaction; `hiddenWhenFlag` hides a
layer or effect once the flag is set (missing flags leave it visible).
The reusable renderer animates the stream without modifying the background asset.

## Registration-chain additions

- `requirements.anyOf`: at least one nested requirement group must pass; other
  requirements on the same object still apply (AND).
- Individual effects may have `requirements`; unmet effects are skipped. This
  permits a unique reward to be omitted when carried, dropped or delivered,
  without suppressing the rest of a quest reward.
- Exits may specify `accessRequirements` and `blockedMessageKey`. They remain
  targetable and explain missing prerequisites rather than silently vanishing.
- Raster layers may use `visibleWhenTargetId` to follow an NPC/hotspot/exit's
  availability in the current scene. Layer builder and editor retain this field.


### Close-ups and archive interaction support
- Scene `playerMode: "closeup"` suppresses the walking actor and approach/movement.
  Inventory, verbs and state-dependent raster layers remain usable.
- A scene `returnExitId` references an ordinary exit; the top bar exposes its
  localized name as a return button. Exits without geometry are UI-only.
- Scene `allowItemDrop: false` and `dropBlockedMessageKey` keep a close-up free
  of inaccessible dropped-item piles; the player can return to a walkable room.
- A matched interaction rule may specify `sceneTransition: {sceneId, position}`.
  Its effects are applied/saved before the destination loads.
- `takeRules` are checked before the normal take operation: use them for
  recoverable refusal messages. The target must itself be currently available.
- Dialogue nodes can use ordered `lineRules: [{requirements, lineKey}]` to
  choose a progress-dependent greeting, falling back to `lineKey`.
- `requirements.disabled` retires an interaction while preserving its stable ID.

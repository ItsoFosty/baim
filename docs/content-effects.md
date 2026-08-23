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

Scene hotspots and NPCs may define `useRules` for the selected Use verb. Explicit inventory targeting
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

# HTML HUD And Inventory

The 1280x720 canvas renders the game world only. Persistent controls, status meters, the selected verb,
and inventory belong in `#ui-root` as HTML/CSS. Do not add a painted HUD strip in `Renderer` because it
is rasterized into the world canvas and makes high-resolution item art harder to read on large displays.

## Inventory Contract

- Item identity and localized name/description remain in `src/content/chapter1/items.js` and localization.
- Runtime icon paths remain in `src/content/art/assetManifest.js`.
- `AssetLoader.preloadAllItemAssets()` completes before gameplay input is enabled.
- Inventory displays the original raster asset through an `<img>` with `object-fit: contain`; do not create
  a low-resolution canvas thumbnail.
- The resting item target is 78x78 virtual CSS pixels. Hover or keyboard focus magnifies the item and its
  immediate neighbors without changing document layout.
- Names stay out of the resting dock and appear as localized tooltips on hover or focus. Each item button
  keeps an accessible name and tooltip relationship.
- Left and right arrows move focus within the horizontal inventory toolbar. Home and End move to its bounds.
- Clicking an item expands localized Use, Inspect, Drop, and Close controls. Items with authored
  `selfUseRules` also expose a direct Use on Bai Mitko control. Clicking the selected item
  again, clicking the world, selecting a verb, opening the menu, or pressing Escape collapses the controls.
- Use enters an explicit held-item mode. The HUD names the held item and hovered target, offers Cancel,
  and routes the next target click through authored `itemUseRules`. Successful and rejected attempts both
  clear held-item mode. Inventory-to-inventory clicks use the same rule vocabulary.
- Drag-and-drop is intentionally not part of the interaction contract. Click/tap item, Use, then click/tap
  target is the shared mouse, keyboard, and touch path.
- Takeaway Mehana food and drink author NPC-specific target rules. Baba's inventory offers share the same
  cheap-offer state contract as her dialogue offers; rejected gifts remain owned. Refreshments consumed by
  Bai Mitko update `rakiaGlasses`, while non-consumable self-use such as the accordion keeps the item.
- Items may author reusable `targetUseRules` selected by stable target ID, target kind, or target tag.
  Target-authored `itemUseRules` take priority so a quest-specific interaction such as playing the accordion
  for Tony overrides the generic NPC reaction. Future cats and dogs should use the `animal` tag to receive
  the authored animal response without adding Chapter-specific engine checks.
- Inventory effects aimed at an NPC present their `messageKey` in that NPC's anchored speech bubble rather
  than Bai Mitko's status bubble. If no explicit or item-authored rule matches, the NPC uses its optional
  `itemRejectKey`; NPCs without one use the bilingual generic rejection. Author recurring Chapter NPCs with
  an individual rejection key so their voice remains recognizable outside quest interactions.
- Reduced-motion preferences disable dock movement while preserving focus and tooltip feedback.

## Dialogue Answer Contract

- NPC response lines render in character-anchored speech bubbles over the scene; the lower dialogue panel
  is reserved for player choices. Non-NPC reading/menu dialogues may continue to show their line and entries
  inside the panel.
- NPC scene definitions may provide `speechAnchor: { x, y }` in 1280x720 world coordinates. Use it to point
  the bubble tail at the painted character when the interaction rectangle is not aligned with the visible
  head. The engine falls back to the upper center of the NPC rectangle when no anchor is authored.
- Bubble colors and silhouettes may vary by stable NPC ID so characters answer in a recognizable visual
  style. Dialogue text remains localized content; do not duplicate it as visible engine-authored text.
- The choice panel stays horizontally centered at the bottom HUD margin. Its width remains 760 virtual CSS
  pixels and its height uses the same `--indicator-panel-height` contract as the lower-left meter panel.
- The choice viewport shows three 30-pixel rows. Further available choices scroll vertically; scrolling must
  not change authored order or choice availability.
- Choice buttons have no resting outline or opaque button tile. Hover and keyboard focus use the same
  feedback: a subtle translucent highlight plus larger, bold text. Keep a visible focus treatment even
  though the standard browser outline is suppressed.
- Dialogue chrome remains slightly translucent, blurred, and rounded to the same 11-pixel corner radius as
  the indicators panel. The UI font stack must retain natural Bulgarian Cyrillic coverage.
- Informational answer nodes may set `choicesFrom: "start"`. The answer remains visible while the currently
  available parent choices remain in the lower choice viewport.
- Do not add one-option Back nodes for ordinary NPC answers. Keep an explicit Back choice only where moving
  between genuinely different menus is meaningful.

## Quest Overview Contract

- The pause menu displays a clearly headed Quests section with compact Outstanding and Completed tabs.
- Both tab lists are numbered and independently scrollable. `activeQuests` appear only under Outstanding;
  `completedQuests` appear only under Completed in their recorded completion order.
- Known campaign objectives such as Baba and Tony support are active from a fresh save. Later story quests
  may still activate when their prerequisite clue or scene is reached.
- A quest may author ordered `stages` with normal content requirements. The first matching stage supplies
  the visible objective text without putting Chapter-specific checks in the engine.
- If no quests remain active, the overview shows a localized empty-state message.

## Adding An Item Icon

1. Add the stable item definition and Bulgarian/English strings.
2. Add the high-resolution transparent icon under `assets/chapter1/items/`.
3. Add the icon path under the same stable item ID in `assetManifest.items`.
4. Run `npm test` and inspect the dock at 1x and 2x browser scale.

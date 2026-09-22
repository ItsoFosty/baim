import { InventorySystem } from "./InventorySystem.js";
import { QuestSystem } from "./QuestSystem.js";
import { resolveEnding } from "./EndingSystem.js";
import { SaveSystem } from "./SaveSystem.js";

// Review presets get memory-only storage, never the player's localStorage key.
export function createReviewSaveSystem(defaultState, preset, content) {
  const state = { ...structuredClone(defaultState), ...structuredClone(preset.state) };
  const index = entries => Object.fromEntries(entries.map(entry => [entry.id, entry]));
  if (preset.resolveGroup) resolveEnding(content.endings.filter(e => e.groupId === preset.resolveGroup), {
    state, inventory: new InventorySystem(index(content.items), state), quests: new QuestSystem(index(content.quests), state)
  });
  let raw = JSON.stringify(state);
  return new SaveSystem({ getItem: () => raw, setItem: (_key, value) => { raw = value; }, removeItem: () => { raw = null; } });
}

import { externalAnimationV1 } from "./externalAnimationRuntime.generated.js";

export const assetManifest = {
  baseResolution: { width: 1280, height: 720 },
  runtimeSceneResolution: { width: 1280, height: 720 },
  scenes: {
    "scene.chapter1.apartment": {
      background: "assets/chapter1/scenes/apartment/background.png",
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png",
      foregroundTable: "assets/chapter1/scenes/apartment/foreground-table.png",
      billsOnTable: "assets/chapter1/scenes/apartment/bills-on-table.png",
      windowOpen: "assets/chapter1/scenes/apartment/window-open.png",
      windowOpenBack: "assets/chapter1/scenes/apartment/window-open-0.png"
    },
    "scene.chapter1.village_square": {
      background: "assets/chapter1/scenes/village_square/background.png",
      babaStoyankaSeated: "assets/chapter1/characters/baba_stoyanka/seated-v1.png",
      kioskPapersPile: "assets/chapter1/scenes/village_square/kiosk-papers-pile-v1.png",
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png"
    },
    "scene.chapter1.mehana": {
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png"
    },
    "scene.chapter1.municipality": {
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png"
    },
    "scene.chapter1.election_booth": {
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png"
    }
  },
  characters: {
    "npc.bai_mitko": {
      type: "externalAnimation",
      ...externalAnimationV1.characterAssets
    }
  },
  items: {
    "item.accordion": {
      icon: "assets/chapter1/items/accordion.png"
    },
    "item.unpaid_bills": {
      icon: "assets/chapter1/items/unpaid_bills.png"
    },
    "item.empty_envelope": {
      icon: "assets/chapter1/items/empty_envelope.png"
    }
  }
};

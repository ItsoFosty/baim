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
      accordionOnChair: "assets/chapter1/scenes/apartment/accordion-on-chair.png",
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
      background: "assets/chapter1/scenes/mehana/background.png",
      tableGroupLeft: "assets/chapter1/scenes/mehana/table-group-left-v2.png",
      tableGroupRight: "assets/chapter1/scenes/mehana/table-group-right-v2.png",
      mehanaWaiterIdle: "assets/chapter1/characters/mehana_waiter/idle-v1.png",
      tonyFridgeSeated: "assets/chapter1/characters/tony_fridge/seated-v1.png",
      kaliakraOil: "assets/chapter1/scenes/mehana/kaliakra-oil-v1.png",
      waterJug: "assets/chapter1/scenes/mehana/water-jug-v1.png",
      todayNewspaper: "assets/chapter1/scenes/mehana/newspaper-v3.png",
      droppedBelongingsPile: "assets/chapter1/items/dropped-belongings-pile-v1.png"
    },
    "scene.chapter1.municipality": {
      background: "assets/chapter1/scenes/municipality/background-v9.png",
      archiveCabinet: "assets/chapter1/scenes/municipality/archive-cabinet-v6.png",
      candidateRegister: "assets/chapter1/scenes/municipality/candidate-register-v4.png",
      penkaChair: "assets/chapter1/scenes/municipality/penka-chair-v1.png",
      penkaSeated: "assets/chapter1/scenes/municipality/penka-seated-bordeaux-polka-v2.png",
      penkaDesk: "assets/chapter1/scenes/municipality/penka-desk-v10.png",
      securityOfficer: "assets/chapter1/scenes/municipality/policeman-security-guard-v2.png",
      securityTable: "assets/chapter1/scenes/municipality/security-table-v6.png",
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
    },
    "item.sunflower_oil": {
      icon: "assets/chapter1/items/sunflower-oil-v1.png"
    },
    "item.glass_of_water": {
      icon: "assets/chapter1/items/glass-of-water-v1.png"
    }
  }
};

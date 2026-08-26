import { apartmentWalkGeometry, mehanaWalkGeometry, municipalityWalkGeometry, villageSquareWalkGeometry } from "./walkMasks.generated.js";
import { apartmentObjectGeometry, mehanaObjectGeometry, municipalityObjectGeometry, villageSquareObjectGeometry } from "./sceneObjectGeometry.generated.js";
import { sceneLayerGeometry } from "./sceneLayers.generated.js";

const rawScenes = [
  {
    id: "scene.chapter1.apartment",
    titleKey: "scene.chapter1.apartment.title",
    palette: { sky: "#4d6f86", wall: "#735f49", floor: "#2f2a23" },
    movementSpeed: 70,
    playerStart: { x: 1000, y: 565 },
    walkPolygons: apartmentWalkGeometry.walkPolygons,
    walkMask: apartmentWalkGeometry.walkMask,
    perspectiveScale: { horizonY: 430, bottomY: 600, far: 0.76, near: 1.12 },
    anchors: {
      door: { x: 1115, y: 500 },
      mirror: { x: 690, y: 420 },
      table: { x: 415, y: 510 },
      baiMitkoSpawn: { x: 1000, y: 565 }
    },
    foregroundLayers: sceneLayerGeometry["scene.chapter1.apartment"]?.foregroundLayers || [],
    exits: [
      {
        id: "exit.apartment.to_square",
        kind: "exit",
        nameKey: "exit.to_village_square",
        rect: { x: 1085, y: 135, w: 150, h: 380 },
        targetSceneId: "scene.chapter1.village_square",
        targetPosition: { x: 220, y: 505 }
      }
    ],
    interactables: [
      {
        id: "window",
        kind: "hotspot",
        nameKey: "hotspot.window.name",
        rect: { x: 145, y: 75, w: 240, h: 280 },
        lookKey: "look.apartment.window",
        actions: {
          look: {
            approachCell: { x: 16, y: 23 },
            requireExactApproach: true,
            facing: "west",
            animation: "opensWindow",
            holdFinalFrame: false,
            flagOnComplete: "apartmentWindowOpen",
            skipAnimationWhenFlag: "apartmentWindowOpen",
            messageKey: "msg.apartment.window_opened"
          }
        }
      },
      {
        id: "hotspot.apartment.accordion",
        kind: "hotspot",
        nameKey: "item.accordion.name",
        rect: { x: 1120, y: 375, w: 150, h: 190 },
        lookKey: "look.apartment.accordion",
        takeItemId: "item.accordion",
        hiddenWhenItemOwned: "item.accordion",
        restoreOnDrop: true,
        flagOnTake: "hasAccordion"
      },
      {
        id: "hotspot.apartment.rakia_bottle",
        kind: "hotspot",
        nameKey: "hotspot.apartment.rakia_bottle.name",
        rect: { x: 50, y: 515, w: 60, h: 140 },
        lookKey: "look.apartment.rakia_bottle",
        useRules: [
          {
            effects: [
              { type: "adjustState", key: "rakiaGlasses", amount: 1, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
            ],
            messageByState: {
              key: "rakiaGlasses",
              ranges: [
                { max: 1, messageKey: "msg.rakia.level.daisy" },
                { min: 2, max: 4, messageKey: "msg.rakia.level.merry" },
                { min: 5, max: 7, messageKey: "msg.rakia.level.tipsy" },
                { min: 8, messageKey: "msg.rakia.level.plastered" }
              ]
            }
          }
        ]
      },
      {
        id: "hotspot.apartment.bed",
        kind: "hotspot",
        nameKey: "hotspot.apartment.bed.name",
        rect: { x: 1060, y: 525, w: 220, h: 180 },
        lookKey: "look.apartment.bed",
        useRules: [
          {
            effects: [
              { type: "adjustState", key: "rakiaGlasses", amount: -3, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
            ],
            messageKey: "msg.apartment.nap"
          }
        ]
      },
      {
        id: "hotspot.apartment.unpaid_bills",
        kind: "hotspot",
        nameKey: "item.unpaid_bills.name",
        rect: { x: 265, y: 375, w: 245, h: 95 },
        lookKey: "item.unpaid_bills.desc",
        takeItemId: "item.unpaid_bills",
        hiddenWhenItemOwned: "item.unpaid_bills",
        requirements: { state: { hasUnpaidBills: false } },
        flagOnTake: "hasUnpaidBills",
        actions: {
          take: {
            approach: { x: 390, y: 570 },
            requireExactApproach: true,
            facing: "west",
            animation: "take",
            effectFrame: 8,
            messageKey: "msg.apartment.unpaid_bills_taken"
          }
        }
      },
      {
        id: "hotspot.apartment.mirror",
        kind: "hotspot",
        nameKey: "hotspot.mirror.name",
        rect: { x: 640, y: 155, w: 140, h: 220 },
        lookKey: "look.apartment.mirror"
      },
      {
        id: "hotspot.apartment.tv",
        kind: "hotspot",
        nameKey: "hotspot.tv.name",
        rect: { x: 0, y: 285, w: 125, h: 160 },
        lookKey: "look.apartment.tv"
      },
      {
        id: "hotspot.apartment.wardrobe",
        kind: "hotspot",
        nameKey: "hotspot.wardrobe.name",
        rect: { x: 805, y: 105, w: 240, h: 410 },
        lookKey: "look.apartment.wardrobe"
      },
      {
        id: "hotspot.apartment.table",
        kind: "hotspot",
        nameKey: "hotspot.table.name",
        rect: { x: 225, y: 385, w: 280, h: 175 },
        lookKey: "look.apartment.table"
      },
      {
        id: "hotspot.apartment.campaign_poster",
        kind: "hotspot",
        nameKey: "hotspot.campaign_poster.name",
        rect: { x: 500, y: 160, w: 150, h: 155 },
        lookKey: "look.apartment.poster"
      }
    ],
    npcs: []
  },
  {
    id: "scene.chapter1.village_square",
    titleKey: "scene.chapter1.village_square.title",
    palette: { sky: "#829aa1", wall: "#8a7657", floor: "#48443a" },
    movementSpeed: 80,
    playerStart: { x: 300, y: 540 },
    walkPolygons: villageSquareWalkGeometry.walkPolygons,
    walkMask: villageSquareWalkGeometry.walkMask,
    perspectiveScale: { horizonY: 415, bottomY: 590, far: 0.4, near: 1.1 },
    anchors: {
      baiMitkoSpawn: { x: 300, y: 540 },
      babaBench: { x: 520, y: 455 },
      journalist: { x: 1085, y: 510 },
      oldMenChorus: { x: 565, y: 450 },
      fountain: { x: 650, y: 500 },
      mehanaDoor: { x: 120, y: 465 },
      municipalityDoor: { x: 965, y: 450 }
    },
    foregroundLayers: sceneLayerGeometry["scene.chapter1.village_square"]?.foregroundLayers || [],
    exits: [
      {
        id: "exit.square.to_apartment",
        kind: "exit",
        nameKey: "exit.to_apartment",
        rect: { x: 10, y: 485, w: 190, h: 100 },
        targetSceneId: "scene.chapter1.apartment",
        targetPosition: { x: 1000, y: 565 }
      },
      {
        id: "exit.square.to_mehana",
        kind: "exit",
        nameKey: "exit.to_mehana",
        rect: { x: 0, y: 120, w: 235, h: 345 },
        depthY: 590,
        targetSceneId: "scene.chapter1.mehana",
        targetPosition: { x: 430, y: 530 }
      },
      {
        id: "exit.square.to_municipality",
        kind: "exit",
        nameKey: "exit.to_municipality",
        rect: { x: 900, y: 165, w: 230, h: 285 },
        targetSceneId: "scene.chapter1.municipality",
        targetPosition: { x: 220, y: 505 }
      },
      {
        id: "exit.square.to_election_booth",
        kind: "exit",
        nameKey: "exit.to_election_booth",
        rect: { x: 230, y: 290, w: 140, h: 120 },
        requirements: { state: { journalistInterviewCompleted: true, chapter1Completed: false } },
        debugVisual: { kind: "sign", fill: "#efe0bd", accent: "#9b302f", labelKey: "exit.to_election_booth" },
        targetSceneId: "scene.chapter1.election_booth",
        targetPosition: { x: 230, y: 525 }
      }
    ],
    interactables: [
      {
        id: "hotspot.square.empty_envelope",
        kind: "hotspot",
        nameKey: "item.empty_envelope.name",
        rect: { x: 1160, y: 430, w: 70, h: 55 },
        lookKey: "look.square.empty_envelope",
        takeItemId: "item.empty_envelope",
        hiddenWhenItemOwned: "item.empty_envelope",
        requirements: { state: { hasEmptyEnvelope: false } },
        flagOnTake: "hasEmptyEnvelope"
      },
      {
        id: "hotspot.square.poster_board",
        kind: "hotspot",
        nameKey: "hotspot.poster_board.name",
        rect: { x: 1080, y: 245, w: 140, h: 235 },
        lookKey: "look.square.poster_board",
        actions: {
          look: {
            approach: { x: 976, y: 625 },
            requireExactApproach: true,
            facing: "east",
            messageKey: "look.square.poster_board"
          }
        }
      },
      {
        id: "hotspot.square.fountain",
        kind: "hotspot",
        nameKey: "hotspot.fountain.name",
        rect: { x: 405, y: 225, w: 360, h: 300 },
        lookKey: "look.square.fountain"
      },
      {
        id: "hotspot.square.kiosk",
        kind: "hotspot",
        nameKey: "hotspot.kiosk.name",
        rect: { x: 1010, y: 185, w: 245, h: 370 },
        lookKey: "look.square.kiosk"
      },
      {
        id: "hotspot.square.statue",
        kind: "hotspot",
        nameKey: "hotspot.statue.name",
        rect: { x: 575, y: 190, w: 185, h: 245 },
        lookKey: "look.square.statue"
      },
      {
        id: "hotspot.square.old_men_bench",
        kind: "hotspot",
        nameKey: "hotspot.old_men_bench.name",
        rect: { x: 480, y: 365, w: 150, h: 70 },
        lookKey: "look.square.old_men_bench"
      },
      {
        id: "hotspot.square.election_notice",
        kind: "hotspot",
        nameKey: "hotspot.election_notice.name",
        rect: { x: 520, y: 315, w: 120, h: 80 },
        lookKey: "look.square.election_notice",
        requirements: { state: { journalistInterviewCompleted: false } }
      },
      {
        id: "hotspot.square.mehana_menu",
        kind: "hotspot",
        nameKey: "hotspot.square.mehana_menu.name",
        rect: { x: 168, y: 332, w: 51, h: 102 },
        lookKey: "look.square.mehana_menu",
        useDialogueId: "dialogue.square.mehana_menu"
      }
    ],
    npcs: [
      {
        id: "npc.baba_stoyanka",
        kind: "npc",
        nameKey: "npc.baba_stoyanka.name",
        rect: { x: 480, y: 345, w: 70, h: 115 },
        speechAnchor: { x: 360, y: 310 },
        itemRejectKey: "msg.inventory.npc_reject.baba_stoyanka",
        dialogueId: "dialogue.baba_stoyanka",
        lookKey: "look.npc.baba_stoyanka",
        itemUseRules: [
          {
            itemId: "item.glass_of_water",
            requirements: {
              notFlags: ["babaRejectedWater"],
              state: { babaStoyankaVote: false }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "setFlag", key: "babaRejectedWater" },
              { type: "adjustState", key: "babaCheapOfferAttempts", amount: 1, min: 0, max: 4 },
              { type: "adjustState", key: "suspicion", amount: 1 }
            ],
            messageKey: "msg.baba.reject_water",
            reject: true
          },
          {
            itemId: "item.shopska_salad",
            requirements: {
              notFlags: ["babaRejectedShopska"],
              state: { babaStoyankaVote: false }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "setFlag", key: "babaRejectedShopska" },
              { type: "adjustState", key: "babaCheapOfferAttempts", amount: 1, min: 0, max: 4 },
              { type: "adjustState", key: "suspicion", amount: 1 }
            ],
            messageKey: "msg.baba.reject_shopska",
            reject: true
          },
          {
            itemId: "item.tripe_soup",
            requirements: {
              notFlags: ["babaRejectedTripeSoup"],
              state: { babaStoyankaVote: false }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "setFlag", key: "babaRejectedTripeSoup" },
              { type: "adjustState", key: "babaCheapOfferAttempts", amount: 1, min: 0, max: 4 },
              { type: "adjustState", key: "suspicion", amount: 1 }
            ],
            messageKey: "msg.baba.reject_tripe_soup",
            reject: true
          },
          {
            itemId: "item.rakia",
            requirements: {
              notFlags: ["babaRejectedRakia"],
              state: { babaStoyankaVote: false }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "setFlag", key: "babaRejectedRakia" },
              { type: "adjustState", key: "suspicion", amount: 1 }
            ],
            messageKey: "msg.baba.reject_rakia",
            reject: true
          },
          {
            itemId: "item.sunflower_oil",
            requirements: {
              state: { babaStoyankaVote: false },
              stateMax: { babaCheapOfferAttempts: 2 }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "removeItem", itemId: "item.sunflower_oil" },
              { type: "setState", key: "babaStoyankaVote", value: true },
              { type: "setState", key: "babaTrust", value: "traditional" },
              { type: "adjustState", key: "influence", amount: 15 },
              { type: "adjustState", key: "suspicion", amount: 4 },
              { type: "adjustState", key: "publicMood", amount: 3 },
              { type: "completeQuest", questId: "quest.chapter1.baba_vote" }
            ],
            messageKey: "msg.baba.accept_oil"
          },
          {
            itemId: "item.sunflower_oil",
            requirements: {
              notFlags: ["babaRequiresBetterGift"],
              state: { babaStoyankaVote: false },
              stateMin: { babaCheapOfferAttempts: 3 }
            },
            effects: [
              { type: "startQuest", questId: "quest.chapter1.baba_vote" },
              { type: "setFlag", key: "babaRequiresBetterGift" },
              { type: "adjustState", key: "suspicion", amount: 2 }
            ],
            messageKey: "msg.baba.reject_late_oil",
            reject: true
          },
          {
            itemId: "item.village_wine",
            requirements: {
              notFlags: ["babaRequiresBetterGift"],
              state: { babaStoyankaVote: false }
            },
            effects: [{ type: "startQuest", questId: "quest.chapter1.baba_vote" }],
            messageKey: "msg.baba.reject_early_wine",
            reject: true
          },
          {
            itemId: "item.village_wine",
            requirements: {
              flags: ["babaRequiresBetterGift"],
              state: { babaStoyankaVote: false }
            },
            effects: [
              { type: "removeItem", itemId: "item.village_wine" },
              { type: "setState", key: "babaStoyankaVote", value: true },
              { type: "setState", key: "babaTrust", value: "transactional" },
              { type: "adjustState", key: "influence", amount: 15 },
              { type: "adjustState", key: "suspicion", amount: 4 },
              { type: "adjustState", key: "publicMood", amount: 2 },
              { type: "completeQuest", questId: "quest.chapter1.baba_vote" }
            ],
            messageKey: "msg.baba.accept_wine"
          }
        ]
      },
      {
        id: "npc.journalist",
        kind: "npc",
        nameKey: "npc.journalist.name",
        rect: { x: 1030, y: 300, w: 105, h: 210 },
        speechAnchor: { x: 1082, y: 275 },
        itemRejectKey: "msg.inventory.npc_reject.journalist",
        dialogueId: "dialogue.journalist",
        lookKey: "look.npc.journalist",
        debugVisual: { fill: "#6b263d", accent: "#d7b35f", labelKey: "npc.journalist.name" },
        requirements: {
          flags: ["ballotBoxRecovered"],
          state: { chapter1Completed: false }
        }
      }
    ]
  },
  {
    id: "scene.chapter1.mehana",
    titleKey: "scene.chapter1.mehana.title",
    palette: { sky: "#4a3327", wall: "#7a5538", floor: "#32251d" },
    movementSpeed: 75,
    playerMode: "seated",
    playerStart: { x: 430, y: 530 },
    seatedPresentation: {
      tableRect: { x: 230, y: 435, w: 395, h: 230 }
    },
    walkPolygons: mehanaWalkGeometry.walkPolygons,
    walkMask: mehanaWalkGeometry.walkMask,
    perspectiveScale: { horizonY: 415, bottomY: 590, far: 1.08, near: 1.51 },
    anchors: {
      baiMitkoSeat: { x: 430, y: 530 },
      tonyTable: { x: 845, y: 570 },
      bar: { x: 620, y: 500 },
      waiter: { x: 705, y: 465 },
      exit: { x: 170, y: 505 }
    },
    foregroundLayers: sceneLayerGeometry["scene.chapter1.mehana"]?.foregroundLayers || [],
    exits: [
      {
        id: "exit.mehana.to_square",
        kind: "exit",
        nameKey: "exit.to_village_square",
        rect: { x: 30, y: 320, w: 120, h: 190 },
        targetSceneId: "scene.chapter1.village_square",
        targetPosition: { x: 245, y: 555 }
      }
    ],
    interactables: [
      {
        id: "hotspot.mehana.bai_mitko_rakia_glass",
        kind: "hotspot",
        nameKey: "hotspot.mehana.bai_mitko_rakia_glass.name",
        rect: { x: 375, y: 403, w: 80, h: 60 },
        lookKey: "look.mehana.bai_mitko_rakia_glass",
        requirements: {
          flags: ["tonyChallengeStarted"],
          state: { tonyVote: false }
        },
        itemUseRules: [
          {
            itemId: "item.glass_of_water",
            requirements: {
              flags: ["tonyChallengeStarted", "tonyDistracted"],
              state: { swappedOwnRakiaWithWater: false, tonyVote: false }
            },
            effects: [
              { type: "removeItem", itemId: "item.glass_of_water" },
              { type: "setState", key: "swappedOwnRakiaWithWater", value: true }
            ],
            messageKey: "msg.water_swap_ready"
          },
          {
            itemId: "item.glass_of_water",
            requirements: {
              flags: ["tonyChallengeStarted"],
              notFlags: ["tonyDistracted", "tonyCaughtWaterAttempt"],
              state: { swappedOwnRakiaWithWater: false, tonyVote: false }
            },
            effects: [
              { type: "setFlag", key: "tonyCaughtWaterAttempt" },
              { type: "adjustState", key: "suspicion", amount: 3 }
            ],
            messageKey: "msg.water_swap_watched",
            reject: true
          },
          {
            itemId: "item.glass_of_water",
            requirements: {
              flags: ["tonyChallengeStarted", "tonyCaughtWaterAttempt"],
              notFlags: ["tonyDistracted"],
              state: { swappedOwnRakiaWithWater: false, tonyVote: false }
            },
            effects: [],
            messageKey: "msg.water_swap_still_watched",
            reject: true
          }
        ]
      },
      {
        id: "hotspot.mehana.tony_rakia_glass",
        kind: "hotspot",
        nameKey: "hotspot.mehana.tony_rakia_glass.name",
        rect: { x: 779, y: 441, w: 88, h: 69 },
        lookKey: "look.mehana.tony_rakia_glass",
        requirements: {
          flags: ["tonyChallengeStarted"],
          state: { tonyVote: false }
        }
      },
      {
        id: "hotspot.mehana.table",
        kind: "hotspot",
        nameKey: "hotspot.mehana_table.name",
        rect: { x: 230, y: 435, w: 395, h: 230 },
        lookKey: "look.mehana.table"
      },
      {
        id: "hotspot.mehana.oil",
        kind: "hotspot",
        nameKey: "item.sunflower_oil.name",
        rect: { x: 1138, y: 292, w: 44, h: 97 },
        lookKey: "look.mehana.oil",
        takeItemId: "item.sunflower_oil",
        flagOnTake: "hasSunflowerOil",
        useRules: [
          {
            requirements: { items: ["item.sunflower_oil"] },
            effects: [{ type: "setState", key: "drankOilBeforeTonyChallenge", value: true }],
            messageKey: "msg.oil_used"
          }
        ]
      },
      {
        id: "hotspot.mehana.water_jug",
        kind: "hotspot",
        nameKey: "hotspot.water_jug.name",
        rect: { x: 1190, y: 320, w: 75, h: 83 },
        lookKey: "look.mehana.water_jug",
        takeItemId: "item.glass_of_water",
        flagOnTake: "hasGlassOfWater",
        useRules: [
          {
            requirements: { items: ["item.glass_of_water"] },
            effects: [
              { type: "removeItem", itemId: "item.glass_of_water" },
              { type: "adjustState", key: "rakiaGlasses", amount: -1, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
            ],
            messageKey: "msg.water_recovery"
          }
        ]
      },
      {
        id: "hotspot.mehana.newspaper",
        kind: "hotspot",
        nameKey: "hotspot.mehana.newspaper.name",
        rect: { x: 398, y: 402, w: 124, h: 93 },
        lookKey: "look.mehana.newspaper"
      },
      {
        id: "hotspot.mehana.radio",
        kind: "hotspot",
        nameKey: "hotspot.mehana.radio.name",
        rect: { x: 1130, y: 135, w: 145, h: 140 },
        lookKey: "look.mehana.radio"
      },
      {
        id: "hotspot.mehana.cellar_hatch",
        kind: "hotspot",
        nameKey: "hotspot.mehana.cellar_hatch.name",
        rect: { x: 815, y: 585, w: 270, h: 130 },
        lookKey: "look.mehana.cellar_hatch",
        useRules: [
          {
            requirements: { notFlags: ["ballotBoxArchiveClue"] },
            effects: [],
            messageKey: "msg.mehana.cellar_no_reason",
            reject: true
          },
          {
            requirements: {
              flags: ["ballotBoxArchiveClue"],
              notFlags: ["mehanaCellarOpened"]
            },
            effects: [{ type: "setFlag", key: "mehanaCellarOpened" }],
            messageKey: "msg.mehana.cellar_opened"
          },
          {
            requirements: { flags: ["mehanaCellarOpened"] },
            effects: [],
            messageKey: "msg.mehana.cellar_already_open"
          }
        ]
      },
      {
        id: "hotspot.mehana.ballot_box",
        kind: "hotspot",
        nameKey: "item.ballot_box.name",
        rect: { x: 850, y: 510, w: 160, h: 110 },
        lookKey: "look.mehana.ballot_box",
        takeItemId: "item.ballot_box",
        hiddenWhenItemOwned: "item.ballot_box",
        flagOnTake: "hasBallotBox",
        takeMessageKey: "msg.mehana.ballot_box_recovered",
        requirements: {
          flags: ["mehanaCellarOpened"],
          state: { hasBallotBox: false }
        },
        takeEffects: [
          { type: "setFlag", key: "ballotBoxRecovered" },
          { type: "completeQuest", questId: "quest.chapter1.ballot_box" },
          { type: "startQuest", questId: "quest.chapter1.journalist" }
        ]
      }
    ],
    npcs: [
      {
        id: "npc.mehana_waiter",
        kind: "npc",
        nameKey: "npc.mehana_waiter.name",
        rect: { x: 648, y: 232, w: 114, h: 333 },
        speechAnchor: { x: 705, y: 215 },
        itemRejectKey: "msg.inventory.npc_reject.mehana_waiter",
        dialogueId: "dialogue.mehana_waiter",
        lookKey: "look.npc.mehana_waiter",
        itemUseRules: ["item.rakia", "item.shopska_salad", "item.tripe_soup", "item.village_wine"].map(
          (itemId) => ({
            itemId,
            effects: [],
            messageKey: "msg.kiro.return_purchase",
            reject: true
          })
        )
      },
      {
        id: "npc.tony_fridge",
        kind: "npc",
        nameKey: "npc.tony_fridge.name",
        rect: { x: 862, y: 315, w: 145, h: 240 },
        speechAnchor: { x: 934, y: 285 },
        itemRejectKey: "msg.inventory.npc_reject.tony_fridge",
        dialogueId: "dialogue.tony_fridge",
        lookKey: "look.npc.tony_fridge",
        itemUseRules: [
          ...["item.rakia", "item.shopska_salad", "item.tripe_soup", "item.village_wine"].map(
            (itemId) => ({
              itemId,
              effects: [],
              messageKey: "msg.tony.gift_not_vote",
              reject: true
            })
          ),
          {
            itemId: "item.accordion",
            requirements: {
              flags: ["tonyChallengeStarted"],
              notFlags: ["tonyDistracted"],
              state: { tonyVote: false }
            },
            effects: [{ type: "setFlag", key: "tonyDistracted" }],
            messageKey: "msg.accordion_tony"
          },
          {
            itemId: "item.glass_of_water",
            requirements: {
              flags: ["tonyChallengeStarted"],
              state: { tonyVote: false }
            },
            effects: [],
            messageKey: "msg.water_tony_wrong_glass",
            reject: true
          }
        ]
      }
    ]
  },
  {
    id: "scene.chapter1.municipality",
    titleKey: "scene.chapter1.municipality.title",
    palette: { sky: "#68747a", wall: "#817866", floor: "#3f413c" },
    movementSpeed: 70,
    playerStart: { x: 220, y: 505 },
    walkPolygons: municipalityWalkGeometry.walkPolygons,
    walkMask: municipalityWalkGeometry.walkMask,
    perspectiveScale: { horizonY: 415, bottomY: 590, far: 0.8, near: 1.1 },
    anchors: {
      baiMitkoSpawn: { x: 220, y: 505 },
      clerkCounter: { x: 820, y: 475 },
      candidateRegister: { x: 1000, y: 455 },
      stampDesk: { x: 620, y: 475 },
      archiveCabinet: { x: 1120, y: 465 },
      exit: { x: 135, y: 505 }
    },
    foregroundLayers: sceneLayerGeometry["scene.chapter1.municipality"]?.foregroundLayers || [],
    exits: [
      {
        id: "exit.municipality.to_square",
        kind: "exit",
        nameKey: "exit.to_village_square",
        rect: { x: 30, y: 300, w: 170, h: 245 },
        targetSceneId: "scene.chapter1.village_square",
        targetPosition: { x: 850, y: 505 }
      }
    ],
    interactables: [
      {
        id: "hotspot.municipality.candidate_register",
        kind: "hotspot",
        nameKey: "hotspot.municipality.candidate_register.name",
        rect: { x: 930, y: 315, w: 210, h: 145 },
        lookKey: "look.municipality.candidate_register",
        itemUseRules: [
          {
            itemId: "item.municipality_stamp",
            requirements: {
              items: ["item.municipality_stamp"],
              flags: ["municipalityCredentialsAccepted"],
              notFlags: ["candidateRegistrationStamped"]
            },
            effects: [
              { type: "removeItem", itemId: "item.municipality_stamp" },
              { type: "setState", key: "hasMunicipalityStamp", value: false },
              { type: "setFlag", key: "candidateRegistrationStamped" }
            ],
            messageKey: "msg.municipality.register_stamped"
          }
        ],
        useRules: [
          {
            requirements: {
              flags: ["municipalityCredentialsAccepted"],
              notFlags: ["candidateRegistrationStamped"]
            },
            effects: [],
            messageKey: "msg.municipality.register_needs_stamp",
            reject: true
          },
          {
            requirements: { flags: ["candidateRegistrationStamped"] },
            effects: [],
            messageKey: "msg.municipality.register_ready"
          }
        ]
      },
      {
        id: "hotspot.municipality.stamp_desk",
        kind: "hotspot",
        nameKey: "hotspot.municipality.stamp_desk.name",
        rect: { x: 540, y: 340, w: 170, h: 125 },
        lookKey: "look.municipality.stamp_desk",
        takeItemId: "item.municipality_stamp",
        flagOnTake: "hasMunicipalityStamp",
        requirements: {
          flags: ["municipalityCredentialsAccepted"],
          notFlags: ["candidateRegistrationStamped"],
          state: { hasMunicipalityStamp: false }
        }
      },
      {
        id: "hotspot.municipality.archive_cabinet",
        kind: "hotspot",
        nameKey: "hotspot.municipality.archive_cabinet.name",
        rect: { x: 1080, y: 205, w: 175, h: 285 },
        lookKey: "look.municipality.archive_cabinet",
        useRules: [
          {
            requirements: { notFlags: ["municipalityCredentialsAccepted"] },
            effects: [],
            messageKey: "msg.municipality.archive_credentials_first",
            reject: true
          },
          {
            requirements: {
              flags: ["municipalityCredentialsAccepted"],
              notFlags: ["candidateRegistrationStamped"]
            },
            effects: [],
            messageKey: "msg.municipality.archive_stamp_first",
            reject: true
          },
          {
            requirements: {
              flags: ["candidateRegistrationStamped"],
              notFlags: ["ballotBoxArchiveClue"]
            },
            effects: [
              { type: "setFlag", key: "ballotBoxArchiveClue" },
              { type: "startQuest", questId: "quest.chapter1.ballot_box" }
            ],
            messageKey: "msg.municipality.ballot_box_clue"
          },
          {
            requirements: { flags: ["ballotBoxArchiveClue"] },
            effects: [],
            messageKey: "msg.municipality.ballot_box_clue_repeat"
          }
        ]
      }
    ],
    npcs: [
      {
        id: "npc.municipality_clerk",
        kind: "npc",
        nameKey: "npc.municipality_clerk.name",
        rect: { x: 735, y: 245, w: 170, h: 245 },
        speechAnchor: { x: 820, y: 215 },
        itemRejectKey: "msg.inventory.npc_reject.municipality_clerk",
        dialogueId: "dialogue.municipality_clerk",
        lookKey: "look.npc.municipality_clerk",
        itemUseRules: [
          {
            itemId: "item.fake_diploma",
            requirements: { notFlags: ["municipalityCredentialsAccepted"] },
            effects: [{ type: "setFlag", key: "municipalityCredentialsAccepted" }],
            messageKey: "msg.municipality.credentials_accepted"
          },
          {
            itemId: "item.fake_diploma",
            requirements: { flags: ["municipalityCredentialsAccepted"] },
            effects: [],
            messageKey: "msg.municipality.credentials_already_accepted"
          }
        ]
      }
    ]
  },
  {
    id: "scene.chapter1.election_booth",
    titleKey: "scene.chapter1.election_booth.title",
    palette: { sky: "#59656a", wall: "#726b5e", floor: "#373934" },
    movementSpeed: 70,
    playerStart: { x: 230, y: 525 },
    walkPolygons: [
      {
        id: "walk.chapter1.election_booth.main",
        points: [
          { x: 80, y: 425 },
          { x: 1190, y: 425 },
          { x: 1220, y: 590 },
          { x: 55, y: 590 }
        ]
      }
    ],
    perspectiveScale: { horizonY: 415, bottomY: 590, far: 0.82, near: 1.1 },
    anchors: {
      baiMitkoSpawn: { x: 230, y: 525 },
      commissionTable: { x: 850, y: 485 },
      exit: { x: 135, y: 515 }
    },
    foregroundLayers: [],
    exits: [
      {
        id: "exit.election_booth.to_square",
        kind: "exit",
        nameKey: "exit.to_village_square",
        rect: { x: 25, y: 300, w: 180, h: 255 },
        requirements: { state: { chapter1Completed: false } },
        targetSceneId: "scene.chapter1.village_square",
        targetPosition: { x: 650, y: 535 }
      }
    ],
    interactables: [
      {
        id: "hotspot.election_booth.commission_table",
        kind: "hotspot",
        nameKey: "hotspot.election_booth.commission_table.name",
        rect: { x: 650, y: 300, w: 430, h: 245 },
        lookKey: "look.election_booth.commission_table",
        endingTrigger: {
          groupId: "ending.chapter1",
          confirmKey: "ui.election.commit_confirm",
          cancelledMessageKey: "msg.election.deferred"
        }
      }
    ],
    npcs: []
  }
];

export const scenes = applySceneObjectGeometry(rawScenes, {
  [apartmentObjectGeometry.sceneId]: apartmentObjectGeometry,
  [villageSquareObjectGeometry.sceneId]: villageSquareObjectGeometry,
  [mehanaObjectGeometry.sceneId]: mehanaObjectGeometry,
  [municipalityObjectGeometry.sceneId]: municipalityObjectGeometry
});

function applySceneObjectGeometry(scenes, geometryBySceneId) {
  return scenes.map((scene) => {
    const geometry = geometryBySceneId[scene.id];
    if (!geometry?.objects) return scene;
    return {
      ...scene,
      exits: applyObjectGeometry(scene.exits, geometry.objects),
      interactables: applyObjectGeometry(scene.interactables, geometry.objects),
      npcs: applyObjectGeometry(scene.npcs, geometry.objects)
    };
  });
}

function applyObjectGeometry(objects = [], geometryByObjectId) {
  return objects
    .filter((object) => geometryByObjectId[object.id])
    .map((object) => {
      const geometry = geometryByObjectId[object.id];
      return geometry?.polygon ? { ...object, polygon: geometry.polygon } : object;
    });
}

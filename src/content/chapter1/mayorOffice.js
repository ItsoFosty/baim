import { mayorOfficeWalkGeometry } from "./walkMasks.generated.js";
import { sceneLayerGeometry } from "./sceneLayers.generated.js";

// The reporter accompanies the receipt and witnesses the diploma validation.
export const mayorOfficeScene = {
  id: "scene.chapter1.mayor_office",
  titleKey: "scene.chapter1.mayor_office.title",
  palette: { sky: "#68747a", wall: "#817866", floor: "#3f413c" },
  movementSpeed: 75,
  playerStart: { x: 270, y: 550 },
  ...mayorOfficeWalkGeometry,
  perspectiveScale: { horizonY: 420, bottomY: 700, far: 1.15, near: 1.65 },
  depthZones: [{
    id: "depth.chapter1.mayor_office.visitors",
    depth: 0.6,
    characterHeights: { "npc.bai_mitko": 325 },
    polygon: [{ x: 0, y: 440 }, { x: 1280, y: 440 }, { x: 1280, y: 720 }, { x: 0, y: 720 }]
  }],
  anchors: {
    baiMitkoSpawn: { x: 270, y: 550 },
    mayor: { x: 775, y: 533 },
    visitor: { x: 590, y: 545 },
    exit: { x: 200, y: 545 }
  },
  foregroundLayers: sceneLayerGeometry["scene.chapter1.mayor_office"]?.foregroundLayers || [],
  exits: [{
    id: "exit.mayor_office.to_municipality",
    kind: "exit",
    nameKey: "exit.to_municipality",
    rect: { x: 20, y: 85, w: 165, h: 435 },
    targetSceneId: "scene.chapter1.municipality",
    targetPosition: { x: 710, y: 510 }
  }],
  interactables: [{
    id: "hotspot.mayor_office.desk",
    kind: "hotspot",
    nameKey: "office.desk.name",
    rect: { x: 870, y: 365, w: 405, h: 205 },
    lookKey: "office.desk.look"
  }],
  npcs: [{
    id: "npc.journalist",
    kind: "npc",
    nameKey: "npc.journalist.name",
    rect: { x: 495, y: 235, w: 98, h: 290 },
    speechAnchor: { x: 545, y: 215 },
    lookKey: "look.npc.journalist",
    talkKey: "registration.office_reporter",
    talkRules: [{ requirements: { flags: ["mayorDiplomaStamped"] }, effects: [], messageKey: "registration.reporter_next" }],
    requirements: { flags: ["journalistInOffice"], state: { chapter1Completed: false } }
  }, {
    id: "npc.mayor",
    kind: "npc",
    nameKey: "office.mayor.name",
    rect: { x: 674, y: 243, w: 194, h: 290 },
    speechAnchor: { x: 760, y: 225 },
    lookKey: "office.mayor.look"
  }]
};

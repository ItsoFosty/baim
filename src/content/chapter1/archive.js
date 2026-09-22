import { sceneLayerGeometry } from "./sceneLayers.generated.js";
const box = "item.ballot_box";
const jar = "item.pickle_jar";
const flag = key => ({ type: "setFlag", key });
const unfinished = { chapter1Completed: false };
export const archiveEntryRules = [
  { requirements: { notFlags: ["candidateRegistrationStamped"] }, messageKey: "archive.registration_first", reject: true },
  { requirements: { anyOf: [{ flags: ["ballotBoxRecovered"] }, { anyStateTrue: ["hasBallotBox", "ballotBoxDelivered", "chapter1Completed"] }] }, messageKey: "archive.finished" },
  { effects: [flag("ballotBoxArchiveClue"), { type: "startQuest", questId: "quest.chapter1.ballot_box" }],
    sceneTransition: { sceneId: "scene.chapter1.archive" } }
];
export const archiveOpenRule = {
  itemId: "item.accordion",
  requirements: { items: ["item.accordion"], flags: ["candidateRegistrationStamped", "archiveHandleInspected"], notFlags: ["archiveOpened"], state: unfinished },
  effects: [flag("archiveOpened")], messageKey: "archive.opened"
};
export const ledgerRule = { effects: [flag("archiveLedgerRead")], messageKey: "archive.ledger_text" };
export const jarExchangeRule = {
  itemId: jar,
  requirements: { items: [jar], flags: ["archiveOpened", "archiveLedgerRead", "candidateRegistrationStamped"], notFlags: ["archiveJarPlaced", "ballotBoxRecovered"], state: unfinished },
  effects: [{ type: "removeItem", itemId: jar }, flag("archiveJarPlaced")], messageKey: "archive.exchanged"
};
export const boxTakeRules = [
  { requirements: { notFlags: ["archiveLedgerRead"] }, messageKey: "archive.read_first", reject: true },
  { requirements: { notFlags: ["archiveJarPlaced"] }, messageKey: "archive.replacement_first", reject: true }
];
const open = { flags: ["archiveOpened"] };
const handleRule = { effects: [flag("archiveHandleInspected")], messageKey: "archive.jammed" };
export const archiveScene = {
  id: "scene.chapter1.archive", titleKey: "archive.title", playerMode: "closeup",
  allowItemDrop: false, dropBlockedMessageKey: "archive.drop_outside",
  palette: { sky: "#736344", wall: "#736344", floor: "#3f392c" },
  playerStart: { x: 640, y: 700 }, walkPolygons: [], depthZones: [], anchors: {},
  exits: [{ id: "exit.archive.to_municipality", kind: "exit", nameKey: "archive.back",
    rect: { x: 495, y: 553, w: 305, h: 102 }, requirements: open,
    targetSceneId: "scene.chapter1.municipality", targetPosition: { x: 800, y: 530 } }],
  npcs: [],
  foregroundLayers: sceneLayerGeometry["scene.chapter1.archive"]?.foregroundLayers || [],
  interactables: [
    { id: "hotspot.archive.handle", kind: "hotspot", nameKey: "archive.handle",
      rect: { x: 475, y: 270, w: 310, h: 120 }, requirements: { notFlags: ["archiveOpened"] },
      lookRules: [handleRule],
      useRules: [{ sceneTransition: { sceneId: "scene.chapter1.municipality", position: { x: 800, y: 530 } } }],
      itemUseRules: [archiveOpenRule, { itemId: "item.accordion", messageKey: "archive.inspect_first", reject: true }] },
    { id: "hotspot.archive.ledger", kind: "hotspot", nameKey: "archive.ledger",
      rect: { x: 213, y: 272, w: 250, h: 195 }, requirements: open, lookRules: [ledgerRule], useRules: [ledgerRule] },
    { id: "hotspot.archive.jar", kind: "hotspot", nameKey: "item.pickle_jar.name",
      rect: { x: 550, y: 252, w: 157, h: 210 }, lookKey: "archive.jar_look",
      takeItemId: jar, restoreOnDrop: true,
      requirements: { flags: ["archiveOpened"], notFlags: ["archiveJarPlaced"], absentItems: [jar] } },
    { id: "hotspot.archive.ballot_box", kind: "hotspot", nameKey: "item.ballot_box.name",
      rect: { x: 750, y: 178, w: 283, h: 290 }, lookKey: "archive.box_look",
      requirements: { flags: ["archiveOpened"], notFlags: ["ballotBoxRecovered"], absentItems: [box], state: { hasBallotBox: false, ballotBoxDelivered: false } },
      takeItemId: box, flagOnTake: "hasBallotBox", takeRules: boxTakeRules, takeMessageKey: "archive.recovered",
      takeEffects: [flag("ballotBoxRecovered"), { type: "completeQuest", questId: "quest.chapter1.ballot_box" }, { type: "startQuest", questId: "quest.chapter1.journalist" }],
      itemUseRules: [jarExchangeRule, { itemId: jar, messageKey: "archive.read_first", reject: true }] },
    { id: "hotspot.archive.replacement", kind: "hotspot", nameKey: "archive.replacement",
      rect: { x: 1000, y: 270, w: 157, h: 210 }, requirements: { flags: ["archiveJarPlaced"] }, lookKey: "archive.replacement_look",
      takeItemId: jar, takeRules: [{ messageKey: "archive.leave_jar", reject: true }] }
  ]
};
export const archiveStages = [
  { id: "stage.ballot_box.find_archive", titleKey: "archive.quest.find", requirements: { notFlags: ["ballotBoxArchiveClue"] } },
  { id: "stage.ballot_box.follow_archive_clue", titleKey: "quest.chapter1.ballot_box.stage.follow_archive_clue", requirements: { notFlags: ["archiveOpened"] } },
  { id: "stage.ballot_box.read_ledger", titleKey: "archive.quest.read", requirements: { notFlags: ["archiveLedgerRead"] } },
  { id: "stage.ballot_box.replace", titleKey: "archive.quest.replace", requirements: { notFlags: ["archiveJarPlaced"] } },
  { id: "stage.ballot_box.take", titleKey: "archive.quest.take", requirements: { notFlags: ["ballotBoxRecovered"] } }
];
// Most advanced condition first: these hints also work for pre-archive legacy saves.
export const clerkArchiveChoices = [
  { requirements: { flags: ["ballotBoxRecovered"] }, messageKey: "archive.finished" },
  { requirements: { flags: ["archiveJarPlaced"] }, messageKey: "archive.clerk_take" },
  { requirements: { flags: ["archiveLedgerRead"] }, messageKey: "archive.clerk_replace" },
  { requirements: { flags: ["archiveOpened"] }, messageKey: "archive.clerk_ledger" },
  { requirements: { flags: ["archiveHandleInspected"] }, messageKey: "archive.clerk_strap" },
  { requirements: {}, messageKey: "archive.clerk_location" }
].map((rule, index, all) => ({
  textKey: "registration.need",
  requirements: { ...rule.requirements, flags: ["candidateRegistrationStamped", ...(rule.requirements.flags || [])],
    notFlags: all.slice(0, index).flatMap(r => r.requirements.flags || []) },
  effect: { messageKey: rule.messageKey }
}));

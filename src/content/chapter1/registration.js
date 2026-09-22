import { stampCue } from "./audio.js";
import { clerkArchiveChoices } from "./archive.js";
const receipt = "item.suspicious_receipt";
const diploma = "item.fake_diploma";
const unfinished = { chapter1Completed: false };
export const receiptAvailable = { absentItems: [receipt], notFlags: ["journalistHasReceipt"], state: unfinished };
export const receiptReward = { type: "addItem", itemId: receipt, requirements: receiptAvailable };
export const receiptRule = { requirements: receiptAvailable, effects: [receiptReward], messageKey: "registration.receipt_obtained" };
export const receiptHandover = {
  itemId: receipt,
  requirements: { items: [receipt], flags: ["campaignPosted"], notFlags: ["journalistHasReceipt"], state: unfinished },
  effects: [
    { type: "removeItem", itemId: receipt },
    { type: "setFlag", key: "journalistHasReceipt" },
    { type: "setFlag", key: "journalistInOffice" },
    { type: "startQuest", questId: "quest.chapter1.journalist" }
  ], messageKey: "registration.receipt_handover"
};
export const stampRequirements = {
  items: [diploma], flags: ["journalistHasReceipt", "journalistInOffice", "municipalityCredentialsAccepted"],
  notFlags: ["mayorDiplomaStamped", "candidateRegistrationStamped"], state: unfinished
};
export const stampRule = {
  requirements: stampRequirements,
  effects: [{ type: "setFlag", key: "mayorDiplomaStamped" }],
  soundCue: stampCue, messageKey: "registration.stamped"
};
export const registerRule = {
  itemId: diploma,
  requirements: { items: [diploma], flags: ["mayorDiplomaStamped"], notFlags: ["candidateRegistrationStamped"], state: unfinished },
  effects: [
    { type: "setFlag", key: "municipalityCredentialsAccepted" },
    { type: "setFlag", key: "candidateRegistrationStamped" },
    { type: "setFlag", key: "journalistInOffice", value: false },
    { type: "completeQuest", questId: "quest.chapter1.fake_diploma" },
    { type: "startQuest", questId: "quest.chapter1.ballot_box" }
  ], messageKey: "registration.registered"
};
const clerkRules = [registerRule,
  { itemId: diploma, requirements: { flags: ["candidateRegistrationStamped"] }, effects: [], messageKey: "registration.already_registered" },
  { itemId: diploma, requirements: { items: [diploma], state: unfinished }, effects: [{ type: "setFlag", key: "municipalityCredentialsAccepted" }], messageKey: "registration.clerk_rejects" }
];
const leave = { textKey: "registration.leave" };
export const clerkDialogue = {
  id: "dialogue.municipality_clerk", npcId: "npc.municipality_clerk",
  nodes: { start: { lineKey: "registration.clerk_start", lineRules: clerkArchiveChoices.map(choice => ({ requirements: choice.requirements, lineKey: choice.effect.messageKey })), choices: [
    { textKey: "registration.present", requirements: registerRule.requirements, effect: registerRule },
    { textKey: "registration.present", requirements: { items: [diploma], notFlags: ["mayorDiplomaStamped", "candidateRegistrationStamped"], state: unfinished }, effect: clerkRules[2] },
    { textKey: "registration.status", requirements: { flags: ["candidateRegistrationStamped"] }, effect: clerkRules[1] },
    ...clerkArchiveChoices,
    { textKey: "registration.need", requirements: { notFlags: ["candidateRegistrationStamped"] }, next: "requirements" }, leave
  ] }, requirements: { lineKey: "registration.clerk_rejects", choices: [leave] } }
};
export const mayorDialogue = {
  id: "dialogue.mayor", npcId: "npc.mayor",
  nodes: {
    start: { lineKey: "registration.mayor_start", choices: [
      { textKey: "registration.confront", requirements: stampRequirements, next: "evidence" },
      { textKey: "registration.next", requirements: { flags: ["mayorDiplomaStamped"] }, next: "after" },
      { textKey: "registration.need", next: "requirements" }, leave
    ] },
    requirements: { lineKey: "registration.mayor_requirements", choices: [leave] },
    evidence: { lineKey: "registration.mayor_evidence", choices: [{ textKey: "registration.listen", next: "offer" }] },
    offer: { lineKey: "registration.mayor_offer", choices: [{ textKey: "registration.stay_candidate", next: "stack" }] },
    stack: { lineKey: "registration.mayor_stack", choices: [{ textKey: "registration.watch_stamp", requirements: stampRequirements, effect: stampRule, next: "after" }, leave] },
    after: { lineKey: "registration.stamped", choices: [leave] }
  }
};
export const registrationStages = [
  { id: "stage.registration.evidence", titleKey: "registration.quest.evidence", requirements: { notFlags: ["journalistHasReceipt", "candidateRegistrationStamped"] } },
  { id: "stage.registration.clerk", titleKey: "registration.quest.clerk", requirements: { notFlags: ["municipalityCredentialsAccepted", "candidateRegistrationStamped"] } },
  { id: "stage.registration.mayor", titleKey: "registration.quest.mayor", requirements: { notFlags: ["mayorDiplomaStamped", "candidateRegistrationStamped"] } },
  { id: "stage.registration.register", titleKey: "registration.quest.register", requirements: { notFlags: ["candidateRegistrationStamped"] } }
];

export function wireRegistrationDialogues(dialogues) {
  return [...dialogues.map(dialogue => {
    if (dialogue.id === clerkDialogue.id) return clerkDialogue;
    if (dialogue.id === "dialogue.tony_fridge") {
      const choices = dialogue.nodes.start.choices;
      choices.find(choice => choice.next === "contest_result").effect.effects.push(receiptReward);
      choices.unshift({ textKey: "registration.collect_receipt", requirements: { ...receiptAvailable, state: { ...unfinished, tonyVote: true } }, effect: receiptRule });
      dialogue.nodes.contest_result.lineKey = "registration.tony_result";
    }
    if (dialogue.id === "dialogue.mehana_waiter") {
      dialogue.nodes.start.choices.unshift({ textKey: "registration.kiro_receipt", requirements: { ...receiptAvailable, flags: ["journalistEvidenceRequested"] }, effect: receiptRule });
    }
    if (dialogue.id === "dialogue.journalist") {
      const choices = dialogue.nodes.start.choices;
      // Keep the old final interview after recovery; it no longer introduces her.
      for (const choice of choices.slice(0, -1)) choice.requirements = { ...choice.requirements, flags: [...(choice.requirements?.flags || []), "ballotBoxRecovered"] };
      dialogue.nodes.start.lineKey = "registration.journalist_start";
      choices.unshift(
        { textKey: "registration.give_receipt", requirements: receiptHandover.requirements, effect: receiptHandover },
        { textKey: "registration.ask_evidence", requirements: { notFlags: ["journalistHasReceipt"], state: unfinished }, next: "evidence_request", effect: { effects: [{ type: "setFlag", key: "journalistEvidenceRequested" }, { type: "startQuest", questId: "quest.chapter1.journalist" }] } },
        { textKey: "registration.next", requirements: { flags: ["journalistHasReceipt"], notFlags: ["ballotBoxRecovered"] }, next: "registration_next" }
      );
      dialogue.nodes.evidence_request = { lineKey: "registration.evidence_request", choices: [leave] };
      dialogue.nodes.registration_next = { lineKey: "registration.reporter_next", choices: [leave] };
    }
    return dialogue;
  }), mayorDialogue];
}

export function wireRegistrationScenes(scenes) {
  return scenes.map(scene => ({ ...scene,
    exits: scene.exits.map(exit => {
      if (exit.id === "exit.square.to_municipality") return { ...exit,
        accessRequirements: { anyOf: [{ flags: ["campaignPosted"] }, { flags: ["candidateRegistrationStamped"] }, { state: { chapter1Completed: true } }] },
        blockedMessageKey: "registration.guard_blocked" };
      if (exit.id === "exit.municipality.to_mayor_office") return { ...exit,
        accessRequirements: { anyOf: [{ flags: ["journalistHasReceipt"] }, { flags: ["candidateRegistrationStamped"] }, { state: { chapter1Completed: true } }] },
        blockedMessageKey: "registration.office_blocked" };
      return exit;
    }),
    interactables: scene.interactables.map(target => {
      if (target.id === "hotspot.municipality.stamp_desk") return {
        id: target.id, kind: target.kind, nameKey: target.nameKey, rect: target.rect,
        lookKey: "registration.seal_prop", useRules: [{ messageKey: "registration.seal_prop", effects: [] }]
      };
      if (target.id === "hotspot.municipality.candidate_register") return { ...target,
        itemUseRules: [{ itemId: "item.municipality_stamp", effects: [], messageKey: "registration.no_self_stamp" }, { itemId: diploma, effects: [], messageKey: "registration.use_clerk" }],
        useRules: [{ messageKey: "registration.use_clerk", effects: [] }] };
      return target;
    }),
    npcs: scene.npcs.map(npc => {
      if (npc.id === "npc.municipality_clerk") return { ...npc, itemUseRules: clerkRules };
      if (npc.id === "npc.mayor") return { ...npc, dialogueId: "dialogue.mayor",
        itemUseRules: [{ itemId: diploma, effects: [], messageKey: "registration.talk_mayor" }] };
      if (npc.id === "npc.journalist" && scene.id === "scene.chapter1.village_square") return { ...npc,
        requirements: { anyOf: [{ flags: ["campaignPosted"] }, { flags: ["ballotBoxRecovered"] }, { state: { hasBallotBox: true } }], notFlags: ["journalistInOffice"], state: unfinished },
        itemUseRules: [receiptHandover] };
      return npc;
    })
  }));
}

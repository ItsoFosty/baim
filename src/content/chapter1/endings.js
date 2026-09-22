import { winCue, narrowCue, lossCue } from "./audio.js";
import { electionReportRules, endingEpilogue } from "./election.js";
const sharedCompletionEffects = [
  { type: "removeItem", itemId: "item.ballot_box" },
  { type: "setState", key: "ballotBoxDelivered", value: true },
  { type: "setState", key: "chapter1Completed", value: true },
  { type: "setFlag", key: "chapter1EndingResolved" },
  { type: "expireQuest", questId: "quest.chapter1.baba_vote" },
  { type: "expireQuest", questId: "quest.chapter1.tony_vote" },
  { type: "completeQuest", questId: "quest.chapter1.main" }
];

export const endings = [
  {
    id: "ending.chapter1.convincing_win",
    soundCue: winCue,
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.convincing_win.title",
    bodyKey: "ending.chapter1.convincing_win.body",
    reportRules: [{ textKey: "election.reason.convincing_win" }, ...electionReportRules],
    epilogue: endingEpilogue,
    requirements: {
      state: { babaStoyankaVote: true, tonyVote: true },
      stateMin: { influence: 40, publicMood: 55 },
      stateMax: { suspicion: 35 }
    },
    effects: [
      { type: "setState", key: "endingId", value: "ending.chapter1.convincing_win" },
      { type: "setState", key: "wonMunicipalSeat", value: true },
      { type: "setState", key: "mayorDefeated", value: true },
      ...sharedCompletionEffects
    ]
  },
  {
    id: "ending.chapter1.narrow_win",
    soundCue: narrowCue,
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.narrow_win.title",
    bodyKey: "ending.chapter1.narrow_win.body",
    reportRules: [{ textKey: "election.reason.narrow_win" }, ...electionReportRules],
    epilogue: endingEpilogue,
    requirements: { anyOf: [
      { state: { babaStoyankaVote: true, tonyVote: true } },
      { anyStateTrue: ["babaStoyankaVote", "tonyVote"], stateMin: { influence: 15, publicMood: 35 }, stateMax: { suspicion: 70 } }
    ] },
    effects: [
      { type: "setState", key: "endingId", value: "ending.chapter1.narrow_win" },
      { type: "setState", key: "wonMunicipalSeat", value: true },
      { type: "setState", key: "mayorDefeated", value: true },
      ...sharedCompletionEffects
    ]
  },
  {
    id: "ending.chapter1.loss",
    soundCue: lossCue,
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.loss.title",
    bodyKey: "ending.chapter1.loss.body",
    reportRules: [{ textKey: "election.reason.loss" }, ...electionReportRules],
    epilogue: endingEpilogue,
    requirements: {},
    effects: [
      { type: "setState", key: "endingId", value: "ending.chapter1.loss" },
      { type: "setState", key: "wonMunicipalSeat", value: false },
      { type: "setState", key: "mayorDefeated", value: false },
      ...sharedCompletionEffects
    ]
  }
].map(ending => ({ ...ending, presentation: { playerPosition: { x: 455, y: 625 }, facing: "west" } }));

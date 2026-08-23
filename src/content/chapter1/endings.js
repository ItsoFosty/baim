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
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.convincing_win.title",
    bodyKey: "ending.chapter1.convincing_win.body",
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
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.narrow_win.title",
    bodyKey: "ending.chapter1.narrow_win.body",
    requirements: {
      anyStateTrue: ["babaStoyankaVote", "tonyVote"],
      stateMin: { influence: 15, publicMood: 35 },
      stateMax: { suspicion: 70 }
    },
    effects: [
      { type: "setState", key: "endingId", value: "ending.chapter1.narrow_win" },
      { type: "setState", key: "wonMunicipalSeat", value: true },
      { type: "setState", key: "mayorDefeated", value: true },
      ...sharedCompletionEffects
    ]
  },
  {
    id: "ending.chapter1.loss",
    groupId: "ending.chapter1",
    titleKey: "ending.chapter1.loss.title",
    bodyKey: "ending.chapter1.loss.body",
    requirements: {},
    effects: [
      { type: "setState", key: "endingId", value: "ending.chapter1.loss" },
      { type: "setState", key: "wonMunicipalSeat", value: false },
      { type: "setState", key: "mayorDefeated", value: false },
      ...sharedCompletionEffects
    ]
  }
];

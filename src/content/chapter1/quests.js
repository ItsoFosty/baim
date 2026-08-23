export const quests = [
  { id: "quest.chapter1.main", titleKey: "quest.chapter1.main.title" },
  { id: "quest.chapter1.fake_diploma", titleKey: "quest.chapter1.fake_diploma.title" },
  { id: "quest.chapter1.baba_vote", titleKey: "quest.chapter1.baba_vote.title" },
  {
    id: "quest.chapter1.tony_vote",
    titleKey: "quest.chapter1.tony_vote.title",
    stages: [
      {
        id: "stage.tony.accept_challenge",
        titleKey: "quest.chapter1.tony_vote.stage.accept_challenge",
        requirements: { notFlags: ["tonyChallengeStarted"] }
      },
      {
        id: "stage.tony.distract",
        titleKey: "quest.chapter1.tony_vote.stage.distract",
        requirements: {
          flags: ["tonyChallengeStarted"],
          notFlags: ["tonyDistracted"],
          state: { swappedOwnRakiaWithWater: false }
        }
      },
      {
        id: "stage.tony.swap_water",
        titleKey: "quest.chapter1.tony_vote.stage.swap_water",
        requirements: {
          flags: ["tonyChallengeStarted", "tonyDistracted"],
          state: { swappedOwnRakiaWithWater: false }
        }
      },
      {
        id: "stage.tony.finish_challenge",
        titleKey: "quest.chapter1.tony_vote.stage.finish_challenge",
        requirements: { state: { swappedOwnRakiaWithWater: true, tonyVote: false } }
      }
    ]
  },
  { id: "quest.chapter1.journalist", titleKey: "quest.chapter1.journalist.title" },
  { id: "quest.chapter1.ballot_box", titleKey: "quest.chapter1.ballot_box.title" }
];

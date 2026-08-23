export const quests = [
  { id: "quest.chapter1.main", titleKey: "quest.chapter1.main.title" },
  {
    id: "quest.chapter1.fake_diploma",
    titleKey: "quest.chapter1.fake_diploma.title",
    stages: [
      {
        id: "stage.fake_diploma.collect_official_paper",
        titleKey: "quest.chapter1.fake_diploma.stage.collect_official_paper",
        requirements: { state: { hasUnpaidBills: false, hasFakeDiploma: false } }
      },
      {
        id: "stage.fake_diploma.collect_envelope",
        titleKey: "quest.chapter1.fake_diploma.stage.collect_envelope",
        requirements: { state: { hasEmptyEnvelope: false, hasFakeDiploma: false } }
      },
      {
        id: "stage.fake_diploma.assemble",
        titleKey: "quest.chapter1.fake_diploma.stage.assemble",
        requirements: {
          state: { hasUnpaidBills: true, hasEmptyEnvelope: true, hasFakeDiploma: false }
        }
      }
    ]
  },
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
  {
    id: "quest.chapter1.journalist",
    titleKey: "quest.chapter1.journalist.title",
    stages: [
      {
        id: "stage.journalist.find_reporter",
        titleKey: "quest.chapter1.journalist.stage.find_reporter",
        requirements: { notFlags: ["journalistRoadsAnswered"], state: { journalistInterviewCompleted: false } }
      },
      {
        id: "stage.journalist.finish_interview",
        titleKey: "quest.chapter1.journalist.stage.finish_interview",
        requirements: { flags: ["journalistRoadsAnswered"], state: { journalistInterviewCompleted: false } }
      }
    ]
  },
  {
    id: "quest.chapter1.ballot_box",
    titleKey: "quest.chapter1.ballot_box.title",
    stages: [
      {
        id: "stage.ballot_box.follow_archive_clue",
        titleKey: "quest.chapter1.ballot_box.stage.follow_archive_clue",
        requirements: {
          flags: ["ballotBoxArchiveClue"],
          state: { hasBallotBox: false }
        }
      }
    ]
  }
];

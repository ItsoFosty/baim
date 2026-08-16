export const dialogues = [
  {
    id: "dialogue.square.mehana_menu",
    nodes: {
      start: {
        lineKey: "dialogue.square.mehana_menu.title",
        entries: [
          { kind: "heading", textKey: "dialogue.square.mehana_menu.food_heading" },
          { textKey: "dialogue.square.mehana_menu.meatballs" },
          { textKey: "dialogue.square.mehana_menu.shopska" },
          { textKey: "dialogue.square.mehana_menu.mash" },
          { kind: "heading", textKey: "dialogue.square.mehana_menu.drinks_heading" },
          { textKey: "dialogue.square.mehana_menu.rakia" },
          { textKey: "dialogue.square.mehana_menu.wine" },
          { textKey: "dialogue.square.mehana_menu.beer" },
          { textKey: "dialogue.square.mehana_menu.water" }
        ],
        choices: [{ textKey: "dialogue.square.mehana_menu.close" }]
      }
    }
  },
  {
    id: "dialogue.tony_fridge",
    npcId: "npc.tony_fridge",
    nodes: {
      start: {
        lineKey: "dialogue.tony.start",
        choices: [
          { textKey: "dialogue.tony.choice.challenge", next: "challenge" },
          { textKey: "dialogue.tony.choice.politics", next: "politics" },
          { textKey: "dialogue.tony.choice.leave" }
        ]
      },
      politics: {
        lineKey: "dialogue.tony.politics",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      challenge: {
        lineKey: "dialogue.tony.challenge",
        choices: [
          {
            textKey: "dialogue.tony.choice.accept",
            effect: {
              effects: [{ type: "setFlag", key: "tonyChallengeStarted" }],
              messageKey: "dialogue.tony.challenge"
            }
          },
          {
            textKey: "dialogue.tony.choice.refuse",
            effect: {
              effects: [{ type: "adjustState", key: "suspicion", amount: 3 }]
            }
          }
        ]
      }
    }
  },
  {
    id: "dialogue.baba_stoyanka",
    npcId: "npc.baba_stoyanka",
    nodes: {
      start: {
        lineKey: "dialogue.baba.start",
        choices: [
          {
            textKey: "dialogue.baba.choice.ask_vote",
            requirements: {
              state: { babaStoyankaVote: false }
            },
            next: "vote_terms",
            effect: {
              effects: [{ type: "startQuest", questId: "quest.chapter1.baba_vote" }]
            }
          },
          { textKey: "dialogue.baba.choice.tradition", next: "tradition" },
          { textKey: "dialogue.baba.choice.promise", next: "promise" },
          {
            textKey: "dialogue.baba.choice.offer_bills",
            effect: {
              requirements: {
                items: ["item.unpaid_bills"],
                notFlags: ["babaRejectedBills"],
                state: { babaStoyankaVote: false }
              },
              effects: [
                { type: "startQuest", questId: "quest.chapter1.baba_vote" },
                { type: "setFlag", key: "babaRejectedBills" },
                { type: "adjustState", key: "babaCheapOfferAttempts", amount: 1, min: 0, max: 4 },
                { type: "adjustState", key: "suspicion", amount: 1 }
              ],
              messageKey: "msg.baba.reject_bills",
              reject: true
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_water",
            effect: {
              requirements: {
                items: ["item.glass_of_water"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_shopska",
            effect: {
              requirements: {
                items: ["item.shopska_salad"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_tripe_soup",
            effect: {
              requirements: {
                items: ["item.tripe_soup"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_rakia",
            effect: {
              requirements: {
                items: ["item.rakia"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_oil",
            effect: {
              requirements: {
                items: ["item.sunflower_oil"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_oil",
            effect: {
              requirements: {
                items: ["item.sunflower_oil"],
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
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_wine",
            effect: {
              requirements: {
                items: ["item.village_wine"],
                notFlags: ["babaRequiresBetterGift"],
                state: { babaStoyankaVote: false }
              },
              effects: [{ type: "startQuest", questId: "quest.chapter1.baba_vote" }],
              messageKey: "msg.baba.reject_early_wine",
              reject: true
            }
          },
          {
            textKey: "dialogue.baba.choice.offer_wine",
            effect: {
              requirements: {
                items: ["item.village_wine"],
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
          },
          {
            textKey: "dialogue.baba.choice.confirm_vote",
            requirements: { state: { babaStoyankaVote: true } },
            next: "vote_confirmed"
          },
          { textKey: "dialogue.baba.choice.leave" }
        ]
      },
      tradition: {
        lineKey: "dialogue.baba.tradition",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      vote_terms: {
        lineKey: "dialogue.baba.vote_terms",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      promise: {
        lineKey: "dialogue.baba.promise",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      vote_confirmed: {
        lineKey: "dialogue.baba.vote_confirmed",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      }
    }
  },
  {
    id: "dialogue.mehana_waiter",
    npcId: "npc.mehana_waiter",
    nodes: {
      start: {
        lineKey: "dialogue.waiter.start",
        choices: [
          {
            textKey: "dialogue.waiter.choice.rakia",
            next: "rakia_serving"
          },
          {
            textKey: "dialogue.waiter.choice.shopska",
            next: "shopska_serving"
          },
          {
            textKey: "dialogue.waiter.choice.tripe_soup",
            next: "tripe_soup_serving"
          },
          {
            textKey: "dialogue.waiter.choice.village_wine",
            next: "village_wine_serving"
          },
          { textKey: "dialogue.waiter.choice.people", next: "people" },
          { textKey: "dialogue.waiter.choice.leave" }
        ]
      },
      people: {
        lineKey: "dialogue.waiter.people",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      rakia_serving: {
        lineKey: "dialogue.waiter.serving_question",
        choices: [
          {
            textKey: "dialogue.waiter.choice.for_here",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedRakia" },
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
          },
          {
            textKey: "dialogue.waiter.choice.to_go",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedRakia" },
                { type: "addItem", itemId: "item.rakia" }
              ],
              messageKey: "msg.mehana.rakia_to_go"
            }
          }
        ]
      },
      shopska_serving: {
        lineKey: "dialogue.waiter.serving_question",
        choices: [
          {
            textKey: "dialogue.waiter.choice.for_here",
            effect: {
              effects: [{ type: "setFlag", key: "mehanaOrderedShopska" }],
              messageKey: "msg.mehana.shopska_ordered"
            }
          },
          {
            textKey: "dialogue.waiter.choice.to_go",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedShopska" },
                { type: "addItem", itemId: "item.shopska_salad" }
              ],
              messageKey: "msg.mehana.shopska_to_go"
            }
          }
        ]
      },
      tripe_soup_serving: {
        lineKey: "dialogue.waiter.serving_question",
        choices: [
          {
            textKey: "dialogue.waiter.choice.for_here",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedTripeSoup" },
                { type: "adjustState", key: "rakiaGlasses", amount: -2, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
              ],
              messageKey: "msg.mehana.tripe_soup"
            }
          },
          {
            textKey: "dialogue.waiter.choice.to_go",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedTripeSoup" },
                { type: "addItem", itemId: "item.tripe_soup" }
              ],
              messageKey: "msg.mehana.tripe_soup_to_go"
            }
          }
        ]
      },
      village_wine_serving: {
        lineKey: "dialogue.waiter.serving_question",
        choices: [
          {
            textKey: "dialogue.waiter.choice.for_here",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedVillageWine" },
                { type: "adjustState", key: "rakiaGlasses", amount: 1, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
              ],
              messageKey: "msg.mehana.village_wine"
            }
          },
          {
            textKey: "dialogue.waiter.choice.to_go",
            effect: {
              effects: [
                { type: "setFlag", key: "mehanaOrderedVillageWine" },
                { type: "addItem", itemId: "item.village_wine" }
              ],
              messageKey: "msg.mehana.village_wine_to_go"
            }
          }
        ]
      }
    }
  }
];

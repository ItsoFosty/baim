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
          { textKey: "dialogue.baba.choice.tradition", next: "tradition" },
          { textKey: "dialogue.baba.choice.promise", next: "promise" },
          { textKey: "dialogue.baba.choice.leave" }
        ]
      },
      tradition: {
        lineKey: "dialogue.baba.tradition",
        choices: [{ textKey: "dialogue.common.back", next: "start" }]
      },
      promise: {
        lineKey: "dialogue.baba.promise",
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
      }
    }
  }
];

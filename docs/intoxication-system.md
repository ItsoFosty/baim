# Rakia Intoxication System

The Chapter 1 prototype stores intoxication as `rakiaGlasses`, an integer from 0 to 10. The state is
engine-level and reusable; apartment and Mehana content change it through bounded `adjustState`
effects rather than scene-specific code. Saves also record `rakiaLastChangedAt`.

## Player Feedback

- HUD bands: `0–1` Daisy / Минзухар, `2–4` Merry / Почерпен, `5–7` Tipsy / Подпийнал,
  and `8–10` Plastered / Мотика.
- The glass track moves from muted yellow to red.
- Higher values progressively slow movement and add visual sway.
- Drinking barks become more expansive and repetitive without turning Bai Mitko into an aggressive
  or degrading stereotype.

## Recovery

One glass clears after each five minutes of elapsed wall-clock time. Water reduces the game counter
by one, tripe soup by two, and an apartment sofa-bed nap by three. These are deliberately compressed
adventure-game recovery mechanics, not claims that food, water, or sleep remove alcohol from the
body faster. Real alcohol metabolism primarily requires time.

The implementation language was informed by Bulgarian references on coordination, speech, and
calm communication, then fictionalized into light campaign satire. It avoids aggression as a
default trait and does not copy a real person or incident.

## Current Content Hooks

- `hotspot.apartment.rakia_bottle`: repeatable testing drink.
- `hotspot.apartment.bed`: the existing green sofa is treated as a sofa-bed until dedicated bed art
  is approved.
- `hotspot.mehana.water_jug`: consumes a carried glass of water outside the Tony puzzle rules.
- `dialogue.mehana_waiter`: rakia raises the counter; tripe soup lowers it.
- Inventory self-use consumes takeaway refreshments and adjusts the counter: rakia `+2`, village wine
  `+1`, water `-1`, Shopska salad `-1`, and tripe soup `-2`.
- The direct Use on Bai Mitko action is authored through item `selfUseRules`; it is not special-cased in
  the intoxication engine. Playing the accordion on himself is non-consuming and does not change the meter.

## Reference Notes

- [NIAAA: the body metabolizes alcohol over time](https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/truth-about-holiday-spirits)
- [NIAAA: hangover remedies do not speed alcohol recovery](https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/hangovers)
- [Bulgarian National Center of Public Health guidance](https://ncpha.government.bg/uploads/pages/125/2023-GUIDE-PsSoSupprt.pdf)
- [Bulgarian road-safety medical assessment form](https://www.sars.gov.bg/wp-content/uploads/2023/07/%D0%9D%D0%B0%D1%80%D0%B5%D0%B4%D0%B1%D0%B0-%E2%84%96-1-%D0%BE%D1%82-19-%D1%8E%D0%BB%D0%B8-2017-%D0%B3.pdf)

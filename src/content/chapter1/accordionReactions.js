// Base keys remain available to existing content/tests; variants are optional flavor.
const pool = (base, count = 3) => [base, ...Array.from({ length: count - 1 }, (_, i) => `${base}.${i + 2}`)];
export const accordionReactions = {
  self: pool("msg.self.accordion"),
  babaBefore: pool("msg.accordion_baba_before_vote"),
  babaAfter: pool("msg.accordion_baba_after_vote"),
  tony: pool("msg.accordion.tony"),
  tonyDistracted: pool("msg.accordion_tony"),
  waiter: pool("msg.accordion_kiro"),
  journalist: pool("msg.accordion.journalist"),
  oldMen: pool("msg.accordion.old_men", 4),
  kiosk: pool("msg.accordion.kiosk"),
  mayor: pool("msg.accordion.mayor"),
  clerk: pool("msg.accordion.clerk"),
  colleague: pool("msg.accordion.colleague"),
  backgroundClerk: pool("msg.accordion.background_clerk"),
  security: pool("msg.accordion.security"),
  animal: pool("msg.accordion_animal"),
  fallback: pool("msg.accordion_generic_npc")
};

export const accordionCharacterReactions = [
  ["npc.tony_fridge", "tony"],
  ["npc.mehana_waiter", "waiter"],
  ["npc.journalist", "journalist"],
  ["hotspot.square.old_men_bench", "oldMen"],
  ["hotspot.square.kiosk", "kiosk"],
  ["npc.mayor", "mayor"],
  ["npc.municipality_clerk", "clerk"],
  ["npc.municipality_colleague", "colleague"],
  ["npc.municipality_background_clerk", "backgroundClerk"],
  ["npc.municipality_security_officer", "security"]
].map(([targetId, poolId]) => ({ targetIds: [targetId], messageKeys: accordionReactions[poolId] }));

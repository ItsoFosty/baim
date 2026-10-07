// Session-only shuffled bags: every authored line appears before a repeat.
// Pools use localization keys, so switching language does not reset a speaker.
export class MessageVariationSystem {
  constructor(random = Math.random) {
    this.random = random;
    this.pools = new Map();
  }

  next(keys) {
    const choices = [...new Set(keys)];
    if (!choices.length) return undefined;
    const id = JSON.stringify(choices);
    let pool = this.pools.get(id);
    if (!pool) this.pools.set(id, pool = { remaining: [], last: null });
    if (!pool.remaining.length) {
      pool.remaining = [...choices];
      for (let i = pool.remaining.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [pool.remaining[i], pool.remaining[j]] = [pool.remaining[j], pool.remaining[i]];
      }
      const end = pool.remaining.length - 1;
      if (end > 0 && pool.remaining[end] === pool.last) {
        [pool.remaining[0], pool.remaining[end]] = [pool.remaining[end], pool.remaining[0]];
      }
    }
    pool.last = pool.remaining.pop();
    return pool.last;
  }
}

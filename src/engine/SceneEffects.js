// Small procedural effects sit alongside raster layers in the scene depth stack.
// Geometry, color, timing and visibility are authored by content, not scene IDs.
export function streamPoint(points, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * points[0].x + 3 * u ** 2 * t * points[1].x + 3 * u * t ** 2 * points[2].x + t ** 3 * points[3].x,
    y: u ** 3 * points[0].y + 3 * u ** 2 * t * points[1].y + 3 * u * t ** 2 * points[2].y + t ** 3 * points[3].y
  };
}

export function drawSceneEffect(ctx, effect, seconds = 0) {
  if (effect.type !== "waterStream" || effect.points?.length !== 4) return;
  const [start, a, b, end] = effect.points;
  const phase = ((seconds * (effect.speed ?? 0.7)) % 1 + 1) % 1;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = effect.width ?? 3;
  ctx.strokeStyle = effect.color ?? "rgba(115,192,204,0.65)";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(a.x, a.y, b.x, b.y, end.x, end.y);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = effect.highlight ?? "rgba(229,250,239,0.85)";
  for (let i = 0; i < 5; i++) {
    const t = (phase + i / 5) % 1;
    const p = streamPoint(effect.points, t);
    const q = streamPoint(effect.points, Math.min(1, t + 0.065));
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
  const spread = 3 + phase * 9;
  ctx.globalAlpha = (1 - phase) * 0.6;
  ctx.beginPath();
  ctx.moveTo(end.x - spread, end.y + 1);
  ctx.quadraticCurveTo(end.x, end.y + 5, end.x + spread, end.y + 1);
  ctx.stroke();
  ctx.restore();
}

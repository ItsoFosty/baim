// The world keeps its 1280x720 coordinate system. Compact controls use CSS pixels.
export function viewportLayout(width, height) {
  const scale = Math.max(0.01, Math.min(width / 1280, height / 720));
  const sceneLeft = (width - 1280 * scale) / 2;
  const sceneTop = (height - 720 * scale) / 2;
  return {
    scale, sceneLeft, sceneTop, sceneHeight: 720 * scale,
    compact: scale < 0.8 && Math.min(width, height) < 600,
    uiLeft: -sceneLeft / scale, uiTop: -sceneTop / scale,
    inverseScale: 1 / scale
  };
}

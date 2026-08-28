import { sceneCharacterHeight, sceneDepthT } from "./DepthMath.js";

export function characterHeight(definition, scene, position) {
  const calibration = definition.render.sceneHeights[scene.id] || { near: definition.gameHeight, far: definition.gameHeight };
  const fixedHeight = sceneCharacterHeight(scene, position, definition.id);
  if (fixedHeight) return fixedHeight;
  if (!scene.perspectiveScale) return calibration.near;
  const t = sceneDepthT(scene, position);
  return calibration.far + t * (calibration.near - calibration.far);
}

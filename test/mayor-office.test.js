import test from "node:test";
import assert from "node:assert/strict";
import { chapter1 } from "../src/content/chapter1/index.js";
import { findTargetAt, findWalkPath, isWalkable } from "../src/engine/SceneGeometry.js";

const office = chapter1.scenes.find(scene => scene.id === "scene.chapter1.mayor_office");
const hall = chapter1.scenes.find(scene => scene.id === "scene.chapter1.municipality");

test("office door and return exit resolve to the intended scenes and walkable landings", () => {
  const door = findTargetAt(hall, { x: 710, y: 300 }, () => true);
  assert.equal(door.id, "exit.municipality.to_mayor_office");
  assert.equal(door.targetSceneId, office.id);
  assert.ok(isWalkable(office, door.targetPosition));
  const back = findTargetAt(office, { x: 100, y: 300 }, () => true);
  assert.equal(back.targetSceneId, hall.id);
  assert.ok(isWalkable(hall, back.targetPosition));
});

test("office visitors can reach conversation and exit positions without walking through furniture", () => {
  for (const target of [office.anchors.visitor, office.anchors.exit, { x: 1100, y: 625 }]) {
    assert.ok(findWalkPath(office, office.playerStart, target).length, JSON.stringify(target));
  }
  for (const blocked of [{ x: 1000, y: 480 }, { x: 725, y: 410 }, { x: 320, y: 405 }]) {
    assert.equal(isWalkable(office, blocked), false, JSON.stringify(blocked));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Game } from '../src/engine/Game.js';
import { Renderer } from '../src/engine/Renderer.js';
import { DialogueSystem } from '../src/engine/DialogueSystem.js';
import { chapter1 } from '../src/content/chapter1/index.js';
import { assetManifest } from '../src/content/art/assetManifest.js';
import { imageAssetPaths } from '../src/engine/AssetLoader.js';

const square = chapter1.scenes.find(s => s.id === 'scene.chapter1.village_square');
const baba = square.foregroundLayers.find(l => l.id === 'layer.square.baba_stoyanka_seated');
function fixture() {
 const dialogues={ sample:{npcId:'npc.baba_stoyanka',nodes:{start:{lineKey:'start'},next:{lineKey:'next'},other:{lineKey:'other',npcId:'npc.journalist'},silent:{}}}};
 return Object.assign(Object.create(Game.prototype), {
  content:{dialogues}, currentScene:square, dialogue:new DialogueSystem(dialogues),
  effectContext:()=>({}), t:key=>key, speechBubbleVisibleSeconds:()=>2,
  npcDialogueSpeech:null,npcSpeechBubble:null
 });
}
test('NPC speech ends while dialogue choices remain and restarts for a new line or session',()=>{
 const g=fixture(); g.dialogue.start('sample'); g.updateNpcDialogueSpeech();
 assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),0);
 g.updateNpcDialogueSpeech(1); assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),1000);
 g.updateNpcDialogueSpeech(); assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),1000);
 g.updateNpcDialogueSpeech(1); assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),null);
 assert.ok(g.dialogue.current);
 g.dialogue.choose({next:'next'});g.updateNpcDialogueSpeech();assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),0);
 g.dialogue.close();assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),null);
 g.dialogue.start('sample');g.updateNpcDialogueSpeech();assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),0);
});
test('NPC speech respects node speakers, silent nodes, scene changes and timed reactions',()=>{
 const g=fixture();g.dialogue.start('sample');g.updateNpcDialogueSpeech();
 assert.equal(g.npcSpeechAnimationTime('npc.journalist'),null);
 g.dialogue.choose({next:'other'});g.updateNpcDialogueSpeech();
 assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),null);
 assert.equal(g.npcSpeechAnimationTime('npc.journalist'),0);
 g.dialogue.choose({next:'silent'});g.updateNpcDialogueSpeech();assert.equal(g.npcDialogueSpeech,null);
 g.dialogue.start('sample');g.updateNpcDialogueSpeech();g.currentScene={id:'elsewhere',npcs:[]};g.updateNpcDialogueSpeech();
 assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),null);
 g.dialogue.close();g.currentScene=square;
 g.npcSpeechBubble={npcId:'npc.baba_stoyanka',elapsed:.5,visibleSeconds:2,phase:'visible'};
 assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),500);
 assert.equal(g.npcSpeechAnimationTime('npc.journalist'),null);
 g.npcSpeechBubble.phase='out';assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),null);
});
test('NPC dialogue clock freezes while paused or in menus',()=>{
 const g=fixture();g.dialogue.start('sample');g.updateNpcDialogueSpeech();
 g.updateNpcDialogueSpeech(.5);
 for(const flag of ['paused','menuOpen','devHome','editMode']){
  g[flag]=true;g.updateNpcDialogueSpeech(1);assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),500);g[flag]=false;
 }
 g.updateNpcDialogueSpeech(.5);assert.equal(g.npcSpeechAnimationTime('npc.baba_stoyanka'),1000);
});
test('Baba talk keeps shared registration and falls back to approved idle then static',()=>{
 const talk={id:'talk'},idle={id:'idle'},fallback={id:'static',naturalWidth:500,naturalHeight:800};
 const loaded=new Set([talk,idle,fallback]),calls=[];
 let speechTime=0;
 const renderer=Object.assign(Object.create(Renderer.prototype),{ctx:{drawImage:(...a)=>calls.push(a)},game:{lastTime:198,npcSpeechAnimationTime:()=>speechTime,assets:{getSceneImage:(_id,alias)=>alias===baba.talkAnimation.asset?talk:alias===baba.animation.asset?idle:fallback,isLoaded:img=>loaded.has(img)}}});
 renderer.drawSceneRasterLayer(square,baba);
 assert.equal(calls.at(-1)[0],talk);
 assert.equal(calls.at(-1)[1],132);assert.equal(calls.at(-1)[2],94);
 const [x,y,w,h]=calls.at(-1).slice(5);
 assert.equal(x,325);assert.equal(y,330-122/193);assert.ok(Math.abs(w-119*122/193)<1e-9);assert.ok(Math.abs(h-194*122/193)<1e-9);
 speechTime=190;renderer.drawSceneRasterLayer(square,baba);assert.equal(calls.at(-1)[1],516);
 assert.deepEqual(calls.at(-1).slice(5),[x,y,w,h]);
 loaded.delete(talk);renderer.drawSceneRasterLayer(square,baba);assert.equal(calls.at(-1)[0],idle);
 loaded.add(talk);speechTime=null;renderer.drawSceneRasterLayer(square,baba);assert.equal(calls.at(-1)[0],idle);
 loaded.delete(idle);renderer.drawSceneRasterLayer(square,baba);assert.equal(calls.at(-1)[0],fallback);
});
test('Baba talk is preloaded only in the square and preserves approved idle and election data',()=>{
 assert.equal(baba.height,122);assert.equal(baba.top,330);assert.equal(baba.left,325);assert.equal(baba.zIndex,90);
 assert.deepEqual(baba.animation.contentBounds,{x:132,y:95,w:119,h:193});
 assert.equal(baba.animation.frameDurationMs,198);
 assert.equal(baba.talkAnimation.npcId,'npc.baba_stoyanka');assert.equal(baba.talkAnimation.frameDurationMs,190);
 assert.ok(imageAssetPaths(assetManifest.scenes[square.id]).includes(assetManifest.scenes[square.id].babaStoyankaTalkSeated));
 const election=chapter1.scenes.find(s=>s.id==='scene.chapter1.election_booth');
 assert.ok(election.foregroundLayers.every(l=>!l.talkAnimation));
 assert.equal(assetManifest.scenes[election.id].babaStoyankaTalkSeated,undefined);
 const pilot=JSON.parse(readFileSync('assets_src/characters/baba_stoyanka/external_animation_v1/animation-pilot.json'));
 assert.equal(pilot.animations.baba_idle_seated_1.status,'runtime_approved');
 assert.equal(pilot.animations.baba_talk_seated_1.status,'runtime_approved');
});

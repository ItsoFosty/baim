import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DialogueSystem} from '../src/engine/DialogueSystem.js';
import {Renderer} from '../src/engine/Renderer.js';
import {chapter1} from '../src/content/chapter1/index.js';
import {assetManifest} from '../src/content/art/assetManifest.js';
import {imageAssetPaths} from '../src/engine/AssetLoader.js';

const scene=chapter1.scenes.find(s=>s.id==='scene.chapter1.mehana');
const layer=scene.foregroundLayers.find(l=>l.id==='layer.mehana.tony_fridge_seated');
const dialogues=Object.fromEntries(chapter1.dialogues.map(d=>[d.id,d]));
const nod=layer.reactionAnimations.approving_nod;
const frame=(d,animation=nod)=>Math.floor(d[2]/animation.frameHeight)*animation.columns+Math.floor(d[1]/animation.frameWidth);

function fixture(turned=true){
 const dialogue=new DialogueSystem(dialogues,null);
 const assets=[nod.asset,layer.reactionAnimations.confident_chuckle.asset,layer.reactionAnimations.skeptical_glance.asset,layer.talkAnimation.asset,layer.animation.asset,layer.asset];
 const images=Object.fromEntries(assets.map(a=>[a,{}])),loaded=new Set(Object.values(images)),draws=[];
 const game={lastTime:0,dialogue,content:{dialogues},speech:0,npcSpeechAnimationTime(){return dialogue.current?this.speech:null;},assets:{getSceneImage:(_id,a)=>images[a],isLoaded:i=>loaded.has(i)}};
 const renderer=Object.assign(Object.create(Renderer.prototype),{ctx:{drawImage:(...a)=>draws.push(a)},game});
 const draw=t=>{game.lastTime=t;renderer.drawSceneRasterLayer(scene,layer);return draws.at(-1);};
 dialogue.start('dialogue.tony_fridge');draw(0);if(turned)draw(1000);
 return {dialogue,images,loaded,game,renderer,draw,enter:node=>dialogue.choose({next:node})};
}

test('contest result plays every approving-nod frame once and deliberate reentry is fresh',()=>{
 const f=fixture();f.enter('contest_result');const entry=f.dialogue.entry;
 assert.equal(entry.reactionId,'approving_nod');
 for(let i=0;i<36;i++){const d=f.draw(1016+i*82);assert.equal(d[0],f.images[nod.asset]);assert.equal(frame(d),i);}
 const resumed=f.draw(3984);assert.equal(resumed[0],f.images[layer.talkAnimation.asset]);assert.ok(frame(resumed,layer.talkAnimation)>=4&&frame(resumed,layer.talkAnimation)<=21);
 f.dialogue.getNode();assert.equal(f.dialogue.entry,entry);assert.equal(f.draw(5000)[0],f.images[layer.talkAnimation.asset]);
 f.game.speech=null;assert.equal(frame(f.draw(5016),layer.talkAnimation),4);f.enter('contest_result');assert.notEqual(f.dialogue.entry,entry);assert.equal(frame(f.draw(5032)),0);
});

test('approving nod waits for intro, preserves registration, freezes with menu and cancels on skip',()=>{
 const f=fixture(false);f.enter('contest_result');assert.equal(f.draw(16)[0],f.images[layer.talkAnimation.asset]);
 const d=f.draw(748),scale=320 / 198;assert.equal(frame(d),0);assert.deepEqual(d.slice(5),[877-4*scale,296-1*scale,nod.contentBounds.w*scale,nod.contentBounds.h*scale]);
 f.game.menuOpen=true;assert.equal(frame(f.draw(2000)),0);f.game.menuOpen=false;assert.equal(frame(f.draw(2082)),1);
 f.enter('support_confirmed');assert.equal(f.draw(2098)[0],f.images[layer.talkAnimation.asset]);assert.equal(f.renderer.npcReactionPlayback.get(layer.id).phase,'idle');
});

test('missing nod is consumed without late replay and prior reactions remain independently selectable',()=>{
 const f=fixture();f.enter('contest_result');f.loaded.delete(f.images[nod.asset]);assert.equal(f.draw(1016)[0],f.images[layer.talkAnimation.asset]);
 f.loaded.add(f.images[nod.asset]);assert.equal(f.draw(1032)[0],f.images[layer.talkAnimation.asset]);
 f.enter('challenge_accepted');assert.equal(f.draw(1048)[0],f.images[layer.reactionAnimations.confident_chuckle.asset]);
 f.enter('challenge_waiting');assert.equal(f.draw(1064)[0],f.images[layer.reactionAnimations.skeptical_glance.asset]);
});

test('approving-nod provenance, timing, scene isolation and approved assets are preserved',()=>{
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const pilot=JSON.parse(readFileSync('assets_src/characters/tony_fridge/external_animation_v1/animation-pilot.json')).animations;
 const candidate=pilot.tony_approving_nod_seated_1;
 assert.equal(candidate.status,'runtime_approved');assert.equal(candidate.review.candidateStatus,'runtime_approved');
 assert.equal(sha('assets_src/characters/tony_fridge/external_animation_v1/'+candidate.source.storedFilename),candidate.source.sourceZipSha256);
 assert.equal(sha(candidate.import.runtime.asset),candidate.import.derivedOutputHashes[candidate.import.runtime.asset]);
 assert.deepEqual([nod.frameCount,nod.columns,nod.frameDurationMs,nod.loop],[36,6,82,false]);assert.deepEqual(nod.registrationBounds,layer.animation.contentBounds);
 assert.equal(dialogues['dialogue.tony_fridge'].nodes.contest_result.reactionId,'approving_nod');
 assert.ok(imageAssetPaths(assetManifest.scenes[scene.id]).includes(candidate.import.runtime.asset));
 const election=chapter1.scenes.find(s=>s.id==='scene.chapter1.election_booth');assert.ok(election.foregroundLayers.every(l=>!l.reactionAnimations));
 for(const [name,hash] of [['seated-v1.png','b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8'],['idle-seated-v1.webp','1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e'],['talk-seated-v1.webp','9ad05841d2f274e9c66574dca99cf802a41207c7468b7db4bad4ed77436c3ac0'],['chuckle-seated-v1.webp','6d2fc49711cf9c62d33bf85576df2f3becd242614d9b3ecab2ceac6a40757092'],['skeptical-seated-v1.webp','26bac7a7fdf49c9a453070ef0ecb623207e33591da1b7af1bfbcc2e80d9219ed']])assert.equal(sha('assets/chapter1/characters/tony_fridge/'+name),hash);
});

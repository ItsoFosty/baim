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
const anger=layer.reactionAnimations.slow_anger;
const frame=(d,animation=anger)=>Math.floor(d[2]/animation.frameHeight)*animation.columns+Math.floor(d[1]/animation.frameWidth);

function fixture(turned=true){
 const dialogue=new DialogueSystem(dialogues,null);
 const assets=[anger.asset,...Object.values(layer.reactionAnimations).map(a=>a.asset),layer.talkAnimation.asset,layer.animation.asset,layer.asset];
 const images=Object.fromEntries(assets.map(a=>[a,{}])),loaded=new Set(Object.values(images)),draws=[];
 const game={lastTime:0,dialogue,content:{dialogues},speech:0,npcSpeechAnimationTime(){return dialogue.current?this.speech:null;},assets:{getSceneImage:(_id,a)=>images[a],isLoaded:i=>loaded.has(i)}};
 const renderer=Object.assign(Object.create(Renderer.prototype),{ctx:{drawImage:(...a)=>draws.push(a)},game});
 const draw=t=>{game.lastTime=t;renderer.drawSceneRasterLayer(scene,layer);return draws.at(-1);};
 dialogue.start('dialogue.tony_fridge');draw(0);if(turned)draw(1000);
 return {dialogue,images,loaded,game,renderer,draw,enter:node=>dialogue.choose({next:node})};
}

test('challenge deferred plays every slow-anger frame once and deliberate reentry is fresh',()=>{
 const f=fixture();f.enter('challenge_deferred');const entry=f.dialogue.entry;
 assert.equal(entry.reactionId,'slow_anger');
 for(let i=0;i<36;i++){const d=f.draw(1016+i*109);assert.equal(d[0],f.images[anger.asset]);assert.equal(frame(d),i);}
 const resumed=f.draw(4940);assert.equal(resumed[0],f.images[layer.talkAnimation.asset]);assert.ok(frame(resumed,layer.talkAnimation)>=4&&frame(resumed,layer.talkAnimation)<=21);
 f.dialogue.getNode();assert.equal(f.dialogue.entry,entry);assert.equal(f.draw(5200)[0],f.images[layer.talkAnimation.asset]);
 f.game.speech=null;assert.equal(frame(f.draw(5300),layer.talkAnimation),4);f.enter('challenge_deferred');assert.notEqual(f.dialogue.entry,entry);assert.equal(frame(f.draw(5316)),0);
});

test('slow anger waits for intro, preserves registration, freezes with menu and cancels on skip',()=>{
 const f=fixture(false);f.enter('challenge_deferred');assert.equal(f.draw(16)[0],f.images[layer.talkAnimation.asset]);
 const d=f.draw(748),scale=320 / 198;assert.equal(frame(d),0);assert.deepEqual(d.slice(5),[877-3*scale,296+1*scale,anger.contentBounds.w*scale,anger.contentBounds.h*scale]);
 f.game.menuOpen=true;assert.equal(frame(f.draw(2000)),0);f.game.menuOpen=false;assert.equal(frame(f.draw(2109)),1);
 f.enter('support_confirmed');assert.equal(f.draw(2125)[0],f.images[layer.talkAnimation.asset]);assert.equal(f.renderer.npcReactionPlayback.get(layer.id).phase,'idle');
});

test('missing anger is consumed without late replay and all prior reactions remain selectable',()=>{
 const f=fixture();f.enter('challenge_deferred');f.loaded.delete(f.images[anger.asset]);assert.equal(f.draw(1016)[0],f.images[layer.talkAnimation.asset]);
 f.loaded.add(f.images[anger.asset]);assert.equal(f.draw(1032)[0],f.images[layer.talkAnimation.asset]);
 f.enter('challenge_accepted');assert.equal(f.draw(1048)[0],f.images[layer.reactionAnimations.confident_chuckle.asset]);
 f.enter('challenge_waiting');assert.equal(f.draw(1064)[0],f.images[layer.reactionAnimations.skeptical_glance.asset]);
 f.enter('contest_result');assert.equal(f.draw(1080)[0],f.images[layer.reactionAnimations.approving_nod.asset]);
});

test('slow-anger native provenance, derived timing, scene isolation and approved assets are preserved',()=>{
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const pilot=JSON.parse(readFileSync('assets_src/characters/tony_fridge/external_animation_v1/animation-pilot.json')).animations;
 const candidate=pilot.tony_slow_anger_seated_1,root='assets_src/characters/tony_fridge/external_animation_v1/';
 assert.ok(['runtime_review','runtime_approved'].includes(candidate.status));
 assert.equal(candidate.review.candidateStatus,candidate.status);
 if(candidate.status==='runtime_approved'){
  assert.equal(candidate.review.reviewer,'Svetozar');assert.equal(candidate.review.decision,'approved_for_runtime');
  assert.match(candidate.review.approvedAt,/^\d{4}-\d{2}-\d{2}$/);
 }
 assert.equal(candidate.source.transport,'ludo-rest-api');assert.equal(candidate.import.timingOrigin,'derived_uniform_from_api_total_duration');
 assert.equal(sha(root+candidate.source.preservedPngFile),candidate.source.preservedPngSha256);
 assert.equal(sha(root+candidate.source.nativeSourceFile),candidate.source.nativeSourceSha256);
 assert.equal(sha(candidate.import.runtime.asset),candidate.import.derivedOutputHashes[candidate.import.runtime.asset]);
 assert.deepEqual([anger.frameCount,anger.columns,anger.frameDurationMs,anger.loop],[36,6,109,false]);assert.deepEqual(anger.registrationBounds,layer.animation.contentBounds);
 assert.equal(dialogues['dialogue.tony_fridge'].nodes.challenge_deferred.reactionId,'slow_anger');
 assert.ok(imageAssetPaths(assetManifest.scenes[scene.id]).includes(candidate.import.runtime.asset));
 const election=chapter1.scenes.find(s=>s.id==='scene.chapter1.election_booth');assert.ok(election.foregroundLayers.every(l=>!l.reactionAnimations));
 for(const [name,hash] of [['seated-v1.png','b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8'],['idle-seated-v1.webp','1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e'],['talk-seated-v1.webp','9ad05841d2f274e9c66574dca99cf802a41207c7468b7db4bad4ed77436c3ac0'],['chuckle-seated-v1.webp','6d2fc49711cf9c62d33bf85576df2f3becd242614d9b3ecab2ceac6a40757092'],['skeptical-seated-v1.webp','26bac7a7fdf49c9a453070ef0ecb623207e33591da1b7af1bfbcc2e80d9219ed'],['approving-nod-seated-v1.webp','494a4d1af90d1a2a6b7fe3631f22dc0d6c74b0875ab3a5c363bb550df68ed362']])assert.equal(sha('assets/chapter1/characters/tony_fridge/'+name),hash);
});

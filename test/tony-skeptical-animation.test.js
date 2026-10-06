import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DialogueSystem} from '../src/engine/DialogueSystem.js';
import {Renderer} from '../src/engine/Renderer.js';
import {chapter1} from '../src/content/chapter1/index.js';
import {assetManifest} from '../src/content/art/assetManifest.js';
import {imageAssetPaths} from '../src/engine/AssetLoader.js';
const scene=chapter1.scenes.find(s=>s.id==='scene.chapter1.mehana');
const layer=scene.foregroundLayers.find(l=>l.id==='layer.mehana.tony_fridge_seated');
const dialogues=Object.fromEntries(chapter1.dialogues.map(d=>[d.id,d]));
const skeptical=layer.reactionAnimations.skeptical_glance;
function fixture(turned=true){
 const dialogue=new DialogueSystem(dialogues,null);
 const images=Object.fromEntries([skeptical.asset,layer.reactionAnimations.confident_chuckle.asset,layer.talkAnimation.asset,layer.animation.asset,layer.asset].map(a=>[a,{}]));
 const loaded=new Set(Object.values(images)),draws=[];
 const game={lastTime:0,dialogue,content:{dialogues},speech:0,npcSpeechAnimationTime(){return dialogue.current?this.speech:null;},assets:{getSceneImage:(_id,a)=>images[a],isLoaded:i=>loaded.has(i)}};
 const renderer=Object.assign(Object.create(Renderer.prototype),{ctx:{drawImage:(...a)=>draws.push(a)},game});
 const draw=(t,s=scene,l=layer)=>{game.lastTime=t;renderer.drawSceneRasterLayer(s,l);return draws.at(-1);};
 const enter=node=>dialogue.choose({next:node});
 dialogue.start('dialogue.tony_fridge');draw(0);if(turned)draw(1000);
 return {dialogue,images,loaded,game,renderer,draw,enter};
}
const frame=d=>Math.floor(d[2]/384)*5+Math.floor(d[1]/384);
test('waiting entry reacts once for all source frames; UI refresh keeps token, deliberate reentry is fresh',()=>{
 const f=fixture();f.enter('challenge_waiting');const entry=f.dialogue.entry;
 assert.equal(entry.reactionId,'skeptical_glance');
 for(let i=0;i<25;i++){const d=f.draw(1016+i*118);assert.equal(d[0],f.images[skeptical.asset]);assert.equal(frame(d),i);}
 let d=f.draw(3966);assert.equal(d[0],f.images[layer.talkAnimation.asset]);assert.ok(frame(d)>=4&&frame(d)<=21);
 f.dialogue.getNode();assert.equal(f.dialogue.entry,entry);assert.equal(f.draw(10000)[0],f.images[layer.talkAnimation.asset]);
 f.game.speech=null;assert.equal(frame(f.draw(10016)),4);
 f.enter('challenge_waiting');assert.notEqual(f.dialogue.entry,entry);assert.equal(frame(f.draw(10032)),0);
});
test('skepticism defers until initial left turn, preserves registration and returns only after close',()=>{
 const f=fixture(false);f.enter('challenge_waiting');assert.equal(f.draw(16)[0],f.images[layer.talkAnimation.asset]);
 const d=f.draw(748),scale=320 / 198;
 assert.equal(d[0],f.images[skeptical.asset]);assert.equal(frame(d),0);
 assert.deepEqual(d.slice(5),[877,296+5*scale,153*scale,192*scale]);
 f.dialogue.close();assert.equal(frame(f.draw(764)),22);assert.equal(f.draw(1325)[0],f.images[layer.animation.asset]);
 f.dialogue.start('dialogue.tony_fridge');assert.equal(frame(f.draw(1341)),0);f.game.speech=null;assert.equal(frame(f.draw(2341)),4);
});
test('pause/menu and skip cancel pending or active skepticism without delayed replay',()=>{
 const f=fixture();f.enter('challenge_waiting');f.draw(1016);assert.equal(frame(f.draw(1252)),2);
 for(const key of ['paused','menuOpen']){f.game[key]=true;assert.equal(frame(f.draw(10000)),2);f.game[key]=false;}
 assert.equal(frame(f.draw(10118)),3);
 f.enter('support_confirmed');assert.equal(f.draw(10134)[0],f.images[layer.talkAnimation.asset]);
 assert.equal(f.renderer.npcReactionPlayback.get(layer.id).phase,'idle');
 const pending=fixture(false);pending.enter('challenge_waiting');pending.draw(16);pending.dialogue.close();pending.draw(32);
 assert.notEqual(pending.draw(2000)[0],pending.images[skeptical.asset]);
});
test('chuckle and skeptical reactions switch on separate real entries without hijacking each other',()=>{
 const f=fixture();f.enter('challenge_accepted');assert.equal(f.draw(1016)[0],f.images[layer.reactionAnimations.confident_chuckle.asset]);
 f.enter('challenge_waiting');assert.equal(f.draw(1032)[0],f.images[skeptical.asset]);
 f.enter('challenge_accepted');assert.equal(f.draw(1048)[0],f.images[layer.reactionAnimations.confident_chuckle.asset]);
 const resumed=f.draw(3848);assert.equal(resumed[0],f.images[layer.talkAnimation.asset]);assert.ok(frame(resumed)>=4&&frame(resumed)<=21);
 assert.equal(f.draw(3864)[0],f.images[layer.talkAnimation.asset]);
});
test('scene reset and unavailable asset consume skepticism without replay after return/load',()=>{
 const f=fixture();f.enter('challenge_waiting');f.draw(1016);
 f.draw(1032,{id:'other'},{...layer,talkAnimation:undefined,reactionAnimations:undefined});
 f.draw(1048);assert.equal(f.draw(2048)[0],f.images[layer.talkAnimation.asset]);
 f.enter('challenge_waiting');f.loaded.delete(f.images[skeptical.asset]);assert.equal(f.draw(2064)[0],f.images[layer.talkAnimation.asset]);
 f.loaded.add(f.images[skeptical.asset]);assert.equal(f.draw(2080)[0],f.images[layer.talkAnimation.asset]);
 f.loaded.delete(f.images[layer.talkAnimation.asset]);assert.equal(f.draw(2096)[0],f.images[layer.animation.asset]);
 f.loaded.delete(f.images[layer.animation.asset]);assert.equal(f.draw(2112)[0],f.images[layer.asset]);
});
test('skeptical import matches source timing and hash; original dialogues/effects/assets and election stay intact',()=>{
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const pilot=JSON.parse(readFileSync('assets_src/characters/tony_fridge/external_animation_v1/animation-pilot.json')).animations;
 const candidate=pilot.tony_skeptical_seated_1;
 assert.equal(sha('assets_src/characters/tony_fridge/external_animation_v1/'+candidate.source.storedFilename),candidate.source.sourceZipSha256);
 assert.equal(sha(candidate.import.runtime.asset),candidate.import.derivedOutputHashes[candidate.import.runtime.asset]);
 assert.equal(skeptical.frameCount,25);assert.equal(skeptical.frameDurationMs,118);assert.equal(skeptical.loop,false);
 assert.deepEqual(skeptical.registrationBounds,layer.animation.contentBounds);
 assert.deepEqual([layer.left,layer.top,layer.height,layer.zIndex],[877,296,320,35]);
 assert.equal(dialogues['dialogue.tony_fridge'].nodes.challenge_waiting.choicesFrom,'start');
 assert.equal(dialogues['dialogue.tony_fridge'].nodes.challenge_waiting.effect,undefined);
 assert.equal(dialogues['dialogue.tony_fridge'].nodes.challenge_accepted.reactionId,'confident_chuckle');
 assert.ok(imageAssetPaths(assetManifest.scenes[scene.id]).includes(candidate.import.runtime.asset));
 const election=chapter1.scenes.find(s=>s.id==='scene.chapter1.election_booth');
 assert.ok(election.foregroundLayers.every(l=>!l.reactionAnimations));assert.equal(assetManifest.scenes[election.id].tonyFridgeSkepticalSeated,undefined);
 for(const [name,hash] of [['seated-v1.png','b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8'],['idle-seated-v1.webp','1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e'],['talk-seated-v1.webp','9ad05841d2f274e9c66574dca99cf802a41207c7468b7db4bad4ed77436c3ac0'],['chuckle-seated-v1.webp','6d2fc49711cf9c62d33bf85576df2f3becd242614d9b3ecab2ceac6a40757092']])assert.equal(sha('assets/chapter1/characters/tony_fridge/'+name),hash);
 for(const id of ['tony_idle_seated_1','tony_talk_seated_1','tony_chuckle_seated_1'])assert.equal(pilot[id].status,'runtime_approved');
});

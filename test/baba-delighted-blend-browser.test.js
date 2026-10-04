import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {browserAvailable} from './helpers/browser-availability.js';

test('Baba blends preserve opacity and lock lower body while the cane stays animated', {timeout:60000}, async t=>{
 if(!browserAvailable(t,chromium.executablePath()))return;
 const port=await new Promise((resolve,reject)=>{const probe=createServer();probe.once('error',reject);probe.listen(0,'127.0.0.1',()=>{const p=probe.address().port;probe.close(()=>resolve(p));});});
 const origin=`http://127.0.0.1:${port}`;
 const server=spawn(process.execPath,['tools/dev-server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port)},stdio:'ignore'});
 let browser;
 try{
  let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(origin)).ok;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
  browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto(origin);
  const result=await page.evaluate(async()=>{
   const{Renderer}=await import('/src/engine/Renderer.js');
   const make=color=>{const c=document.createElement('canvas');c.width=2;c.height=2;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,2,2);return c;};
   const canvas=make('white'),renderer=Object.assign(Object.create(Renderer.prototype),{canvas,ctx:canvas.getContext('2d')});
   const layer={id:'test.blend',left:0,top:0,height:2};const animation={frameWidth:2,frameHeight:2,columns:1};
   const samples=[{animation,image:make('red'),frameIndex:0,weight:.5},{animation,image:make('blue'),frameIndex:0,weight:.5}];
   const applied=renderer.drawSceneAnimationSamples(layer,samples),first=[...renderer.ctx.getImageData(0,0,1,1).data];
   const buffer=renderer.sceneAnimationBlendBuffers.get(layer.id);
   renderer.drawSceneAnimationSamples(layer,[{animation,image:make('lime'),frameIndex:0,weight:1}]);
   const second=[...renderer.ctx.getImageData(0,0,1,1).data];
   const transparent=make('rgba(0,0,0,0)');
   renderer.ctx.clearRect(0,0,2,2);renderer.drawSceneAnimationSamples(layer,[{animation,image:transparent,frameIndex:0,weight:1}]);
   return{applied,first,second,transparent:[...renderer.ctx.getImageData(0,0,1,1).data],reused:buffer===renderer.sceneAnimationBlendBuffers.get(layer.id),composition:renderer.ctx.globalCompositeOperation,alpha:renderer.ctx.globalAlpha};
  });
  assert.equal(result.applied,true);assert.ok(Math.abs(result.first[0]-128)<=1);assert.ok(Math.abs(result.first[2]-128)<=1);assert.equal(result.first[1],0);assert.equal(result.first[3],255);
  assert.deepEqual(result.second,[0,255,0,255]);assert.deepEqual(result.transparent,[0,0,0,0]);assert.equal(result.reused,true);assert.equal(result.composition,'source-over');assert.equal(result.alpha,1);
  await page.goto(origin+'/?play=1&testHarness=1');await page.evaluate(()=>window.__comradeCandidateTest.ready);
  const lock=await page.evaluate(async()=>{
   const{game}=window.__comradeCandidateTest;await game.changeScene('scene.chapter1.village_square');
   const{Renderer}=await import('/src/engine/Renderer.js'),{DialogueSystem}=await import('/src/engine/DialogueSystem.js');
   const scene=game.currentScene,layer=scene.foregroundLayers.find(l=>l.id==='layer.square.baba_stoyanka_seated'),a=layer.reactionAnimations.delighted_approval;
   const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;const ctx=canvas.getContext('2d');
   const dialogue=new DialogueSystem(game.content.dialogues,null,()=>{}),fixture={assets:game.assets,content:game.content,dialogue,lastTime:0,npcSpeechAnimationTime(){return dialogue.current?0:null;}};
   const renderer=new Renderer(canvas,fixture),draw=time=>{ctx.clearRect(0,0,1280,720);fixture.lastTime=time;renderer.drawSceneRasterLayer(scene,layer);return ctx.getImageData(324,330,78,124).data;};
   const base=draw(0);let lowerMax=0,caneMax=0,upperMax=0,count=0;
   const check=time=>{const pixels=draw(time);count++;for(let y=0;y<124;y++)for(let x=0;x<78;x++){
    const localX=x-1+.5,localY=y+.5,n=(y*78+x)*4;
    // Exclude only the cane cutout and its antialiased boundary. All other
    // pixels below the waist, including shoes and bag, must match exactly.
    const caneLeft=43.5+8*(localY-56)/63;
    const cane=localY>=54.5&&localY<=120.5&&localX>=caneLeft-1.5&&localX<=caneLeft+5.5;
    for(let k=0;k<4;k++){const delta=Math.abs(pixels[n+k]-base[n+k]);if(localY>=60&&!cane)lowerMax=Math.max(lowerMax,delta);if(cane&&localY>=65)caneMax=Math.max(caneMax,delta);if(localY<50)upperMax=Math.max(upperMax,delta);}
   }};
   for(let i=0;i<25;i++)check(i*198);
   dialogue.start('dialogue.baba_stoyanka');for(let i=0;i<25;i++)check(i*190);
   dialogue.choose({next:'vote_confirmed'});check(5000);for(let i=0;i<36;i++)check(5000+(i+.5)*a.frameDurationMs);
   check(5000+36*a.frameDurationMs+1);dialogue.close();check(8000);
   return{lowerMax,caneMax,upperMax,count,configuration:layer.stationaryLowerBody};
  });
  assert.equal(lock.lowerMax,0,'lower body, feet and bag must be pixel-identical throughout idle/talk/reaction and handoffs');
  assert.ok(lock.caneMax>0,'lower cane must remain animated');assert.ok(lock.upperMax>0,'upper gesture must remain animated');assert.ok(lock.count>=89);
  mkdirSync('target/ludo-review/baba-delighted',{recursive:true});
  writeFileSync('target/ludo-review/baba-delighted/lower-body-pixel-verification.json',JSON.stringify({...lock,verified:true,browser:'Chromium',note:'Actual loaded sprites rendered through Renderer; all RGBA channels below waist outside cane cutout tested across idle/talk/reaction and handoffs.'},null,2));
 }finally{await browser?.close();if(server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}}
});

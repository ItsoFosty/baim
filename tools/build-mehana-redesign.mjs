import fs from 'node:fs';
import sharp from 'sharp';
const src='assets_src/chapter1/scenes/mehana/redesign-v1';
const out='assets/chapter1/scenes/mehana';
const spec=JSON.parse(fs.readFileSync(src+'/manual-masks-v1.json'));
const size={width:1280,height:720};
const original=await sharp(src+'/accepted-room-v13.png').resize(size.width,size.height,{fit:'fill'}).ensureAlpha().png().toBuffer();
const mask=async(path,canvas=spec.canvas)=>sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">${(Array.isArray(path)?path:[path]).map(d=>`<path fill="white" fill-rule="evenodd" d="${d}"/>`).join('')}</svg>`)).resize(size.width,size.height,{fit:'fill'}).png().toBuffer();
const clip=async(source,path,canvas)=>sharp(source).composite([{input:await mask(path,canvas),blend:'dest-in'}]).png().toBuffer();
// Keep the approved continuous static furniture/floor painting. The clean plate
// remains retained for future movable-furniture authoring; guessed leg masks
// must never expose mismatched floor. Foregrounds still provide actor occlusion.
await sharp(original).png().toFile(out+'/background-redesign-v1.png');
for(const [key,name] of [['left','table-group-left-redesign-v1'],['right','table-group-right-redesign-v1'],['rearChair','rear-chairs-redesign-v1'],['counter','counter-front-redesign-v1']]){
 fs.writeFileSync(out+'/'+name+'.png',await clip(original,spec[key]));
}
const old=await sharp(out+'/background.png').ensureAlpha().png().toBuffer();
fs.writeFileSync(out+'/cellar-hatch-preserved-v1.png',await clip(old,spec.hatch,size));
// The room omits fully opaque counter pixels. Its original one-pixel antialiased
// boundary remains as edge padding; composed output is unchanged. No unseen aisle
// painting or moved counter is invented. The always-present foreground restores it.
const roomPixels = await sharp(out+'/background-redesign-v1.png').ensureAlpha().raw().toBuffer();
const counterPixels = await sharp(out+'/counter-front-redesign-v1.png').ensureAlpha().raw().toBuffer();
let separatedCounterPixels=0;
for(let i=3;i<roomPixels.length;i+=4){if(counterPixels[i]===255){roomPixels[i]=0;separatedCounterPixels++;}}
await sharp(roomPixels,{raw:{...size,channels:4}}).png().toFile(out+'/background-redesign-v1.png');
console.log(JSON.stringify({separatedCounterPixels}));
console.log('Built draft mehana layers from retained sources and manual masks; original runtime assets preserved.');

import fs from 'node:fs';
import path from 'node:path';
import {HEAD_OUTLINE,STICKER_BORDER} from '../src/data/portraitGeometry.js';
const root=path.resolve('public/portrait/batch-v2');
const image=file=>'data:image/png;base64,'+fs.readFileSync(file).toString('base64');
const tear=image('public/portrait/stickers/torn-head-registered-v2.png');
for(const direction of ['center','n','ne','e','se','s','sw','w','nw']){
const photo=image(path.join(root,direction+'.png'));
for(const torn of [false,true]){
const defs=`<filter id="border" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="${STICKER_BORDER}" result="grown"/><feFlood flood-color="#fff9ee"/><feComposite in2="grown" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><mask id="jaw"><path d="${HEAD_OUTLINE}" fill="white"/></mask><mask id="tear" mask-type="alpha"><image href="${tear}" width="1080" height="1457"/></mask>`;
const content=`<image href="${photo}" width="1080" height="1457" preserveAspectRatio="none" ${torn?'mask="url(#tear)"':''}/>`;
fs.writeFileSync(path.join(root,torn?'torn':'full',direction+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1457" viewBox="0 0 1080 1457"><defs>${defs}</defs><g filter="url(#border)"><g mask="url(#jaw)">${content}</g></g></svg>`);
}
}
console.log('Packaged 9 complete and 9 torn stickers with one shared outline and tear mask.');

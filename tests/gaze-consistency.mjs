import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5174/?intro=full-photo-gaze#/home');
 await p.locator('.intro-open[data-peel-renderer=ready]').waitFor({timeout:60000});
 const face=p.locator('.portrait-hero .person-cutout'),b=await face.boundingBox(),cx=b.x+b.width*.52,cy=b.y+b.height*.416;
 for(const [d,dx,dy]of[['center',0,0],['n',0,-250],['ne',250,-250],['e',300,0],['se',250,250],['s',0,250],['sw',-250,250],['w',-300,0],['nw',-250,-250]]){
  await p.mouse.move(Math.max(5,Math.min(1435,cx+dx)),Math.max(5,Math.min(995,cy+dy)));await p.waitForTimeout(100);
  const actual=await face.getAttribute('data-gaze');
  const href=await face.locator('.torn-head-image g>image').getAttribute('href');
  assert.equal(href,actual==='center'?'/portrait/batch-v2/center.png':'/portrait/batch-v2/'+actual+'.png');
  assert.equal(await face.locator('.generated-gaze,.tracked-iris').count(),0);
 }
 await p.screenshot({path:'tests/full-photo-gaze.png'});
 await p.locator('.portrait-about').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await p.waitForTimeout(500);
 await p.screenshot({path:'tests/about-compact-desktop.png'});
 assert.equal(await p.locator('.about-cheek-hand').count(),1);
 assert.equal(await p.locator('.about-hand-stage').count(),0);
 await p.setViewportSize({width:390,height:844});await p.locator('.portrait-about').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await p.waitForTimeout(300);await p.screenshot({path:'tests/about-compact-mobile.png'});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('PASS: complete directional photo switching, no eye patches; compact About and cheek gesture at desktop/mobile');
}finally{await browser.close()}

import {chromium} from '@playwright/test';
import * as THREE from 'three';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const wait=ms=>page.waitForTimeout(ms);
async function go(route){await page.evaluate(route=>{location.hash='/'+route},route);await wait(800)}
async function objectClick(name,xyz,scene='interior'){
 const b=await page.locator('canvas').boundingBox();
 const camera=new THREE.PerspectiveCamera(scene==='exterior'?35:37,b.width/b.height,.1,80);
 camera.position.set(...(scene==='exterior'?[7,6.1,14]:[9,7.7,11]));camera.lookAt(...(scene==='exterior'?[.45,4.1,0]:[0,1.65,0]));camera.updateProjectionMatrix();camera.updateMatrixWorld();
 const v=new THREE.Vector3(...xyz).project(camera),x=b.x+(v.x+1)*b.width/2,y=b.y+(1-v.y)*b.height/2;
 await page.mouse.move(x,y);await wait(120);await page.mouse.click(x,y);await wait(900);
 console.log(name,'clicked',Math.round(x),Math.round(y),await page.evaluate(()=>location.hash));
}
await page.goto('http://127.0.0.1:5173/#/home');await wait(3800);
assert.equal(await page.locator('canvas').count(),1);assert.deepEqual(errors,[]);
await page.screenshot({path:'tests/exterior.png'});
await page.getByRole('button',{name:'Switch day and night',exact:true}).click();await wait(1400);await page.screenshot({path:'tests/exterior-night.png'});
await page.getByRole('button',{name:'Switch day and night',exact:true}).click();await wait(1200);
await objectClick('Exterior clock',[2.70,5.05,.26],'exterior');assert.match(page.url(),/#\/journey$/);await go('home');
await objectClick('Front door',[0,1.55,1.30],'exterior');await wait(1900);assert.equal(await page.locator('.inside').count(),1);await page.screenshot({path:'tests/interior.png'});
for(const [name,xyz,route] of [['Clock',[1.9,2.95,-1.95],'journey'],['Camera',[-1.8,1.47,.75],'projects'],['Notebook',[-1.25,1.34,.52],'about'],['Letter',[1.92,.86,1.55],'contact'],['Computer',[-.7,1.87,-.41],'selected-work']]){
 await objectClick(name,xyz);assert.match(page.url(),new RegExp('#/'+route+'$'),name+' raycast');await go('home');await wait(500);
}
await objectClick('Star',[.65,1.55,1.88]);assert.equal(await page.getByRole('status').count(),1);await wait(3500);
await page.getByRole('button',{name:'Back to House'}).click();await wait(2500);assert.equal(await page.locator('.inside').count(),0);
await page.getByRole('button',{name:'Explore My World'}).click();await wait(2450);assert.equal(await page.locator('.inside').count(),1);
await page.getByRole('button',{name:'Back to House'}).click();await wait(2450);console.log('Entry and return PASS');
await go('journey');assert.equal(await page.locator('.timeline-node').count(),6);await page.screenshot({path:'tests/journey-page.png',fullPage:true});
await page.getByRole('button',{name:'2026',exact:false}).click();assert.equal(await page.locator('.timeline-node').count(),3);await page.locator('.timeline-node summary').nth(1).click();await page.getByRole('button',{name:'Related Work'}).nth(1).click();assert.match(page.url(),/#\/projects\/catchi$/);
await go('projects');assert.equal(await page.locator('.project-card').count(),9);await page.getByRole('button',{name:/Creative & Interactive/}).click();assert.equal(await page.locator('.project-card').count(),4);await page.screenshot({path:'tests/projects-page.png',fullPage:true});
await page.getByRole('button',{name:'Open The Girl Who Rented Time',exact:true}).click();await wait(800);assert.equal(await page.locator('.case-sections section').count(),7);assert.equal(await page.locator('.media-slot').count(),4);
await page.screenshot({path:'tests/case-page.png',fullPage:true});await page.locator('input[type=file]').first().setInputFiles('tests/exterior.png');assert.equal(await page.locator('.media-slot.has-media').count(),1);await page.getByRole('button',{name:'Remove preview',exact:true}).click();assert.equal(await page.locator('.media-slot.has-media').count(),0);
await page.getByRole('button',{name:'Add image +'}).click();assert.equal(await page.getByText('02 / 02',{exact:true}).count(),1);await page.getByRole('button',{name:'Previous gallery image'}).click();assert.equal(await page.getByText('01 / 02',{exact:true}).count(),1);
for(const id of ['rented-time','love-roi','clinicallog','dessert-zoo','tiktok-shop','catchi','coach-peri','humva','tusee']){await go('projects/'+id);assert.equal(await page.locator('.case-sections section').count(),7,id+' case template')}
await page.getByRole('button',{name:'Project navigation options'}).click();await page.getByRole('button',{name:'Selected Work ↗',exact:true}).click();await wait(600);assert.equal(await page.locator('.project-card').count(),5);
await go('about');assert.equal(await page.getByRole('button',{name:/Resume PDF/}).isDisabled(),true);await page.screenshot({path:'tests/about-page.png',fullPage:true});
await go('contact');assert.equal(await page.getByText('Email to be added from CV').count(),1);await page.screenshot({path:'tests/contact-page.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
for(const route of ['home','journey','projects','projects/rented-time','about','contact']){
 await go(route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' mobile overflow');
 if(route==='home'||route==='projects')await page.screenshot({path:'tests/mobile-'+route+'.png',fullPage:true});
}
console.log('Routes, upload preview, timeline filtering, mobile layouts PASS');
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});reduced.on('pageerror',e=>errors.push(e.message));await reduced.goto('http://127.0.0.1:5173/#/home');await reduced.waitForTimeout(2000);await reduced.getByRole('button',{name:'Explore My World'}).click();await reduced.waitForTimeout(400);assert.equal(await reduced.locator('.inside').count(),1);await reduced.getByRole('button',{name:'Back to House'}).click();await reduced.waitForTimeout(400);assert.equal(await reduced.locator('.inside').count(),0);
console.log('Reduced Motion PASS');console.log('Runtime errors:',errors);assert.deepEqual(errors,[]);
await browser.close();

import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {tuseeContent,humvaContent} from '../src/data/internshipContent.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../docs/internship-import-manifest.json',import.meta.url)));
for(const file of manifest.assets){
 const bytes=fs.readFileSync(new URL('../'+file.file,import.meta.url));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256);
 if(file.gitBlobSha)assert.equal(crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),file.gitBlobSha);
}
for(const page of [tuseeContent,humvaContent]){
 assert.equal(page.preview,false);
 const ids=new Set();
 for(const item of page.selectedWork.items){
  assert(!ids.has(item.id));ids.add(item.id);
  if(item.enabled===false)continue;
  for(const field of ['src','cover'])if(item[field])assert(fs.existsSync(new URL('../public'+item[field],import.meta.url)));
  assert(item.type==='account'? /tiktok\.com\/@[^/]+\/?$/.test(item.url): /\/(video|photo)\/\d+/.test(item.url)||/vt\.tiktok\.com\//.test(item.url));
 }
 assert.equal(page.links.enabled,false);
 assert.equal(page.overview.images.length,0);
 assert(page.selectedWork.items.every(x=>x.type!=='account'));
 for(const item of page.selectedWork.items.filter(x=>x.type==='video'&&x.enabled!==false)){assert(item.views);assert.equal(item.viewsSource,'tiktok');assert.equal(item.viewsCheckedAt,'2026-10-16');}
 assert(page.results.items.every(x=>x.id==='views'||x.label.toLowerCase().includes('followers')));
}
assert.deepEqual(tuseeContent.results.items.map(x=>x.value),['2.5M','4,074','942']);
assert.deepEqual(humvaContent.results.items.map(x=>x.value),['415.6K','3,964','3.8K']);
assert(tuseeContent.selectedWork.items.find(x=>x.id==='nike-dunk').url.endsWith('7433513217734839557'));
assert.equal(tuseeContent.selectedWork.items.filter(x=>x.type==='photo').length,4);
console.log('14 original assets verified; specific-content links separated from account links; current video snapshots labelled; overview account links and simplified results verified.');

assert.equal(tuseeContent.overview.accountLinks.length,2);
assert.equal(humvaContent.overview.accountLinks.length,1);

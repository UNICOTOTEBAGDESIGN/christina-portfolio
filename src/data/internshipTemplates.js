import {coachContent} from './coachContent';
import {catchiContent} from './catchiContent';
import {bytedanceContent} from './bytedanceContent';
import {tuseeContent,humvaContent} from './internshipContent';
// Template-only presentation data. Original CV / project records stay in portfolio.js.
// Remove array entries to remove cards; set a section to null or { enabled:false } to hide it.
// Set preview:false when publishing real content: empty entries then disappear automatically.
const media=(id,type,title)=>({id,type,title,src:null,cover:null,url:null,views:null,accountName:null,caption:null,placeholder:true});
const create=(company,product,experienceId,work)=>({
 company,product,experienceId,preview:true,
 overview:{enabled:true,companyIntro:null,responsibilityIntro:null,placeholder:true,images:[media('overview-1','image','Product / company image 01'),media('overview-2','image','Product / company image 02')]},
 contributions:{enabled:true,items:[1,2,3].map(n=>({id:`contribution-${n}`,title:`Contribution 0${n}`,body:null,placeholder:true}))},
 selectedWork:{enabled:true,intro:null,items:work},
 results:{enabled:true,note:null,items:[1,2,3].map(n=>({id:`result-${n}`,value:null,label:`Key result 0${n}`,detail:null,placeholder:true}))},
 // Each URL is independent. Empty URLs never produce a button.
 links:{enabled:true,items:[{id:'product',label:'Product Website',url:null},{id:'tiktok',label:'TikTok Account',url:null},{id:'instagram',label:'Instagram Account',url:null},{id:'video',label:'Featured Video',url:null},{id:'demo',label:'Live Project / Demo',url:null}]}
});
export const internshipTemplates={
 'coach-peri':coachContent,
 catchi:catchiContent,
 'tiktok-shop':bytedanceContent,
 humva:humvaContent,
 tusee:tuseeContent
};
export const hasText=value=>typeof value==='string'&&value.trim().length>0;
export const usableLink=value=>hasText(value)&&/^https?:\/\//i.test(value);
export function visibleItems(section,preview,hasContent){return section&&section.enabled!==false?(section.items||[]).filter(item=>item.enabled!==false&&(hasContent(item)||(preview&&item.placeholder))):[];}

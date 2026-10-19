export const PORTRAIT_DIRECTIONS=['n','ne','e','se','s','sw','w','nw'];
export const PORTRAIT_ROOT='/portrait/whole-v11';
export const portraitDirection=d=>d==='center'||PORTRAIT_DIRECTIONS.includes(d)?d:'center';
export const portraitAsset=(d,torn=false)=>`${PORTRAIT_ROOT}/${torn?'torn':'full'}/${portraitDirection(d)}.svg?revision=whole-v11`;
export const SURPRISE_PORTRAIT=PORTRAIT_ROOT+'/full/surprise.svg?revision=whole-v11';

export const SURPRISE_TORN_PORTRAIT=PORTRAIT_ROOT+'/torn/surprise.svg?revision=whole-v11';

let preload;
export function preloadPortraitBatch(){
 if(!preload)preload=Promise.all([portraitAsset('center'),portraitAsset('center',true),...PORTRAIT_DIRECTIONS.flatMap(d=>[portraitAsset(d),portraitAsset(d,true)]),SURPRISE_PORTRAIT,SURPRISE_TORN_PORTRAIT].map(src=>{const image=new Image();image.src=src;return image.decode()}));
 return preload;
}

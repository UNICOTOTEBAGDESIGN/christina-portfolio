import React,{useState} from 'react';
import {MediaSlot} from './MediaSlot';
export function ProjectMediaGallery({project,uploads,onUpload}){
 const prefix=project.id+'-gallery-';
 const existing=Object.keys(uploads||{}).filter(k=>k.startsWith(prefix)).map(k=>Number(k.slice(prefix.length))+1);
 const [count,setCount]=useState(()=>Math.max(1,project.gallery.length,...existing)),[index,setIndex]=useState(0);
 return <div className="project-media-gallery"><div className="gallery-navigation"><span>IMAGE GALLERY <small>{String(index+1).padStart(2,'0')} / {String(count).padStart(2,'0')}</small></span><div><button aria-label="Previous gallery image" disabled={count<2} onClick={()=>setIndex(i=>(i-1+count)%count)}>←</button><button aria-label="Next gallery image" disabled={count<2} onClick={()=>setIndex(i=>(i+1)%count)}>→</button><button onClick={()=>{setCount(v=>v+1);setIndex(count)}}>Add image +</button></div></div><div key={index} className="gallery-frame"><MediaSlot label={'Image Gallery — '+String(index+1).padStart(2,'0')} src={project.gallery[index]} assetKey={prefix+index} uploads={uploads} onUpload={onUpload}/></div></div>;
}

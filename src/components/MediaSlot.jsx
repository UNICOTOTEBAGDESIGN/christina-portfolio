import React,{useEffect,useRef,useState} from 'react';
// Optional assets are local previews only. Never synthesize project evidence.
export function MediaSlot({label='Cover Image',src=null,kind='image',compact=false,uploads,onUpload,assetKey,poster=null}){
 const input=useRef(),[error,setError]=useState('');
 const isLocal=!!uploads?.[assetKey],current=uploads?.[assetKey]||src;
 const receive=e=>{const file=e.target.files?.[0];if(!file)return;const allowed=kind==='video'?file.type.startsWith('video/'):file.type.startsWith('image/');if(!allowed){setError(`Please choose ${kind==='video'?'a video':'an image'} file.`);return}if(file.size>100*1024*1024){setError('Please choose a file smaller than 100 MB.');return}setError('');onUpload?.(assetKey,URL.createObjectURL(file));e.target.value=''};
 return <div className={'media-slot '+(compact?'compact':'')+((current||poster)?' has-media':'')}>
  {current?(kind==='video'?<video src={current} poster={poster||undefined} controls preload="metadata"/>:<img src={current} alt={label} loading="lazy"/>):(kind==='video'&&poster)?<img src={poster} alt={`${label} cover`} loading="lazy"/>:<div className="media-placeholder"><span className="media-corners"/><span className="media-label">{label}</span><small>Media to be added</small></div>}
  <div className="media-actions"><span>{isLocal?'Local preview · not saved':(current||poster)?'PROJECT ASSET':'ASSET PENDING'}</span><div className="upload-buttons">{isLocal&&<button onClick={()=>onUpload?.(assetKey,null)}>Remove preview</button>}<button onClick={()=>input.current?.click()}>{current?'Replace':'Upload / Replace'} <span>↗</span></button></div></div>
  <input hidden type="file" ref={input} accept={kind==='video'?'video/mp4,video/webm':'image/*'} onChange={receive} aria-label={`Upload ${label}`}/>
  {error&&<p className="field-error" role="alert">{error}</p>}
 </div>;
}

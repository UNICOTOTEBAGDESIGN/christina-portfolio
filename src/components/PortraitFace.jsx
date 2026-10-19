import React,{useEffect,useState} from 'react';
import{portraitAsset,SURPRISE_PORTRAIT,SURPRISE_TORN_PORTRAIT,preloadPortraitBatch}from'../data/portraitAssets';
export function PortraitFace({openMouth=false,gaze='center',torn=false}){
 const [ready,setReady]=useState(false);
 const source=openMouth?(torn?SURPRISE_TORN_PORTRAIT:SURPRISE_PORTRAIT):portraitAsset(gaze,torn);
 useEffect(()=>{let alive=true;preloadPortraitBatch().then(()=>{if(alive)setReady(true)}).catch(()=>{});return()=>alive=false},[]);
 return <span className={'person-cutout expression-'+(openMouth?'surprised':'neutral')} data-torn={torn} data-gaze={gaze} data-gaze-ready={ready} data-expression={openMouth?'surprised':'neutral'}>
  <img className="portrait-frame-photo" src={source} alt="Christina Huang" draggable="false"/>
 </span>;
}

import React,{useEffect} from 'react';
export function SceneTransitions({phase,reduce,onSwap,onComplete}){
  useEffect(()=>{
    if(phase==='idle')return;
    const duration=reduce?100:2200;
    const a=setTimeout(onSwap,duration*.5), b=setTimeout(onComplete,duration);
    return()=>{clearTimeout(a);clearTimeout(b)};
  },[phase,reduce,onSwap,onComplete]);
  return <div aria-hidden="true" className={'portal-veil '+(phase!=='idle'?'transitioning':'')} style={{animationDuration:reduce?'.1s':'2.2s'}}/>;
}

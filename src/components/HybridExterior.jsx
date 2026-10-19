import React,{useEffect,useRef,useState} from 'react';
export default function HybridExterior({onEnter,onOpen,onStar,night,reduce,phase}){
 const stage=useRef(),zoom=useRef(1),[door,setDoor]=useState(false),[hello,setHello]=useState(false);
 useEffect(()=>{const node=stage.current;const wheel=e=>{e.preventDefault();zoom.current=Math.max(.90,Math.min(1.20,zoom.current-e.deltaY*.0006));node.style.setProperty('--zoom',zoom.current)};node.addEventListener('wheel',wheel,{passive:false});return()=>node.removeEventListener('wheel',wheel)},[]);
 useEffect(()=>{const reset=()=>{zoom.current=1;stage.current?.style.setProperty('--zoom',1)};window.addEventListener('resize',reset);return()=>window.removeEventListener('resize',reset)},[]);
 const move=e=>{if(reduce||!stage.current)return;const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;stage.current.style.setProperty('--rx',`${-y*5}deg`);stage.current.style.setProperty('--ry',`${x*7}deg`);stage.current.style.setProperty('--mx',`${x*8}px`)};
 const leave=()=>{if(!stage.current)return;for(const k of ['--rx','--ry'])stage.current.style.setProperty(k,'0deg');stage.current.style.setProperty('--mx','0px')};
 const greet=()=>{onStar();setHello(true);setTimeout(()=>setHello(false),1200)};
 return <div className={'hybrid-exterior '+(night?'art-night ':'')+(hello?'star-hello':'')} onPointerMove={move} onPointerLeave={leave}>
  <div className={'hybrid-stage '+(door||phase==='entering'?'door-open':'')} ref={stage}>
   <img className="house-art" src="/art/cottage-exterior-v1.png" alt="A tiny lavender-roofed artist’s cottage, with a warm balcony studio, climbing flowers and a plush yellow star." draggable="false"/>
   <img className="star-patch" src="/art/cottage-exterior-v1.png" alt="" aria-hidden="true" draggable="false"/><div className="door-aperture" aria-hidden="true"/><div className="door-leaf" aria-hidden="true"><img src="/art/cottage-exterior-v1.png" draggable="false" alt=""/></div>
   <button className="art-hotspot door-hotspot" aria-label="Open the front door and enter the studio" onPointerEnter={()=>setDoor(true)} onPointerLeave={()=>setDoor(false)} onFocus={()=>setDoor(true)} onBlur={()=>setDoor(false)} onClick={onEnter}><span>Come inside ↗</span></button>
   <button className="art-hotspot watch-hotspot" aria-label="Pocket watch · Journey" onClick={()=>onOpen('journey')}><span>A little journey ↗</span></button>
   <button className="art-hotspot star-hotspot" aria-label="Fluffy Star · say hello" onClick={greet}><span>A little hello ✧</span></button>
   <span className="window-breath" aria-hidden="true"/>
  </div>
  <p className="art-instructions">Move to explore · Scroll to look closer</p>
 </div>
}

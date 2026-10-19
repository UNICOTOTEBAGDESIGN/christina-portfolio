import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
const entries=[['home','Home','Back to the little house'],['about','About','Meet the person behind the stories'],['journey','Journey','A few chapters along the way'],['projects','Projects','Ideas that became something'],['contact','Say hello','A new story starts with a hello']];
export function UniverseMenu({navigate}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(0),button=useRef(),dialog=useRef();
 useEffect(()=>{if(!open)return;const before=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.querySelector('button')?.focus();return()=>{document.body.style.overflow=before;button.current?.focus()}},[open]);
 const close=()=>setOpen(false);
 const key=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const all=dialog.current.querySelectorAll('button,a'),first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
 return <><button ref={button} className="universe-menu-toggle" aria-label="Open universe menu" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><i/><i/></button>{open&&createPortal(<div className="universe-menu" role="dialog" aria-modal="true" aria-label="Explore Christina’s universe" ref={dialog} onKeyDown={key}>
  <div className="menu-topline"><span>CHRISTINA'S LITTLE UNIVERSE</span><button aria-label="Close universe menu" onClick={close}>×</button></div>
  <div className="menu-art"><span className="menu-speech">{entries[active][2]}</span><img src="/art/cottage-exterior-v1.png" alt="The little house with Fluffy Star on its balcony"/><span className="menu-handwriting">a little curious, always.</span></div>
  <nav aria-label="Explore the universe">{entries.map(([route,label],i)=><button key={route} onPointerEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>{close();navigate(route)}}><small>0{i+1}</small><span>{label}</span><i aria-hidden="true">↗</i></button>)}</nav><span className="menu-bottomline">Every little thing has a story. Yours is welcome here.</span>
 </div>,document.body)}</>;
}

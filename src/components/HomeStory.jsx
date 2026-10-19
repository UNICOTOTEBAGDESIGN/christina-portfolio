import React,{useEffect,useRef} from 'react';
import {projects} from '../data/portfolio';
import {MediaSlot} from './MediaSlot';
export function HomeStory({navigate,uploads,onUpload}){
 const root=useRef();
 useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.15});root.current.querySelectorAll('[data-scroll-reveal]').forEach(n=>observer.observe(n));return()=>observer.disconnect()},[]);
 return <div className="home-story" ref={root}>
  <section className="story-manifesto" data-scroll-reveal><span className="story-section-label">01 / A LITTLE ABOUT MY WORLD</span><p>I turn ideas into <em>stories.</em><br/>And stories into<br/><span>experiences.</span></p><div className="manifesto-foot"><span>A little curious. A little dreamy.<br/>Always creating.</span><button onClick={()=>navigate('about')}>Meet Christina <i>↗</i></button></div><span className="paper-star" aria-hidden="true">✧</span></section>
  <section className="story-selected" data-scroll-reveal><div className="story-section-top"><div><span className="story-section-label">02 / THINGS I'VE BEEN MAKING</span><h2>Small ideas.<br/><em>New possibilities.</em></h2></div><button onClick={()=>navigate('projects')}>Explore all projects ↗</button></div>
  <div className="story-projects">{projects.filter(p=>['rented-time','love-roi','clinicallog'].includes(p.id)).map((p,i)=><article key={p.id} className={'story-project project-paper-'+i}><div className="story-project-media"><MediaSlot label={p.type+' · original cover'} src={p.cover} uploads={uploads} onUpload={onUpload} assetKey={p.id+'-cover'} compact/></div><button className="story-project-link" onClick={()=>navigate('projects/'+p.id)}><span><small>0{i+1} / {p.type}</small><strong>{p.title}</strong></span><i>↗</i></button></article>)}</div></section>
  <section className="story-next" data-scroll-reveal><span className="story-section-label">03 / WHERE TO NEXT?</span><div>{[['journey','Follow my journey'],['projects','Explore my projects'],['contact','Make something together']].map(([r,l],i)=><button key={r} onClick={()=>navigate(r)}><small>0{i+1}</small><span>{l}</span><i>↗</i></button>)}</div><p>Thanks for wandering through my little universe.</p></section>
 </div>;
}

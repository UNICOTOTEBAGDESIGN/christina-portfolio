import React,{useEffect,useState} from 'react';
import {experience,projects} from '../data/portfolio';
import {useSequence} from '../motion/useSequence';
import {TimeDial} from '../components/TimeDial';
import {JourneyMedia} from '../components/ExperienceMedia';
export function JourneyTimeline({navigate,uploads,onUpload}){
 const sequence=useSequence(experience.length,Math.min(experience.length-1,Number(sessionStorage.getItem('journey-chapter'))||0));
 const [expanded,setExpanded]=useState(false),chapter=experience[sequence.index];
 useEffect(()=>{sessionStorage.setItem('journey-chapter',sequence.index)},[sequence.index]);
 useEffect(()=>sequence.bindKeyboard(()=>expanded?setExpanded(false):navigate('home/experience'),expanded),[sequence.bindKeyboard,expanded,navigate]);
 const close=()=>setExpanded(false);
 return <section className={'cinema-experience journey-experience chapter-'+sequence.index} aria-label="A journey through time">
  <div className="experience-top"><button className="experience-back" onClick={()=>navigate('home/experience')}>← Back to home</button><span>A JOURNEY THROUGH TIME</span><div className="mobile-time"><TimeDial step={sequence.index}/></div><span>01 / JOURNEY</span></div>
  <div className="journey-stage" {...(!expanded?sequence.gestures:{})}>
   <aside className="chapter-navigation" aria-label="Journey chapters"><span className="vertical-caption">THE CHAPTERS</span>{experience.map((e,i)=><button key={e.id} className={sequence.index===i?'current':''} aria-label={`${e.year} ${e.short}`} aria-current={sequence.index===i?'step':undefined} onClick={()=>{close();sequence.go(i)}}><span>{e.year}</span><small>{e.short}</small><i/></button>)}<TimeDial step={sequence.index}/></aside>
   <div key={sequence.index} className={'journey-composition sequence-'+sequence.phase} style={{'--direction':sequence.direction}}>
    <div className="chapter-year" aria-hidden="true">{chapter.year}</div>
    <div className="chapter-copy"><span className="eyebrow" data-reveal>{String(sequence.index+1).padStart(2,'0')} / {chapter.category}</span><h1 data-reveal>{chapter.organization}</h1><span className="chapter-role" data-reveal>{chapter.role}</span><p className="chapter-story" data-reveal>{chapter.story}</p><span className="chapter-period" data-reveal>{chapter.period}</span><button className="story-button" data-reveal aria-expanded={expanded} onClick={()=>setExpanded(true)}>Explore This Chapter <span>↗</span></button></div>
    <JourneyMedia key={chapter.id} chapter={chapter} index={sequence.index} uploads={uploads} onUpload={onUpload}/>
   </div>
   {expanded&&<aside className="chapter-panel" data-scroll-panel role="region" aria-label={`${chapter.short} chapter details`}><button className="panel-back" autoFocus onClick={close}>← Back to chapter</button><span className="eyebrow">{chapter.period}</span><h2>{chapter.organization}</h2><p className="panel-role">{chapter.role}</p><p>{chapter.description}</p><span className="panel-label">SELECTED ACHIEVEMENTS</span><ul>{chapter.achievements.map(a=><li key={a}>{a}</li>)}</ul><span className="panel-label">{chapter.relatedHeading||'RELATED PROJECT'}</span>{chapter.related.map(id=><button className="related-story" key={id} onClick={()=>navigate('projects/'+id)}>{chapter.relatedLabels?.[id]||projects.find(p=>p.id===id)?.title}<span>{chapter.relatedAction||'View Story'} ↗</span></button>)}{chapter.id!=='toronto'&&<p className="source-caption">Roles, periods and reported achievements from the supplied CV. Original account and project media are not yet attached.</p>}</aside>}
  </div>
  <div className="experience-bottom"><span className="interaction-hint">SCROLL TO TRAVEL THROUGH TIME <i>↓</i></span><div className="sequence-progress"><span>{String(sequence.index+1).padStart(2,'0')}</span><div><i style={{width:(sequence.index+1)/experience.length*100+'%'}}/></div><span>{String(experience.length).padStart(2,'0')}</span></div><div className="sequence-arrows"><button aria-label="Previous chapter" disabled={sequence.index===0||sequence.locked} onClick={()=>{close();sequence.prev()}}>←</button><button aria-label="Next chapter" disabled={sequence.index===experience.length-1||sequence.locked} onClick={()=>{close();sequence.next()}}>→</button></div></div>
 </section>;
}

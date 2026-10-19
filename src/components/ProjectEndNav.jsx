import React from 'react';
import {independentProjects,projects} from '../data/portfolio';
export function ProjectEndNav({id,navigate}){
 const current=id==='dating-app-critique'?'love-roi':id;
 const isInternship=projects.some(p=>p.id===current&&p.relatedExperience);
 const list=isInternship?projects.filter(p=>p.relatedExperience):independentProjects;
 const index=list.findIndex(p=>p.id===current),next=list[(index+1)%list.length];
 if(!next)return null;
 return <nav className="project-end-navigation" aria-label="More projects"><a className="project-return-link" href={isInternship?'#/journey':'#/projects'} onClick={e=>{e.preventDefault();navigate(isInternship?'journey':'projects')}}>{isInternship?'← Back to Experience':'← All projects'}</a><button onClick={()=>navigate('projects/'+next.id)}><small>NEXT PROJECT</small><span>{next.title} ↗</span></button></nav>;
}

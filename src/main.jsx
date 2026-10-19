import React,{useState,useEffect,useLayoutEffect,useCallback,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {PortraitHome} from './components/PortraitHome';
import {PortraitMenu} from './components/PortraitMenu';
import {JourneyTimeline} from './pages/JourneyTimeline';
import {ProjectGallery} from './pages/ProjectGallery';
import {ProjectDetail} from './pages/ProjectDetail';
import {AboutPage} from './pages/AboutPage';
import {ContactPage} from './pages/ContactPage';
import './style.css';
import './experiences.css';
import './portrait.css';
import './reference-motion.css';
import './themes.css';
function App(){
 const [page,setPage]=useState(()=>location.hash.startsWith('#/')?location.hash.slice(2)||'home':'home'),[uploads,setUploads]=useState({}),[light,setLight]=useState(()=>localStorage.getItem('christina-palette')==='light'),[scrolled,setScrolled]=useState(false),heading=useRef(),urls=useRef({});
 useEffect(()=>{document.documentElement.dataset.theme=light?'light':'dark';localStorage.setItem('christina-palette',light?'light':'dark')},[light]);
 useEffect(()=>{const track=()=>setScrolled(scrollY>60);window.addEventListener('scroll',track,{passive:true});return()=>window.removeEventListener('scroll',track)},[]);
 const navigate=useCallback(route=>{if(route==='home/experience'||route==='home/projects'){sessionStorage.setItem('home-return-section',route.split('/')[1]);route='home'}if(location.hash==='#/'+route){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return}location.hash='/'+route},[]);
 useEffect(()=>{const change=()=>{setPage(location.hash.slice(2)||'home')};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);
 useLayoutEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'})},[page]);
 useEffect(()=>{if(page!=='home'){const frame=requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));return()=>cancelAnimationFrame(frame)}},[page]);
 useEffect(()=>()=>Object.values(urls.current).forEach(URL.revokeObjectURL),[]);
 const upload=(key,url)=>{if(urls.current[key])URL.revokeObjectURL(urls.current[key]);urls.current[key]=url;setUploads(v=>({...v,[key]:url}))};
 const [section,id]=page.split('/'),cinematic=['journey','projects','selected-work'].includes(section);
 return <div className={'app portrait-app '+(light?'paper-mode ':'')+(cinematic?'cinematic':'')+(page==='home'?' home-route':'')+(scrolled?' page-scrolled':'')}>
  <header className="site-header portrait-header"><a className="portrait-brand" href="#/home">Christina Huang<span>®</span></a><span className="header-availability"><i/> OPEN TO NEW POSSIBILITIES</span><div className="portrait-header-actions"><button className="palette-toggle" aria-label={light?"Switch to Dark Mode":"Switch to Light Mode"} title={light?"Dark Mode":"Light Mode"} aria-pressed={light} onClick={()=>setLight(v=>!v)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1V4M12 20V23M1 12H4M20 12H23M4.2 4.2L6.3 6.3M17.7 17.7L19.8 19.8M4.2 19.8L6.3 17.7M17.7 6.3L19.8 4.2"/></svg></button><PortraitMenu navigate={navigate}/><button className="contact-pill" onClick={()=>navigate('contact')}>Contact me <span>↗</span></button></div></header>
  {page==='home'?<PortraitHome navigate={navigate} uploads={uploads} onUpload={upload}/>:<main className="content-page portrait-content" ref={heading} tabIndex={-1} key={page}><div className="content-top"><button className="text-button" onClick={()=>navigate((section==='journey'||section==='selected-work'||['tusee','humva','tiktok-shop','catchi','coach-peri'].includes(id))?'home/experience':section==='projects'?'home/projects':'home')}>← Back to home</button><span>CHRISTINA HUANG / CREATIVE PORTFOLIO</span></div>{(section==='journey'||section==='selected-work')?<JourneyTimeline navigate={navigate} uploads={uploads} onUpload={upload}/>:section==='projects'&&id?<ProjectDetail id={id} navigate={navigate} uploads={uploads} onUpload={upload}/>:section==='projects'||section==='selected-work'?<ProjectGallery navigate={navigate} selectedOnly={section==='selected-work'} uploads={uploads}/>:section==='about'?<AboutPage navigate={navigate} uploads={uploads} onUpload={upload}/>:section==='contact'?<ContactPage/>:<div className="page-shell"><h1>Nothing here just yet.</h1><button onClick={()=>navigate('home')}>Back to home ↗</button></div>}</main>}
  <footer className="portrait-footer"><span>© 2026 Christina Huang</span><span>Made with curiosity.</span><a href="mailto:christinahuang050326@gmail.com">Say hello ↗</a></footer>
 </div>;
}
createRoot(document.getElementById('root')).render(<App/>);

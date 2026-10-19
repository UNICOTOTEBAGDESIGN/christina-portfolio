import React from 'react';
import * as THREE from 'three';
import {Block,Pole,Beam,Arch,ArchBand,PetalPlant,Lantern} from './ExteriorHouse';
import {Camera,Journal,Clock} from './Studio';
import {FluffyStar} from './FluffyStar';
import {InteractiveObjects,Letter,CameraFlash} from './InteractiveObjects';
import {Hotspot,Painted} from './Primitives';
import {houseMaterials} from './HouseMaterials';
import {OBJECTS} from './HouseLayout';
function Room({open,...p}){
 const m=houseMaterials();
 return <group name="inside-the-upstairs-studio">
 {/* Enclosed upper room: the camera stays inside these walls, below a barrel vault. */}
 <Block at={[0,1.65,-3.4]} size={[8.2,3.4,.2]} material={m.plaster}/>
 <Block at={[-4,1.65,.65]} size={[.2,3.4,8.1]} material={m.plaster}/>
 <Block at={[0,3.33,-3.4]} size={[8.3,.15,.28]} material={m.cutWood}/><Block at={[-4,3.33,.65]} size={[.28,.15,8.2]} material={m.cutWood}/>
 {/* Floor boards leave an opening for the descending stair. */}
 {Array.from({length:27},(_,i)=>{const x=-3.9+i*.3;return <Block key={i} at={[x,-.09,x< -2.1?-1.55:.65]} size={[.286,.18,x< -2.1?3.5:8.1]} material={i%4===0?m.timber:m.cutWood} round={.008}/>})}
 {[-3.9,3.9].map(x=><Block key={x} at={[x,.13,.65]} size={[.09,.26,8]} material={m.timber}/>)}
 {/* Warm arched window with recessed frame and brass latch. */}
 <Arch at={[-.8,.65,-3.265]} r={1.05} h={1.2} depth={.025} material={m.window}/><ArchBand at={[-.8,.65,-3.20]} r={1.13} h={1.2} thickness={.10} material={m.cutWood}/>
 <Block at={[-.8,1.65,-3.12]} size={[.07,2.0,.10]} material={m.cutWood}/><Block at={[-.8,1.83,-3.12]} size={[2.05,.07,.10]} material={m.cutWood}/><Block at={[-.8,.62,-3.10]} size={[2.55,.14,.40]} material={m.cutWood}/>
 {/* Linen curtains and tiebacks. */}
 {[-2.15,.55].map(x=><group key={x}>{Array.from({length:7},(_,i)=><Pole key={i} at={[x+i*.065,1.75,-3.05]} r={.065} h={2.55} material={m.cloth}/>)}<Block at={[x+.2,1.30,-2.97]} size={[.47,.075,.10]} material={m.brass}/></group>)}
 <Beam from={[-2.25,3.08,-3]} to={[1.04,3.08,-3]} width={.055} depth={.055} material={m.darkBrass}/>
 {/* Built-in desk, drawers, keyboard, camera and personal journal. */}
 <Block at={[-.45,1.05,-2.48]} size={[4.5,.16,1.18]} material={m.cutWood} round={.055}/>
 {[-2.3,1.36].map(x=><group key={x}><Block at={[x,.51,-2.48]} size={[.6,1,1.02]} material={m.timber}/>{[.25,.53,.81].map(y=><group key={y}><Block at={[x,y,-1.94]} size={[.55,.23,.04]} material={m.cutWood}/><Pole at={[x,y,-1.90]} r={.032} h={.035} rotation={[Math.PI/2,0,0]} material={m.brass}/></group>)}</group>)}
 <Hotspot position={OBJECTS['selected-work']} label="Computer · Selected work" onClick={()=>open('selected-work')} reduce={p.reduce}><Block size={[1.13,.73,.09]} material={m.door}/><Painted kind="screen" position={[0,0,.055]} size={[1.02,.62]}/><Pole at={[0,-.49,0]} r={.04} h={.3} material={m.brass}/><Block at={[0,-.63,.04]} size={[.45,.04,.3]} material={m.brass}/></Hotspot>
 <Block at={[-.48,1.16,-2.05]} size={[.88,.035,.29]} material={m.ivory}/>{Array.from({length:12},(_,i)=><Block key={i} at={[-.87+i*.07,1.184,-2.05]} size={[.045,.008,.18]} material={m.door} round={.002}/>)}
 <Camera position={OBJECTS.projects} onClick={()=>open('projects')} reduce={p.reduce}/><Journal position={OBJECTS.about} onClick={()=>open('about')} reduce={p.reduce}/><Clock position={OBJECTS.journey} onClick={()=>open('journey')} reduce={p.reduce}/>
 <Lantern at={[-2.17,1.5,-2.61]} scale={.7}/><PetalPlant at={[1.3,1.15,-2.7]} scale={.58} flowers/>
 {/* Bookcase, shelves and framed memories, individually modeled. */}
 <Block at={[-3.65,1.15,-1.65]} size={[.5,2.3,1.65]} material={m.timber}/>{[.25,.85,1.45,2.05].map((y,j)=><group key={y}><Block at={[-3.32,y,-1.65]} size={[.60,.08,1.7]} material={m.cutWood}/>{Array.from({length:7},(_,i)=><Block key={i} at={[-3.24,y+.23,-2.28+i*.20]} size={[.42,.38+i%2*.08,.13]} rotation={[i===6?.14:0,0,0]} material={[m.door,m.cloth,m.ivory][(i+j)%3]}/>)}</group>)}
 <Block at={[2.65,2.2,-3.20]} size={[1.8,.10,.34]} material={m.cutWood}/>{[2.1,2.65,3.17].map((x,i)=><group key={x}><Block at={[x,2.58,-3.13]} size={[.42,.63,.06]} rotation={[0,0,(i-1)*.08]} material={m.brass}/><Painted kind="photo" position={[x,2.58,-3.09]} size={[.34,.53]}/></group>)}

 {/* A pinboard wall of small photographs, taped notes and a framed film study. */}
 {[-.5,.42,1.34,2.26].map((z,i)=><group key={z} position={[-3.85,2.12+i%2*.13,z]} rotation={[0,Math.PI/2,(i-1.5)*.025]}><Block size={[.67,.86,.045]} material={i%2?m.ivory:m.cutWood}/><Painted kind={i%2?'poster':'photo'} position={[0,0,.03]} size={[.55,.72]}/><Block at={[0,.43,.04]} size={[.23,.07,.018]} material={m.cloth}/></group>)}
 {/* Low work table, ceramic mug, film reels and a stack of sketchbooks. */}
 <Pole at={[.1,.62,2.4]} r={.70} h={.09} material={m.cutWood}/>{[-1,1].flatMap(x=>[-1,1].map(z=><Block key={x+','+z} at={[.1+x*.37,.31,2.4+z*.37]} size={[.065,.58,.065]} material={m.timber}/>))}
 {[0,1,2].map(i=><Block key={i} at={[-.12,.70+i*.075,2.4]} size={[.54,.065,.4]} material={[m.door,m.cloth,m.ivory][i]} rotation={[0,i*.08,0]}/>)}
 <Pole at={[.48,.81,2.38]} r={.105} h={.26} material={m.ivory}/><mesh position={[.59,.81,2.38]} rotation={[0,Math.PI/2,0]} material={m.ivory}><torusGeometry args={[.073,.022,8,24]}/></mesh><Pole at={[.48,.947,2.38]} r={.083} h={.008} material={m.darkWood}/>
 <Pole at={[.1,.72,2.77]} r={.17} h={.045} material={m.darkBrass}/>{Array.from({length:5},(_,i)=><Pole key={i} at={[.1+Math.sin(i*1.257)*.105,.746,2.77+Math.cos(i*1.257)*.105]} r={.031} h={.009} material={m.ivory}/>)}
 {/* Reading nook, fabric cushions and stitched rug. */}
 <Block at={[2.75,.40,-.3]} size={[1.5,.55,1.4]} material={m.door} round={.2}/><Block at={[3.36,.89,-.3]} size={[.28,1.2,1.4]} material={m.doorLight} round={.13}/><Block at={[2.75,.83,-.92]} size={[1.5,.8,.24]} material={m.doorLight} round={.12}/><Block at={[2.83,.77,-.38]} size={[.63,.22,.62]} material={m.cloth} round={.10} rotation={[0,.15,0]}/>
 <Pole at={[.3,.016,.1]} r={1.48} h={.025} material={m.cloth}/>{[1.2,1.35,1.44].map(r=><mesh key={r} position={[.3,.034,.1]} rotation={[-Math.PI/2,0,0]} material={m.doorLight}><torusGeometry args={[r,.008,5,80]}/></mesh>)}
 <FluffyStar position={[1.1,.69,-.15]} rotation={[0,.3,0]} scale={.86} trigger={p.starTrigger} onClick={p.onStar} low={p.low} reduce={p.reduce}/>
 <Block at={[3.5,.85,2.15]} size={[.7,.12,1.2]} material={m.cutWood}/><Letter position={OBJECTS.contact} onClick={()=>open('contact')} reduce={p.reduce}/><PetalPlant at={[3.5,.91,2.6]} scale={.6}/>
 {/* Stairwell descends into the narrow entry tower beneath this wider room. */}
 <Block at={[-3,-2.55,2.6]} size={[2,.15,4.2]} material={m.stone[1]}/><Block at={[-3.9,-1.2,2.3]} size={[.15,2.8,4.5]} material={m.plaster}/>
 {Array.from({length:13},(_,i)=>{let z=.42+i*.25,y=-i*.19-.095;return <group key={i}><Block at={[-3,y,z]} size={[1.55,.16,.27]} material={m.cutWood}/><Block at={[-3,y-.10,z+.11]} size={[1.55,.22,.04]} material={m.timber}/></group>})}
 {Array.from({length:9},(_,i)=><Pole key={i} at={[-2.12,.48,.4+i*.47]} r={.027} h={.92} material={m.timber}/>)}<Beam from={[-2.12,.96,.3]} to={[-2.12,.96,4.5]} width={.085} depth={.085} material={m.cutWood}/><Lantern at={[-3.65,-.6,1.7]} scale={.8}/>
 <Pole at={[.3,3.8,-.3]} r={.014} h={1.3} material={m.darkBrass}/><Pole at={[.3,3.12,-.3]} r={.39} top={.10} h={.26} material={m.brass}/><pointLight position={[.3,2.9,-.3]} color="#ffd29a" intensity={22} distance={10}/><pointLight position={[-.8,2,-2.7]} color={p.night?'#c9baff':'#ffe6bb'} intensity={p.night?8:17} distance={8}/><CameraFlash/>
 </group>;
}
export function InteriorStudio(props){return <InteractiveObjects onOpen={props.onOpen} onFocus={props.onFocus} reduce={props.reduce}>{open=><Room {...props} open={open}/>}</InteractiveObjects>}

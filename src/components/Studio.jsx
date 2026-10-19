import React,{useRef,useState,useMemo} from 'react';
import {useObjectState} from './InteractiveObjects';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {Box,Ball,Cylinder,Hotspot,Painted,Plant,colors as c} from './Primitives';

function ArchWindow(){const {mask,curve}=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.975,0);s.lineTo(.975,0);s.lineTo(.975,2.23);s.lineTo(-.975,2.23);s.closePath();const h=new THREE.Path();h.moveTo(-.975,0);h.lineTo(.975,0);h.lineTo(.975,1.25);h.absarc(0,1.25,.975,0,Math.PI,false);h.closePath();s.holes.push(h);const points=Array.from({length:49},(_,i)=>{const a=i/48*Math.PI;return new THREE.Vector3(Math.cos(a)*1.02,Math.sin(a)*1.02,0)});return {mask:s,curve:new THREE.CatmullRomCurve3(points)}},[]);return <><mesh position={[-.75,.98,-2.44]} castShadow receiveShadow><extrudeGeometry args={[mask,{depth:.20,bevelEnabled:false}]}/><meshStandardMaterial color="#e5d7ed"/></mesh><mesh position={[-.75,2.23,-2.15]} castShadow><tubeGeometry args={[curve,48,.067,12,false]}/><meshStandardMaterial color="#fff3d6"/></mesh></>}
export function Clock({onClick,reduce,position=[1.9,2.95,-2.08]}){const hand=useRef(),[spin,setSpin]=useState(0);useFrame((_,dt)=>{if(hand.current)hand.current.rotation.z=THREE.MathUtils.damp(hand.current.rotation.z,-spin*Math.PI*2-.6,reduce?60:5,dt)});return <Hotspot position={position} label="A little journey through time" onClick={()=>{setSpin(v=>v+1);onClick()}} reduce={reduce}><Cylinder radius={.39} height={.13} color={c.wood} rotation={[Math.PI/2,0,0]}/><Cylinder radius={.335} height={.015} position={[0,0,.08]} rotation={[Math.PI/2,0,0]}/>{Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Box key={i} size={[.018,.043,.01]} position={[Math.sin(a)*.28,Math.cos(a)*.28,.095]} color={c.ink} rotation={[0,0,-a]}/>})}<group position={[0,0,.11]} ref={hand}><Box size={[.024,.23,.018]} position={[0,.095,0]} color={c.ink}/></group><Box size={[.16,.025,.018]} position={[.065,0,.12]} color={c.ink} rotation={[0,0,-.4]}/><Ball position={[0,0,.14]} scale={[.035,.035,.025]} color={c.ink}/></Hotspot>}
export function Camera({onClick,reduce,position=[-1.8,1.47,.60]}){return <Hotspot position={position} rotation={[0,.3,0]} label="Stories through my lens · Projects" onClick={onClick} reduce={reduce}><Box size={[.65,.39,.28]} color="#71657e"/><Box size={[.22,.13,.22]} position={[-.12,.23,0]} color="#95849f"/><Cylinder position={[.08,0,.23]} radius={.16} height={.24} color="#dcc9b3" rotation={[Math.PI/2,0,0]}/><Cylinder position={[.08,0,.36]} radius={.12} height={.02} color="#4e445d" rotation={[Math.PI/2,0,0]}/><Ball position={[.05,.04,.38]} scale={[.035,.035,.008]} color="#b6cfdb"/><Box size={[.13,.08,.01]} position={[-.22,.09,.15]} color={c.yellow}/><Cylinder position={[.23,.24,0]} radius={.055} height={.07} color={c.pink}/></Hotspot>}
export function Journal({onClick,reduce,position=[-1.25,1.25,.52]}){const {active}=useObjectState(),cover=useRef();useFrame((_,dt)=>{if(cover.current)cover.current.rotation.z=THREE.MathUtils.damp(cover.current.rotation.z,active==='about'?-1.5:0,reduce?100:10,dt)});return <Hotspot position={position} rotation={[0,-.2,0]} label="Pages from my notebook · About me" onClick={onClick} reduce={reduce}><Box size={[.6,.07,.72]} color="#b79ccf"/><Box size={[.53,.04,.65]} position={[.02,.043,0]} color={c.cream}/><group ref={cover} position={[-.29,.08,0]}><Box size={[.6,.025,.72]} position={[.29,0,0]} color="#c5a9df"/><Box size={[.03,.018,.7]} position={[.09,.022,0]} color={c.yellow}/><Box size={[.22,.014,.10]} position={[.33,.025,0]} color={c.cream}/></group><Box size={[.035,.03,.48]} position={[.38,.01,0]} rotation={[0,.25,0]} color={c.ink}/></Hotspot>}
function Books({position,flat=false}){return <group position={position}>{['#b09ac7','#edcd94','#d0b6ba','#a8bfb2','#f3dfbd'].map((color,i)=>flat?<Box key={i} size={[.53-i*.03,.09,.36]} position={[i*.015,i*.1,0]} color={color}/>:<group key={i} position={[i*.14,0,0]} rotation={[0,0,i===4?-.12:0]}><Box size={[.11,.42+(i%3)*.08,.32]} position={[0,.23,0]} color={color}/><Box size={[.115,.018,.327]} position={[0,.13,.001]} color={c.cream}/></group>)}</group>}
export function Studio({night,onOpen,reduce}){const win=useRef();const {active}=useObjectState();useFrame((_,dt)=>{win.current.emissiveIntensity=THREE.MathUtils.damp(win.current.emissiveIntensity,night?1.2:.25,3,dt)});return <group>
 {/* Floating architectural plinth and individually laid floorboards. */}
 <Box size={[6.6,.33,5.25]} position={[0,-.12,0]} color="#c2a8d8" radius={.16}/><Box size={[6.35,.12,5.02]} position={[0,.1,0]} color={c.cream} radius={.06}/>
 {Array.from({length:15},(_,i)=><Box key={i} size={[.403,.07,4.79]} position={[-2.91+i*.416,.195,0]} color={i%3===0?'#edd5b6':i%3===1?'#f2dfc4':'#efdbc0'} radius={.012}/>)}
 {/* Two thick open section walls; the front and right are deliberately cut away. */}
 <Box size={[.19,3.6,4.9]} position={[-3.05,2,-.02]} color="#cbb4e3"/><Box size={[6.25,.23,.23]} position={[0,3.81,-2.35]} color="#b89dd1"/>
 <Box size={[.2,.18,4.94]} position={[-3.05,3.81,-.02]} color="#b89dd1"/>
 <Box size={[.10,.21,4.8]} position={[-2.90,.37,0]} color={c.cream}/>
 {/* Back wall has a real window opening, not a picture applied to a solid wall. */}
 <Box size={[1.25,3.6,.20]} position={[-2.34,2,-2.35]} color="#e5d7ed"/>
 <Box size={[2.85,3.6,.20]} position={[1.7,2,-2.35]} color="#e5d7ed"/>
 <Box size={[1.95,.70,.20]} position={[-.75,.59,-2.35]} color="#e5d7ed"/>
 <Box size={[1.95,.56,.20]} position={[-.75,3.52,-2.35]} color="#e5d7ed"/>
 <Box size={[6,.20,.10]} position={[0,.37,-2.20]} color={c.cream}/>
 <mesh position={[-.75,2.1,-2.40]}><planeGeometry args={[1.95,2.23]}/><meshStandardMaterial color="#fff0b8" emissive="#ffda8c" ref={win} transparent opacity={.8}/></mesh>
 {[-1.77,.27].map(x=><Box key={x} size={[.13,2.44,.29]} position={[x,2.1,-2.23]} color="#fff3d6"/>)}
 <ArchWindow/>{[.91].map(y=><Box key={y} size={[2.14,.12,.30]} position={[-.75,y,-2.23]} color="#fff3d6"/>)}
 <Box size={[.065,2.25,.16]} position={[-.75,2.1,-2.17]} color={c.cream}/><Box size={[2,.06,.16]} position={[-.75,2.1,-2.17]} color={c.cream}/>
 <Box size={[2.35,.13,.55]} position={[-.75,.9,-2.1]} color={c.cream}/>
 {/* Pleated painted cotton curtains. */}
 {[-1.93,.42].map((x,i)=><group key={i}>{Array.from({length:4},(_,j)=><Cylinder key={j} radius={.075} height={2.43} position={[x+j*.078,2.05,-1.98]} color={j%2?'#beaad8':'#cbb8e1'}/>)}<Box size={[.39,.09,.20]} position={[x+.12,1.38,-1.92]} color={c.yellow}/></group>)}
 <Cylinder radius={.035} height={2.9} position={[-.67,3.37,-2.0]} rotation={[0,0,Math.PI/2]} color={c.wood}/>
 {/* A narrow roof along the back reads as a dollhouse section, leaving the interior open. */}
 <Box size={[6.65,.17,.77]} position={[0,3.94,-2.26]} rotation={[-.17,0,0]} color="#b296cb"/>
 {Array.from({length:18},(_,i)=><Box key={i} size={[.022,.022,.76]} position={[-3.17+i*.37,4.04,-2.26]} rotation={[-.17,0,0]} color="#c8aedf"/>)}
 {/* Desk: two drawers and a light ash top. */}
 <Box size={[3.48,.14,1.90]} position={[-.93,1.15,-.1]} color="#f8e7c9" radius={.07}/>
 {[-2.25,.40].map(x=><Box key={x} size={[.12,.9,.94]} position={[x,.67,-.1]} color={c.wood}/>)}
 <Box size={[.71,.76,1.01]} position={[-2.03,.70,-.13]} color="#dcc5a3"/>
 {[.48,.75,.99].map(y=><group key={y}><Box size={[.66,.20,.06]} position={[-2.03,y,.40]} color="#f2dfbf"/><Ball position={[-2.03,y,.45]} scale={[.035,.035,.025]} color={c.ink}/></group>)}
 {/* Desktop cinema and keyboard. */}
 <pointLight position={[-.70,1.87,-.35]} color="#d9c0ff" intensity={active==='selected-work'?2:0} distance={2}/><Hotspot position={[-.70,1.87,-.48]} label="The screen lights up · Selected Work" onClick={()=>onOpen('selected-work')} reduce={reduce}><Box size={[1.15,.78,.10]} position={[0,0,0]} color="#8a789d" radius={.06}/><Painted kind="screen" position={[0,0,.06]} size={[1.04,.66]}/><Cylinder radius={.045} height={.32} position={[0,-.48,0]} color="#aa98b6"/><Box size={[.58,.04,.32]} position={[0,-.63,.03]} color="#aa98b6"/></Hotspot>
 <Box size={[.88,.045,.28]} position={[-.65,1.25,.17]} color="#ddcfe8"/>{Array.from({length:11},(_,i)=><Box key={i} size={[.045,.009,.16]} position={[-1+i*.069,1.278,.17]} color={c.cream}/>)}
 <Ball position={[0,1.25,.2]} scale={[.09,.04,.13]} color={c.purple}/>
 <Camera onClick={()=>onOpen('projects')} reduce={reduce}/><Journal onClick={()=>onOpen('about')} reduce={reduce}/>
 {/* Brass desk lamp. */}
 <Cylinder radius={.19} height={.06} position={[-2.25,1.27,-.50]} color={c.yellow}/><Cylinder radius={.025} height={.64} position={[-2.25,1.60,-.50]} color="#b39b83" rotation={[0,0,-.16]}/><mesh position={[-2.12,1.94,-.50]} rotation={[0,0,-.22]} castShadow><coneGeometry args={[.27,.25,32,1,true]}/><meshStandardMaterial color={c.yellow} side={THREE.DoubleSide}/></mesh><Ball position={[-2.12,1.85,-.5]} scale={[.08,.07,.08]} color="#fff3be"/><pointLight position={[-2.12,1.8,-.4]} intensity={night?1.1:.25} distance={3} color="#ffd99a"/>
 {/* Tea and pencil cup. */}
 <Cylinder position={[.36,1.39,-.35]} radius={.105} height={.28} color={c.pink}/>{[0,1,2].map(i=><Cylinder key={i} radius={.012} height={.38} position={[.30+i*.05,1.64,-.35]} rotation={[0,0,(i-1)*.12]} color={i%2?c.ink:c.yellow}/>)}
 <Cylinder position={[-1.65,1.31,-.43]} radius={.11} height={.20} color={c.cream}/><Cylinder position={[-1.65,1.415,-.43]} radius={.09} height={.01} color="#a98368"/>
 <mesh position={[-1.52,1.33,-.43]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.07,.019,8,20]}/><meshStandardMaterial color={c.cream}/></mesh>
 {/* Circular woven rug and the stool under Fluffy. */}
 <Cylinder radius={1.26} height={.023} position={[.64,.25,.98]} color="#d4bdde"/><mesh position={[.64,.266,.98]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.1,1.15,64]}/><meshStandardMaterial color="#f2e1f0"/></mesh>
 <Cylinder radius={.40} height={.16} position={[.65,.95,1.55]} color="#f0d99e"/>{[-1,1].flatMap(x=>[-1,1].map(z=><Cylinder key={x+','+z} radius={.035} height={.65} position={[.65+x*.23,.59,1.55+z*.23]} color={c.wood}/>))}
 {/* Lavender reading sofa on right, cushion seams and pillows. */}
 <Box size={[1.48,.30,1.95]} position={[2.04,.56,-.48]} color="#b59acb" radius={.13}/><Box size={[.22,.78,2]} position={[2.75,.91,-.49]} color="#c8afdd" radius={.10}/><Box size={[1.45,.60,.22]} position={[2.03,.80,-1.38]} color="#c8afdd" radius={.10}/><Box size={[1.45,.60,.22]} position={[2.03,.80,.42]} color="#c8afdd" radius={.10}/>{[-.88,-.1].map(z=><Box key={z} size={[1.10,.20,.73]} position={[1.96,.79,z]} color="#d7c0e8" radius={.09}/>)}
 <Box size={[.19,.57,.55]} position={[2.45,1.12,-.85]} rotation={[.12,0,.2]} color={c.yellow} radius={.09}/><Box size={[.19,.53,.53]} position={[2.43,1.10,-.18]} rotation={[-.1,0,.14]} color="#ead5d7" radius={.09}/>
 {/* Little reading table, stacked books and a ceramic vase. */}
 <Cylinder radius={.49} height={.09} position={[2.03,.74,1.55]} color={c.cream}/><Cylinder radius={.07} height={.46} position={[2.03,.48,1.55]} color={c.wood}/><Cylinder radius={.31} height={.06} position={[2.03,.27,1.55]} color={c.wood}/><Cylinder radius={.105} top={.065} height={.28} position={[2.24,.93,1.51]} color={c.purple}/><Cylinder radius={.012} height={.4} position={[2.24,1.22,1.51]} color="#9cab87"/><Ball position={[2.24,1.43,1.51]} scale={[.09,.08,.08]} color={c.yellow}/>
 {/* Shelving on left wall, books, photographic keepsakes. */}
 {[1.25,2.15,3.02].map(y=><Box key={y} size={[.65,.10,1.75]} position={[-2.65,y,-.80]} color={c.wood}/>)}
 <group position={[-2.70,2.20,-1.35]} rotation={[0,Math.PI/2,0]}><Books position={[0,0,0]}/></group><group position={[-2.72,1.30,-1.10]} rotation={[0,Math.PI/2,0]}><Books position={[0,0,0]} flat/></group>
 <Hotspot position={[-2.52,2.43,-.27]} rotation={[0,Math.PI/2,0]} label="Little reels, big stories · Projects" onClick={()=>onOpen('projects')} reduce={reduce}><Cylinder radius={.24} height={.08} color="#b6a0bf" rotation={[Math.PI/2,0,0]}/><Cylinder radius={.043} height={.015} position={[0,0,.05]} color={c.wood} rotation={[Math.PI/2,0,0]}/>{Array.from({length:5},(_,i)=>{const a=i*Math.PI*2/5;return <Cylinder key={i} radius={.057} height={.013} position={[Math.sin(a)*.145,Math.cos(a)*.145,.049]} color="#786882" rotation={[Math.PI/2,0,0]}/>})}<Box size={[.46,.13,.025]} position={[.32,-.17,0]} color="#796982"/>{[0,1,2,3,4].map(i=><Box key={i} size={[.026,.025,.01]} position={[.15+i*.075,-.14,.019]} color={c.cream}/>)}</Hotspot>
 <Plant position={[-2.65,3.08,-1.2]} scale={.68}/><Box size={[.09,.45,.36]} position={[-2.58,3.30,-.3]} color={c.cream}/><Painted kind="photo" position={[-2.526,3.30,-.3]} size={[.31,.4]} rotation={[0,Math.PI/2,0]}/>
 <Box size={[.07,1.07,.8]} position={[-2.91,2.43,1.15]} color={c.wood}/><Painted position={[-2.866,2.43,1.15]} size={[.72,.98]} rotation={[0,Math.PI/2,0]}/>
 <Clock onClick={()=>onOpen('journey')} reduce={reduce}/>
 <Box size={[.9,.08,.28]} position={[1.8,2.19,-2.04]} color={c.wood}/><Books position={[1.5,2.24,-2.06]}/>
 <Plant position={[-2.45,.24,1.75]} scale={1.25}/><Plant position={[2.45,.24,-1.90]} scale={1.05}/>
 {/* Fairy light string across the wall, with tiny warm ceramic bulbs. */}
 {Array.from({length:17},(_,i)=>{const x=-2.75+i*.34,y=3.42-.33*Math.sin(i/16*Math.PI);return <group key={i}><Ball position={[x,y,-2.06]} scale={[.036,.047,.036]} color={c.yellow}/>{i<16&&<Box size={[.35,.014,.014]} position={[x+.17,y,-2.06]} color="#9c8aa5"/>}</group>})}
 </group>}

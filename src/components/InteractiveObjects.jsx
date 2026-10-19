import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {OBJECTS} from './HouseLayout';
import {Box,Cylinder,Hotspot,colors as c} from './Primitives';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
const ObjectContext=createContext({active:null});
export const useObjectState=()=>useContext(ObjectContext);
export function InteractiveObjects({onOpen,onFocus,reduce,children}){
 const [active,setActive]=useState(null),timers=useRef([]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const open=kind=>{
  timers.current.forEach(clearTimeout);setActive(kind);
  onFocus?.(OBJECTS[kind]);
  timers.current=[setTimeout(()=>onOpen(kind),reduce?0:480),setTimeout(()=>{setActive(null);onFocus?.(null)},1000)];
 };
 return <ObjectContext.Provider value={{active,open}}>{children(open)}</ObjectContext.Provider>;
}
export function Letter({onClick,reduce,position=[1.92,.84,1.55]}){
 const flap=useRef(),{active}=useObjectState();
 useFrame((_,dt)=>{if(flap.current)flap.current.rotation.x=THREE.MathUtils.damp(flap.current.rotation.x,active==='contact'?-2.2:0,reduce?100:10,dt)});
 const triangle=React.useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.26,0);s.lineTo(.26,0);s.lineTo(0,-.22);s.closePath();return s},[]);
 return <Hotspot position={position} rotation={[-Math.PI/2,0,-.15]} label="A letter for you · Contact" onClick={onClick} reduce={reduce}><Box size={[.58,.39,.035]} color="#f3e4cd"/><group ref={flap} position={[0,.18,.027]}><mesh><shapeGeometry args={[triangle]}/><meshStandardMaterial color="#dfcbb4" side={THREE.DoubleSide}/></mesh></group><Cylinder radius={.055} height={.015} position={[0,0,.035]} rotation={[Math.PI/2,0,0]} color="#b89cba"/></Hotspot>;
}
export function CameraFlash(){const {active}=useObjectState();return active==='projects'?<><pointLight position={[-1.45,1.48,-1.7]} intensity={5} distance={3} color="#ffffff"/><mesh position={[-1.65,1.5,-1.8]}><sphereGeometry args={[.055,12,8]}/><meshBasicMaterial color="white"/></mesh></>:null}

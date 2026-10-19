import React,{useMemo,useRef,useEffect,useState} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {Ball,Hotspot} from './Primitives';

function makeShape(){
  const points=[];
  for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?.43:.67;points.push(new THREE.Vector2(Math.cos(a)*r,Math.sin(a)*r));}
  const s=new THREE.Shape();
  points.forEach((p,i)=>{const a=p.clone().lerp(points[(i+9)%10],.30),b=p.clone().lerp(points[(i+1)%10],.30);if(i===0)s.moveTo(a.x,a.y);else s.lineTo(a.x,a.y);s.quadraticCurveTo(p.x,p.y,b.x,b.y)});
  s.closePath();return s;
}
export function FluffyStar({trigger=0,onClick,rain=false,low=false,reduce=false,position=[.65,1.55,1.55],rotation=[0,.52,0],scale=1,intro=false}){
  const shape=useMemo(makeShape,[]), body=useRef(),eyes=useRef(),brows=useRef(),mouth=useRef(),arm=useRef(),last=useRef(-100),time=useRef(0),[hover,setHover]=useState(false);
  useEffect(()=>{if(trigger)last.current=time.current},[trigger]);
  const felt=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d'),data=ctx.createImageData(128,128);let seed=42;for(let i=0;i<data.data.length;i+=4){seed=seed*16807%2147483647;const n=100+seed/2147483647*95;data.data[i]=data.data[i+1]=data.data[i+2]=n;data.data[i+3]=255}ctx.putImageData(data,0,0);const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(3,3);return tex},[]);
  const fur=useMemo(()=>{
    let seed=42;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
    const outline=shape.getPoints(80),inside=(x,y)=>{let yes=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const a=outline[i],b=outline[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)yes=!yes}return yes};
    const p=[];
    for(let i=0;i<(low?2200:8500);i++){let x=(rand()-.5)*1.35,y=(rand()-.5)*1.35;if(!inside(x,y)){i--;continue}const z=.345+rand()*.01,l=.012+rand()*.014;p.push(x,y,z,x+(rand()-.5)*.025,y+l,z+rand()*.03)}
    for(let i=0;i<(low?700:2400);i++){const a=outline[Math.floor(rand()*(outline.length-1))],len=Math.hypot(a.x,a.y),nx=a.x/len,ny=a.y/len,z=rand()*.30-.02,x=a.x+nx*.08,y=a.y+ny*.08,l=.018+rand()*.028;p.push(x,y,z,x+nx*l+(rand()-.5)*.01,y+ny*l+(rand()-.5)*.01,z+.01)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));return g;
  },[shape,low]);
  useEffect(()=>()=>fur.dispose(),[fur]);
  useFrame((state,dt)=>{
    const t=time.current=state.clock.elapsedTime,age=t-last.current,jump=age<1.05?Math.sin(age/1.05*Math.PI)*.34:0;
    if(body.current){body.current.position.y=reduce?0:Math.sin(t*1.8)*.025+jump;body.current.rotation.z=reduce?0:Math.sin(t*1.1)*.025+(age<1.05?Math.sin(age*9)*.09:0);const s=1+(reduce?0:Math.sin(t*1.8)*.012);body.current.scale.set(s,s,s);body.current.rotation.y=THREE.MathUtils.damp(body.current.rotation.y,hover?state.pointer.x*.1:0,5,dt)}
    if(eyes.current){const blink=!reduce&&Math.sin(t*1.4)>.993;eyes.current.scale.y=blink?.1:age<1.05?1.18:1;eyes.current.position.x=THREE.MathUtils.damp(eyes.current.position.x,hover?state.pointer.x*.045:0,8,dt)}
    if(brows.current)brows.current.position.y=hover||age<1.05||rain?.04:0;
    if(mouth.current)mouth.current.scale.y=age<1.05?1.7:1;
    if(arm.current)arm.current.rotation.z=reduce?0:(hover||intro?Math.sin(t*7)*.2:0);
  });
  return <group position={position} rotation={rotation} scale={scale}>
    <group ref={body} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
      <Hotspot label="Fluffy Star · say hello" onClick={onClick} reduce={reduce}>
        <mesh castShadow><extrudeGeometry args={[shape,{depth:.25,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.09,bevelThickness:.1,curveSegments:10}]}/><meshStandardMaterial color="#ffe3a3" roughness={1} bumpMap={felt} bumpScale={.021}/></mesh>
        <lineSegments geometry={fur} raycast={()=>null}><lineBasicMaterial color="#f9dfa9" transparent opacity={.65}/></lineSegments>
        <group ref={eyes}>{[-.17,.17].map(x=><group key={x}><Ball position={[x,.035,.405]} scale={[.036,.050,.025]} color="#382c37"/><Ball position={[x-.009,.052,.429]} scale={[.009,.012,.006]} color="#fff9ee"/></group>)}</group>
        <group ref={brows}>{[-.17,.17].map(x=><mesh key={x} position={[x,.17,.405]} rotation={[0,0,Math.PI/2+(x>0?-.13:.13)]}><capsuleGeometry args={[.007,.045,4,8]}/><meshStandardMaterial color="#99765e"/></mesh>)}</group>
        <mesh ref={mouth} position={[0,-.085,.405]} rotation={[0,0,Math.PI]}><torusGeometry args={[.050,.011,8,20,Math.PI]}/><meshStandardMaterial color="#71504a"/></mesh>
        {[-.27,.27].map(x=><Ball key={x} position={[x,-.045,.385]} scale={[.045,.021,.012]} color="#efb69f"/>)}
        <group ref={arm} position={[.48,.04,.07]}><Ball position={[.09,.04,0]} scale={[.14,.115,.15]} color="#ffe5a0"/></group>
      </Hotspot>
    </group>
  </group>;
}

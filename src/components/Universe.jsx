import React,{useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import {ContactShadows,Environment,Lightformer} from '@react-three/drei';
import * as THREE from 'three';
import {ExteriorHouse} from './ExteriorHouse';
import {InteriorStudio} from './InteriorStudio';
import {HouseSurroundings} from './HouseSurroundings';
import {CameraController} from './CameraController';

function Lighting({night}){
 const key=useRef(),ambient=useRef();useFrame((_,dt)=>{key.current.intensity=THREE.MathUtils.damp(key.current.intensity,night?.9:2.4,3,dt);ambient.current.intensity=THREE.MathUtils.damp(ambient.current.intensity,night?.18:.32,3,dt)});
 return <><ambientLight ref={ambient} intensity={.32}/><hemisphereLight color="#f2e9ff" groundColor="#8c6c88" intensity={.45}/><directionalLight ref={key} position={[-5,10,6]} color="#ffd9b1" intensity={2.5} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={10} shadow-camera-bottom={-5} shadow-normalBias={.04} shadow-radius={4}/><directionalLight position={[5,6,-5]} color="#bea5e5" intensity={.9}/></>;
}
export function Universe(props){
 useEffect(()=>{props.onReady?.()},[]);
 return <><CameraController scene={props.scene} phase={props.phase} reduce={props.reduce} focus={props.focus} interiorView={props.interiorView}/><Lighting night={props.night}/><Environment resolution={128} frames={1}><Lightformer form="rect" intensity={2.5} color="#fff1db" position={[-5,7,6]} scale={[7,9,1]} rotation={[0,Math.PI/4,0]}/><Lightformer form="rect" intensity={1.4} color="#c6b0f0" position={[4,5,-4]} scale={[5,7,1]} rotation={[0,Math.PI,0]}/><Lightformer form="rect" intensity={.7} color="#fff8ec" position={[0,9,0]} scale={[5,5,1]} rotation={[Math.PI/2,0,0]}/></Environment>{props.scene==='exterior'?<ExteriorHouse {...props}/>:<InteriorStudio {...props}/>}{props.scene==='exterior'&&<HouseSurroundings/>}{!props.low&&props.scene==='exterior'&&<ContactShadows key={props.scene} position={[0,-.015,0]} opacity={.32} scale={16} blur={2.7} far={props.scene==='exterior'?9:4} resolution={256} frames={1} color="#675370"/>}</>;
}

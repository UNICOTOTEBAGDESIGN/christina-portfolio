import React,{Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {Universe} from './Universe';
export default function WorldCanvas({active,low,...props}){
 return <Canvas frameloop={active?'always':'never'} shadows={!low} dpr={low?1:[1,1.6]} camera={{position:[7,6.1,14],fov:35,near:.1,far:80}} gl={{antialias:!low,alpha:true,powerPreference:low?'low-power':'high-performance'}}><Suspense fallback={null}><Universe low={low} {...props}/></Suspense></Canvas>;
}

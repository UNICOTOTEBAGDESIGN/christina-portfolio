import React from 'react';
import {Canvas} from '@react-three/fiber';
import {FluffyCat} from './FluffyCat';
export default function CatCompanion({trigger,onClick,reduce,quote}){return <div className="cat-companion">{quote&&<div className="cat-quote" role="status">{quote}</div>}<Canvas dpr={1} camera={{position:[0,.15,3.6],fov:30}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}><ambientLight intensity={1.5}/><directionalLight position={[-2,4,5]} intensity={2} color="#ffe7be"/><FluffyCat position={[0,-.64,0]} scale={1.0} trigger={trigger} onClick={onClick} low reduce={reduce}/></Canvas><button aria-label="Say hello to the little yellow cat" onClick={onClick}>A little company</button></div>}

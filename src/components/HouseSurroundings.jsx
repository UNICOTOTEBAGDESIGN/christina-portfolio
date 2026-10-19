import React from 'react';
import {houseMaterials} from './HouseMaterials';
import {Block,Orb,Pole,Beam,PetalPlant} from './ExteriorHouse';
export function HouseSurroundings(){const m=houseMaterials();return <group name="entrance-terrace-and-planters">
 {/* A small masonry terrace, timber fence and plants frame the entrance. */}
 {[0,1,2].map(row=>[-1,0,1].map(col=><Block key={row+','+col} at={[-1.46+col*.23,.17+row*.23,1.05]} size={[.225,.21,.57]} material={m.stone[(row+col+4)%4]} round={.04}/>))}
 <Block at={[-1.46,.91,1.05]} size={[.80,.09,.68]} material={m.cutWood}/>
 {[-1.82,-1.45,-1.08].map(x=><group key={x}><Pole at={[x,1.18,1.34]} r={.045} h={.52} material={m.timber}/><Block at={[x,1.44,1.34]} size={[.13,.08,.13]} material={m.cutWood}/></group>)}
 <Block at={[-1.45,1.40,1.34]} size={[.91,.09,.12]} material={m.cutWood}/><Block at={[-1.45,1.04,1.34]} size={[.87,.08,.10]} material={m.timber}/>
 <PetalPlant at={[-1.45,.94,1.01]} scale={.85} trail={.75} flowers/>
 <Block at={[1.40,.16,1.38]} size={[.65,.29,.54]} material={m.cutWood} round={.025}/>{[-.23,.23].map(x=><Block key={x} at={[1.40+x,.19,1.66]} size={[.055,.31,.045]} material={m.timber}/>)}<Block at={[1.40,.13,1.68]} size={[.62,.035,.035]} material={m.darkWood}/><Block at={[1.40,.31,1.38]} size={[.68,.045,.56]} material={m.timber}/>
 <Block at={[1.48,.48,1.12]} size={[.44,.28,.39]} material={m.cutWood} rotation={[0,.12,0]}/><Block at={[1.48,.63,1.12]} size={[.46,.04,.41]} material={m.timber} rotation={[0,.12,0]}/>
 {[[-.97,.085,1.84],[1.01,.09,1.72],[-1.84,.09,.61]].map((at,i)=><Orb key={i} at={at} scale={[.12,.065,.08]} material={m.stone[i]}/>)}
 </group>}

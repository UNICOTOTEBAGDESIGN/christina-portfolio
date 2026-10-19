import {useEffect, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';

const V = (a) => new THREE.Vector3(...a);
const poses = {
  exterior: {position:[7,6.1,14], target:[.45,4.1,0]},
  interior: {position:[11,10,14], target:[0,.6,.5]},
  studio: {position:[7,6,8],target:[-.4,1.3,-1.9]},
  stairs: {position:[4,6,8],target:[-2.3,-.3,1.7]},
  door: {position:[.1,1.6,3.8], target:[0,1.55,.2]},
  studioDoor: {position:[8,6,11], target:[0,.6,.5]},
};
export function CameraController({scene, phase, reduce, focus,interiorView='whole'}) {
  const {camera,size,gl} = useThree();
  const zoom=useRef(1);
  useEffect(()=>{const node=gl.domElement;const wheel=e=>{e.preventDefault();zoom.current=THREE.MathUtils.clamp(zoom.current-e.deltaY*.0007,.88,1.25)};node.addEventListener('wheel',wheel,{passive:false});const reset=()=>zoom.current=1;node.addEventListener('dblclick',reset);return()=>{node.removeEventListener('wheel',wheel);node.removeEventListener('dblclick',reset)}},[gl]);
  const looking = useRef(V(poses.exterior.target));
  const animation = useRef(null);
  const positionBase=useRef(V(poses.exterior.position)),focusAmount=useRef(0);
  const ready = useRef(false);
  useEffect(() => {
    const interiorPose=interiorView==='studio'?poses.studio:interiorView==='stairs'?poses.stairs:poses.interior;
    const targetPose = phase==='entering' ? (scene==='exterior'?poses.door:interiorPose)
      : phase==='leaving' ? (scene==='interior'?poses.studioDoor:poses.exterior) : scene==='interior'?interiorPose:poses[scene];
    let fromPosition=camera.position.clone(), fromTarget=looking.current.clone();
    if (phase==='entering' && scene==='interior') {fromPosition=V(poses.studioDoor.position);fromTarget=V(poses.studioDoor.target);}
    if (phase==='leaving' && scene==='exterior') {fromPosition=V(poses.door.position);fromTarget=V(poses.door.target);}
    const mobile=size.width<540;
    const targetPosition=V(targetPose.position);

    if(mobile && targetPose===poses.exterior) targetPosition.sub(V(targetPose.target)).multiplyScalar(1.22).add(V(targetPose.target));
    animation.current={start:performance.now(),duration:reduce?0:phase==='idle'?.6:1.08,fromPosition,fromTarget,toPosition:targetPosition,toTarget:V(targetPose.target)};
    if(!ready.current){camera.position.copy(targetPosition);positionBase.current.copy(targetPosition);looking.current.copy(V(targetPose.target));ready.current=true;}
  },[scene,phase,reduce,size.width,camera,interiorView]);
  useEffect(()=>{
    camera.fov=scene==='exterior'?35:40;
    camera.updateProjectionMatrix();
  },[scene,camera]);
  useFrame((state,dt)=>{
    const a=animation.current;
    if(a){const t=a.duration===0?1:Math.min(1,(performance.now()-a.start)/1000/a.duration),e=t*t*(3-2*t);positionBase.current.lerpVectors(a.fromPosition,a.toPosition,e);looking.current.lerpVectors(a.fromTarget,a.toTarget,e);if(t===1)animation.current=null;}
    // A small object focus accompanies opening a content page, then returns naturally.
    const look=looking.current.clone();
    if(focus&&scene==='interior') look.lerp(V(focus),.58);
    focusAmount.current=THREE.MathUtils.damp(focusAmount.current,focus&&scene==='interior'?.35:0,reduce?100:7,dt);
    camera.position.copy(positionBase.current).addScaledVector(look.clone().sub(positionBase.current).normalize(),focusAmount.current);
    if(!reduce&&phase==='idle'){camera.position.x+=state.pointer.x*.20;camera.position.y+=state.pointer.y*.12;}
    camera.zoom=THREE.MathUtils.damp(camera.zoom,zoom.current,7,dt);camera.updateProjectionMatrix();
    camera.lookAt(look);
  });
  return null;
}

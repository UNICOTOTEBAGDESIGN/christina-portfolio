import React,{Suspense,useEffect,useMemo,useRef,useState} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {TORN_PORTRAIT,HEAD_OUTLINE,STICKER_BORDER} from '../data/portraitGeometry';
import {gradeFor} from '../data/portraitGrades';
import{portraitAsset,SURPRISE_TORN_PORTRAIT}from'../data/portraitAssets';
const gazeDirections=['n','ne','e','se','s','sw','w','nw'];
const openingTear=`
float tearRoughness(vec2 uv){float t=uv.x+uv.y;return 3.2*sin(t*71.)+1.7*sin(t*173.)+.8*sin(t*419.);}
`;
const vertex=`
uniform float uProgress;uniform float uWidth;uniform float uHeight;uniform float uMode;
varying vec2 vUv;varying vec2 vProjectedUv;varying float vBend;varying float vDistance;
${openingTear}
void main(){vUv=uv;vProjectedUv=uv;vec3 p=vec3(position.x*uWidth,position.y*uHeight,position.z);vec2 n=uMode>2.5?normalize(vec2(.72,-.69)):uMode<.5?normalize(vec2(.62,.785)):normalize(vec2(-.64,.77));
float extent=uMode<.5?uHeight*.32:(uWidth+uHeight)*.48;
float origin=uMode<.5?-uHeight*.178:-uWidth*.32-uHeight*.385-2.;
if(uMode>.5)extent=uWidth*.32+uHeight*.077+min(uWidth,uHeight)*.15*3.14159265;
if(uMode>2.5){origin=-uWidth*.35-uHeight*.34;extent=uWidth*.23-uHeight*.10;}
if(uMode<-.5){float a=.1570796327;n=normalize(vec2(.62*cos(a)+.785*sin(a),-.62*sin(a)+.785*cos(a)));origin=-dot(abs(n),vec2(uWidth,uHeight)*.5)-1.;extent=-origin+uWidth*.15;}
float axis=mix(origin,extent,uProgress);float d=axis-dot(p.xy,n);if(uMode>2.5)d+=tearRoughness(uv);
float radius=uMode>2.5?uWidth*.035:uMode<.5?uWidth*.045:min(uWidth,uHeight)*.15;
vDistance=d;vBend=0.;
if(uMode>2.5&&uMode<3.5){
float release=smoothstep(uv.x*.65,uv.x*.65+.45,uProgress);
float angle=release*2.8;float hinge=uHeight*.16;float dy=p.y-hinge;
p.y=hinge+dy*cos(angle);p.z=dy*sin(angle);p.x+=release*dy*.12;vBend=angle;vProjectedUv=vec2(p.x/uWidth+.5,p.y/uHeight+.5);
gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);return;}
if(uMode>3.5){gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);return;}if(uMode>1.5&&uMode<2.5){
float edge=.60+.22*(uv.x-.5)+.007*sin(uv.x*43.)+.003*sin(uv.x*139.)+.0015*sin(uv.x*367.);
vDistance=axis-dot(vec2(p.x,(edge-.5)*uHeight),n);
gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);return;}
if(d>0.){float theta=min(d/radius,3.14159265);float q=-radius*sin(theta);float z=radius*(1.-cos(theta));if(d>3.14159265*radius)q=d-3.14159265*radius;p.xy+=n*(d+q);p.z+=z;vBend=theta;}
gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const fragment=`
uniform sampler2D uTorn;uniform sampler2D uSilhouette;uniform sampler2D uPortrait;uniform sampler2D uSurprise;uniform sampler2D uFiber;
uniform float uExpression;uniform float uProgress;uniform float uWidth;uniform float uHeight;uniform float uMode;uniform vec3 uColor;uniform vec3 uIntactColor;uniform vec3 uGradeGain;uniform vec3 uGradeBias;
varying vec2 vUv;varying vec2 vProjectedUv;varying float vBend;varying float vDistance;
float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float tearY(float x){return .60+.22*(x-.5)+.007*sin(x*43.)+.003*sin(x*139.)+.0015*sin(x*367.);}
vec3 paperAt(vec2 uv,float grain){vec4 fiber=texture2D(uFiber,vec2(uv.x,.50-.15*sin(uv.x*3.14159265)));return mix(vec3(.97,.955,.925),fiber.rgb,fiber.a*.55)+(grain-.5)*.012;}
vec4 portraitAt(vec2 uv){return uExpression>.5?texture2D(uSurprise,uv):texture2D(uTorn,uv);}
float alphaAt(vec2 uv){return portraitAt(uv).a*texture2D(uSilhouette,uv).a;}
${openingTear}
float openingDistance(vec2 uv){vec2 n=normalize(vec2(.72,-.69));float origin=-uWidth*.35-uHeight*.34;float end=uWidth*.23-uHeight*.10;return mix(origin,end,uProgress)-dot((uv-.5)*vec2(uWidth,uHeight),n)+tearRoughness(uv);}
vec4 openingAt(vec2 uv){vec4 intact=texture2D(uPortrait,uv);vec4 torn=texture2D(uTorn,uv);vec4 result=torn;result.a*=texture2D(uSilhouette,uv).a;return result;}
float openingAlpha(vec2 uv,float peeled){return mix(texture2D(uPortrait,uv).a,texture2D(uTorn,uv).a,peeled)*texture2D(uSilhouette,uv).a;}
float capAt(vec2 uv){return texture2D(uPortrait,uv).a*(1.-texture2D(uTorn,uv).a)*step(.62,uv.y);}
void main(){vec2 uv=vUv;float grain=noise(uv*1900.);float alpha=1.;vec3 col=uColor;
if(uMode>3.5){vec4 result=openingAt(uv);float outer=result.a;float peeled=1.;float r=${STICKER_BORDER.toFixed(1)}/1080.;
outer=max(outer,openingAlpha(uv+vec2(r,0.),peeled));outer=max(outer,openingAlpha(uv-vec2(r,0.),peeled));outer=max(outer,openingAlpha(uv+vec2(0.,r*.74),peeled));outer=max(outer,openingAlpha(uv-vec2(0.,r*.74),peeled));outer=max(outer,openingAlpha(uv+vec2(r*.7,r*.52),peeled));outer=max(outer,openingAlpha(uv-vec2(r*.7,r*.52),peeled));
alpha=outer;if(alpha<.02)discard;col=mix(vec3(.995,.98,.94),result.rgb,result.a);
}else if(uMode>2.5){if(vBend>.3&&texture2D(uTorn,vProjectedUv).a*texture2D(uSilhouette,vProjectedUv).a>.4)discard;vec4 photo=texture2D(uPortrait,uv);float original=capAt(uv);float outer=original;float r=${STICKER_BORDER.toFixed(1)}/1080.;
outer=max(outer,capAt(uv+vec2(r,0.)));outer=max(outer,capAt(uv-vec2(r,0.)));outer=max(outer,capAt(uv+vec2(0.,r*.74)));outer=max(outer,capAt(uv-vec2(0.,r*.74)));
alpha=outer;if(alpha<.02)discard;col=mix(vec3(.995,.98,.94),photo.rgb,photo.a);
}else if(uMode<.5){vec4 base=portraitAt(uv);float original=alphaAt(uv);float outer=original;float r=${STICKER_BORDER.toFixed(1)}/1080.;
outer=max(outer,alphaAt(uv+vec2(r,0.)));outer=max(outer,alphaAt(uv-vec2(r,0.)));outer=max(outer,alphaAt(uv+vec2(0.,r*.74)));outer=max(outer,alphaAt(uv-vec2(0.,r*.74)));outer=max(outer,alphaAt(uv+vec2(r*.7,r*.52)));outer=max(outer,alphaAt(uv-vec2(r*.7,r*.52)));
alpha=outer;if(alpha<.02)discard;
float faceX=1.-smoothstep(.18,.23,abs(uv.x-.515));float faceY=smoothstep(.32,.36,1.-uv.y)*(1.-smoothstep(.64,.67,1.-uv.y));float expression=uExpression;
col=clamp(base.rgb*uGradeGain+uGradeBias,0.,1.);col=mix(vec3(.995,.98,.94),col,original);

}else{
float signedEdge=uv.y-tearY(uv.x);float side=uMode>1.5?signedEdge:-signedEdge;
float reached=smoothstep(-5.,10.,vDistance);
float cutAlpha=smoothstep(-.0015,-.0003,side);
alpha=cutAlpha;if(alpha<.01)discard;

float rim=(1.-smoothstep(.002,.010,side))*reached;col=mix(col,paperAt(uv,grain),rim);
}
if(!gl_FrontFacing){float light=.82+.18*sin(vBend*.85);col=vec3(.99,.985,.965)*light+(grain-.5)*.014;}
else{float shade=uMode>3.5?1.:1.-.18*sin(vBend);float shadow=uMode<.5&&vDistance<0.? .14*exp(vDistance/22.):0.;col*=shade-shadow;}
gl_FragColor=vec4(col,alpha);}`;
function CurlSurface({host,mode,onReady}){
 const material=useRef(),mesh=useRef(),underlay=useRef(),{size}=useThree();
 const [portrait,surprise,fiber,original,...frames]=useTexture([TORN_PORTRAIT,SURPRISE_TORN_PORTRAIT,'/portrait/paper/torn-fiber-v1.png',portraitAsset('center'),...gazeDirections.map(d=>portraitAsset(d)),...gazeDirections.map(d=>portraitAsset(d,true))]);const gazePhotos=frames.slice(0,8),tornPhotos=frames.slice(8);
 // This shader outputs photographic sRGB bytes directly, matching the SVG image.
 // Do not let texture sampling decode them to linear or tone-map the result.
 useMemo(()=>{for(const t of [portrait,surprise,fiber,original,...frames]){if(t.colorSpace!==THREE.NoColorSpace){t.colorSpace=THREE.NoColorSpace;t.needsUpdate=true}}},[portrait,surprise,fiber,original,...frames]);
 const silhouette=useMemo(()=>{const c=document.createElement('canvas');c.width=1080;c.height=1457;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,1080,1457);return new THREE.CanvasTexture(c)},[]);
 useEffect(()=>()=>silhouette.dispose(),[silhouette]);
 const uniforms=useMemo(()=>({uProgress:{value:0},uWidth:{value:1},uHeight:{value:1},uMode:{value:mode==='intro'?3:mode==='portrait'?0:1},uPortrait:{value:original},uTorn:{value:portrait},uSilhouette:{value:silhouette},uSurprise:{value:surprise},uFiber:{value:fiber},uExpression:{value:0},uGradeGain:{value:new THREE.Vector3(1,1,1)},uGradeBias:{value:new THREE.Vector3(0,0,0)},uIntactColor:{value:new THREE.Color('#62517d').convertLinearToSRGB()},uColor:{value:new THREE.Color('#62517d').convertLinearToSRGB()}}),[portrait,surprise,fiber,original,mode,silhouette]);
 const underUniforms=useMemo(()=>({...uniforms,uMode:{value:mode==='intro'?4:2},uColor:{value:new THREE.Color('#493b5a').convertLinearToSRGB()}}),[uniforms]);
 useEffect(()=>{onReady?.();return()=>{if(mode==='portrait'&&host.current)delete host.current.dataset.peelRenderer}},[host,mode,onReady]);
 useFrame(()=>{const element=host.current;if(!element||!mesh.current)return;const m=material.current.uniforms;
 if(mode==='portrait'||mode==='intro'){
  const box=element.querySelector('.person-cutout')?.getBoundingClientRect(),parent=element.querySelector('.hero-stage')?.getBoundingClientRect();if(!box||!parent)return;
  const h=Math.min(box.height,box.width*1457/1080),w=h*1080/1457;
  mesh.current.scale.set(1,1,1);mesh.current.position.set(box.x-parent.x+box.width/2-size.width/2,size.height/2-(box.y-parent.y+box.height-h/2),0);
  if(mode==='portrait'||mode==='intro'){const direction=element.querySelector('.person-cutout')?.dataset.gaze;m.uPortrait.value=gazePhotos[gazeDirections.indexOf(direction)]||original;m.uTorn.value=tornPhotos[gazeDirections.indexOf(direction)]||portrait;const grade=gradeFor(gazeDirections.includes(direction)?'/portrait/batch-v2/'+direction+'.png':'/portrait/batch-v2/center.png');m.uGradeGain.value.fromArray(grade.gain);m.uGradeBias.value.fromArray(grade.bias);}m.uWidth.value=w;m.uHeight.value=h;m.uProgress.value=Number(element.style.getPropertyValue('--head-peel'))||0;m.uExpression.value=element.querySelector('.person-cutout')?.dataset.expression==='surprised'?1:0;if(mode==='intro'){const progress=Number(element.style.getPropertyValue('--intro-tear'))||0;m.uProgress.value=progress;const lower=underlay.current;if(lower){lower.position.copy(mesh.current.position);lower.position.z=-1;lower.material.uniforms.uWidth.value=w;lower.material.uniforms.uHeight.value=h;lower.material.uniforms.uProgress.value=progress;lower.material.uniforms.uPortrait.value=m.uPortrait.value;lower.material.uniforms.uTorn.value=m.uTorn.value;}const exit=THREE.MathUtils.smoothstep(progress,.76,1);mesh.current.position.x+=exit*w*1.35;mesh.current.position.y-=exit*h*.70;}
 }else{
  const p=Number(element.style.getPropertyValue('--boundary-progress'))||0;m.uProgress.value=THREE.MathUtils.clamp((p-.15)/.65,0,1);m.uWidth.value=size.width;m.uHeight.value=size.height;mesh.current.scale.set(1,1,1);mesh.current.position.set(0,0,0);const light=document.documentElement.dataset.theme==='light';const statement=element.classList.contains('to-statement');m.uColor.value.set(statement?(light?'#ded0ee':'#493b5a'):(light?'#e9ddfb':'#62517d')).convertLinearToSRGB();const lower=underlay.current?.material?.uniforms;if(lower){lower.uIntactColor.value.copy(m.uColor.value);lower.uWidth.value=size.width;lower.uHeight.value=size.height;lower.uProgress.value=m.uProgress.value;lower.uColor.value.copy(m.uColor.value);const next=statement?(light?'#e9ddfb':'#62517d'):(light?'#ded0ee':'#493b5a');if(element.style.getPropertyValue('--paper-next')!==next)element.style.setProperty('--paper-next',next);}
 }
 });
 return <>{(mode==='section'||mode==='intro')&&<mesh ref={underlay} position={[0,0,-1]} renderOrder={0}><planeGeometry args={[1,1,150,180]}/><shaderMaterial uniforms={underUniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.DoubleSide} toneMapped={false} transparent depthWrite={false}/></mesh>}<mesh ref={mesh} renderOrder={1}><planeGeometry args={[1,1,150,180]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.DoubleSide} toneMapped={false} transparent depthWrite={false}/></mesh></>;
}
export default function PaperCurl({host,mode='portrait'}){
 const root=useRef(),[visible,setVisible]=useState(true),[ready,setReady]=useState(false);
 const markReady=React.useCallback(()=>{setReady(true);if(mode==='portrait'&&host.current)host.current.dataset.peelRenderer='ready'},[host,mode]);
 useEffect(()=>{const o=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'200px'});if(root.current)o.observe(root.current);return()=>o.disconnect()},[]);
 return <div ref={root} className={'paper-curl-canvas curl-'+mode+(ready?' curl-ready':'')} aria-hidden="true"><Canvas orthographic frameloop={visible?'always':'never'} dpr={[1,2]} camera={{position:[0,0,2000],zoom:1,near:.1,far:5000}} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}}><Suspense fallback={null}><CurlSurface host={host} mode={mode} onReady={markReady}/></Suspense></Canvas></div>;
}

// The Latest sticker uses the portrait's exact curl mesh, axis and scroll progress.
function LatestSurface({host,onReady}){
 const mesh=useRef(),{size}=useThree();
 const artwork=useTexture('/stickers/latest-film-renting-time.svg');
 const captionCanvas=useMemo(()=>{const c=document.createElement('canvas');c.width=720;c.height=680;return c},[]);
 const texture=useMemo(()=>{const t=new THREE.CanvasTexture(captionCanvas);t.colorSpace=THREE.NoColorSpace;return t},[captionCanvas]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 const uniforms=useMemo(()=>({uProgress:{value:0},uWidth:{value:1},uHeight:{value:1},uMode:{value:-1},uMap:{value:texture}}),[texture]);
 useEffect(()=>{onReady()},[onReady]);
 useFrame(()=>{const hero=host.current,card=hero?.querySelector('.latest-note'),stage=hero?.querySelector('.hero-stage');if(!mesh.current||!card||!stage)return;const b=card.getBoundingClientRect(),s=stage.getBoundingClientRect(),p=Number(hero.style.getPropertyValue('--head-peel'))||0;const ctx=captionCanvas.getContext('2d');ctx.clearRect(0,0,720,680);ctx.drawImage(artwork.image,0,0,720,680);ctx.font='32px Arial';const caption='RENTING TIME · AI SHORT FILM · ',run=ctx.measureText(caption).width,shift=(performance.now()*.035)%run;card.style.setProperty('--caption-shift',(-shift*card.offsetWidth/720)+'px');ctx.save();ctx.beginPath();ctx.rect(0,112,720,64);ctx.clip();ctx.fillStyle='#fff9ee';for(let x=-shift;x<720;x+=run)ctx.fillText(caption,x,156);ctx.restore();texture.needsUpdate=true;mesh.current.visible=p>.002&&p<1;const m=mesh.current.material.uniforms;m.uProgress.value=p;m.uWidth.value=card.offsetWidth;m.uHeight.value=card.offsetHeight;mesh.current.position.set(b.x-s.x+b.width/2-size.width/2,size.height/2-(b.y-s.y+b.height/2),1);mesh.current.rotation.z=9*Math.PI/180;});
 return <mesh ref={mesh} frustumCulled={false}><planeGeometry args={[1,1,120,140]}/><shaderMaterial vertexShader={vertex} fragmentShader={`uniform sampler2D uMap;varying vec2 vUv;varying float vBend;void main(){vec4 c=texture2D(uMap,vUv);if(c.a<.02)discard;if(!gl_FrontFacing)c.rgb=vec3(.99,.985,.965);c.rgb*=1.-.18*sin(vBend);gl_FragColor=c;}`} uniforms={uniforms} side={THREE.DoubleSide} toneMapped={false} transparent depthWrite={false}/></mesh>;
}
export function LatestCurl({host}){const [ready,setReady]=useState(false);const markReady=React.useCallback(()=>{setReady(true);if(host.current)host.current.dataset.latestRenderer='ready'},[host]);return <div className={'paper-curl-canvas curl-latest'+(ready?' curl-ready':'')} aria-hidden="true"><Canvas orthographic dpr={[1,2]} camera={{position:[0,0,2000],zoom:1,near:.1,far:5000}} gl={{alpha:true,antialias:true}}><LatestSurface host={host} onReady={markReady}/></Canvas></div>}

import * as THREE from 'three';
// Small original procedural textures: actual PBR surface detail, not a house image.
let cache;
export function houseMaterials(){
 if(cache)return cache;
 const texture=(kind)=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');let seed=719;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647};ctx.fillStyle='#888';ctx.fillRect(0,0,256,256);if(kind==='wood'){for(let i=0;i<260;i++){const y=rand()*256;ctx.strokeStyle=`rgba(${rand()>.5?'210,210,210':'35,35,35'},${.05+rand()*.2})`;ctx.lineWidth=.3+rand()*1.5;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<260;x+=8)ctx.lineTo(x,y+Math.sin(x*.035+i)*(.4+rand()*2));ctx.stroke()}}else{const pixels=ctx.getImageData(0,0,256,256);for(let i=0;i<pixels.data.length;i+=4){let n=kind==='stone'?100+rand()*70:120+rand()*25;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=255}ctx.putImageData(pixels,0,0)}const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='wood'?1.5:3,kind==='wood'?2:3);return t};
 const wood=texture('wood'),stone=texture('stone'),plaster=texture('plaster');
 const mat=(color,roughness=.8,extra={})=>new THREE.MeshStandardMaterial({color,roughness,...extra});
 cache={
  timber:mat('#a76c44',.65,{bumpMap:wood,bumpScale:.055}),cutWood:mat('#c18e63',.72,{bumpMap:wood,bumpScale:.035}),darkWood:mat('#735039',.7,{bumpMap:wood,bumpScale:.04}),
  plaster:mat('#ead9c5',.95,{bumpMap:plaster,bumpScale:.055}),stone:[mat('#d4bda8',.95,{bumpMap:stone,bumpScale:.045}),mat('#e5cfb7',.95,{bumpMap:stone,bumpScale:.045}),mat('#d9c0a9',.95,{bumpMap:stone,bumpScale:.045}),mat('#eddbc6',.95,{bumpMap:stone,bumpScale:.045})],
  roof:[mat('#8e74ab',.88,{bumpMap:stone,bumpScale:.023}),mat('#9c82b6',.83,{bumpMap:stone,bumpScale:.023}),mat('#947bad',.87,{bumpMap:stone,bumpScale:.023}),mat('#a38bb8',.88,{bumpMap:stone,bumpScale:.023})],
  roofTrim:mat('#85669e',.7),door:mat('#a989b7',.8,{bumpMap:wood,bumpScale:.03}),doorLight:mat('#b497bd',.8,{bumpMap:wood,bumpScale:.025}),
  brass:mat('#c18b3e',.28,{metalness:.82}),darkBrass:mat('#78522e',.33,{metalness:.78}),ivory:mat('#fff1d6',.83),leaf:mat('#78834c',.88),lightLeaf:mat('#9eaa67',.9),petal:mat('#fff5e6',.85),heart:mat('#dfb65f',.8),cloth:mat('#e8cfbc',1,{bumpMap:plaster,bumpScale:.018}),
  window:new THREE.MeshStandardMaterial({color:'#ffd18a',emissive:'#ffae3b',emissiveIntensity:1.5,roughness:.28}),ink:mat('#574032',.7),
 };return cache;
}

"""Package whole ImageGen photographs without compositing eyes, masks or seams."""
from pathlib import Path
from PIL import Image
import json,shutil,base64
import numpy as np
root=Path('public/portrait/whole-v11');meta=json.loads((root/'GENERATION.json').read_text())
for kind in ['full','torn']:
 (root/kind).mkdir(parents=True,exist_ok=True)
 for direction,source in meta[kind].items():
  shutil.copy2(source,root/kind/f'{direction}.png')
# Uniform canvas placement from the full master.
master=Image.open(root/'full/center.png').convert('RGBA');alpha=master.getchannel('A')
cols=[x for x in range(master.width)if sum(alpha.getpixel((x,y))>230 for y in range(master.height))>20]
rows=[y for y in range(master.height)if sum(alpha.getpixel((x,y))>230 for x in range(master.width))>20]
x0,x1,y0,y1=min(cols),max(cols)+1,min(rows),max(rows)+1
scale=min(555/(x1-x0),885/(y1-y0));tx=512.5-(x0+x1)/2*scale;ty=115-y0*scale
# Align complete photographs by nose, mouth and jaw; never stretch or composite.
registrations={}
for source in sorted((root/'torn').glob('*.png')):
 full=np.asarray(master,dtype=float);torn=np.asarray(Image.open(source).convert('RGBA'),dtype=float)
 aq=torn[:,:,3]>230;cs=np.flatnonzero(aq.sum(0)>30);rs=np.flatnonzero(aq.sum(1)>30)
 k=(x1-x0)/(cs.max()-cs.min()+1);dx=(x0+x1)/2-(cs.min()+cs.max())/2*k;dy=y1-(rs.max()+1)*k
 gy,gx=np.mgrid[770:1070:4,320:820:4];valid=full[gy,gx,3]>240
 if source.stem=='surprise':valid &= gy<910
 gx,gy=gx[valid],gy[valid];target=full[gy,gx,:3]
 def loss(p):
  ix=np.clip(np.rint((gx-p[1])/p[0]).astype(int),0,torn.shape[1]-1);iy=np.clip(np.rint((gy-p[2])/p[0]).astype(int),0,torn.shape[0]-1)
  v=torn[iy,ix];delta=(v[:,:3]-target)/255
  return float(np.minimum(delta*delta,.04).mean()+np.maximum(0,240-v[:,3]).mean()/255*.1)
 params=np.array([k,dx,dy]);initial=loss(params)
 for ss,ps in [(.02,10),(.006,3),(.002,1),(.0005,.3)]:
  for iteration in range(24):
   candidates=[params]
   for axis,step in enumerate([ss,ps,ps]):
    for sign in [-1,1]:
     p=params.copy();p[axis]+=sign*step
     if axis==0:
      p[1]=550-(550-params[1])*p[0]/params[0];p[2]=930-(930-params[2])*p[0]/params[0]
     candidates.append(p)
   best=min(candidates,key=loss)
   if np.array_equal(best,params):break
   params=best
 registrations['torn/'+source.stem]=tuple(map(float,params));print(source.stem, 'uniform registration',registrations['torn/'+source.stem],'fit',round(loss(params),6))
for kind in ['full','torn']:
 for file in sorted((root/kind).glob('*.png')):
  with Image.open(file) as photo:w,h=photo.size
  data=base64.b64encode(file.read_bytes()).decode()
  k,dx,dy=registrations.get(kind+'/'+file.stem,(1.,0.,0.));fs=scale*k;fx=tx+scale*dx;fy=ty+scale*dy
  file.with_suffix('.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1457" viewBox="0 0 1080 1457"><image href="data:image/png;base64,{data}" width="{w}" height="{h}" transform="matrix({fs} 0 0 {fs} {fx} {fy})"/></svg>')
(root/'placement.json').write_text(json.dumps({'scale':scale,'translation':[tx,ty],'aspectRatioPreserved':True,'frameRegistration':registrations,'wholeImageOnly':True,'eyeMasks':False,'separateTearLine':False},indent=2))
print('Packaged full photographs as complete, aspect-preserving photographs:',scale,tx,ty)

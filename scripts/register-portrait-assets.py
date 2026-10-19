"""Measure alpha and write SVG placement wrappers; never resample photo pixels."""
from PIL import Image
from pathlib import Path
import base64,json
import numpy as np
root=Path('public/portrait/final-v3')
transforms={}
clean='<filter id="clean-edge" x="-5%" y="-5%" width="110%" height="110%"><feMorphology in="SourceAlpha" operator="erode" radius="2.5" result="core"/><feMorphology in="core" operator="dilate" radius="2.5" result="clean"/><feComposite in="SourceGraphic" in2="clean" operator="in"/></filter>'
for direction in ['center','n','ne','e','se','s','sw','w','nw','surprise']:
 file=root/('surprise.png' if direction=='surprise' else 'full/'+direction+'.png')
 im=Image.open(file).convert('RGBA');alpha=im.getchannel('A');mask=alpha.point(lambda x:255 if x>230 else 0)
 cols=[x for x in range(im.width)if sum(mask.getpixel((x,y))>0 for y in range(im.height))>15]
 rows=[y for y in range(im.height)if sum(mask.getpixel((x,y))>0 for x in range(im.width))>15]
 x0,y0,x1,y1=min(cols),min(rows),max(cols)+1,max(rows)+1
 sx=sy=min(555/(x1-x0),885/(y1-y0));tx=512.5-(x0+x1)*.5*sx;ty=115-y0*sy
 # Register stable facial texture rather than the changing hair/neck silhouette.
 # Analysis samples only; embedded source pixels remain untouched.
 pixels=np.asarray(im,dtype=np.float32)
 if direction=='center':
  grid_y,grid_x=np.mgrid[430:880:4,325:705:4]
  # Eyes and mouth change intentionally; fit nose, cheeks, jaw and forehead.
  stable=~(((grid_y<570)&(grid_y>465))|((grid_y>725)&(grid_y<790)))
  gx,gy=grid_x[stable],grid_y[stable]
  def sample(image,scale,x,y):
   ix=np.clip(np.rint((gx-x)/scale).astype(int),0,image.shape[1]-1)
   iy=np.clip(np.rint((gy-y)/scale).astype(int),0,image.shape[0]-1)
   return image[iy,ix]
  target=sample(pixels,sx,tx,ty)
 else:
  def loss(params):
   v=sample(pixels,*params)
   # Robust color error keeps gaze and expression changes from dominating alignment.
   delta=(v[:,:3]-target[:,:3])/255
   return float(np.mean(np.minimum(delta*delta,.035))+np.mean(np.abs(v[:,3]-target[:,3]))/255*.12)
  params=np.array([sx,tx,ty]);before=loss(params)
  for scale_step,shift_step in [(.018,10),(.008,4),(.003,1.5),(.001,.5)]:
   for iteration in range(12):
    candidates=[params]
    for axis,step in enumerate([scale_step,shift_step,shift_step]):
     for sign in [-1,1]:
      q=params.copy();q[axis]+=sign*step
      if axis==0:
       # Scale about the face center instead of the canvas origin.
       q[1]=515-(515-params[1])*q[0]/params[0]
       q[2]=650-(650-params[2])*q[0]/params[0]
      candidates.append(q)
    best=min(candidates,key=loss)
    if np.array_equal(best,params):break
    params=best
  sx,tx,ty=map(float,params);sy=sx
  print(direction,'face registration',round(before,5),'→',round(loss(params),5))
 transforms[direction]=[sx,sy,tx,ty]
 for kind in (['surprise'] if direction=='surprise' else ['full','torn']):
  source=root/('surprise.png' if kind=='surprise' else kind+'/'+direction+'.png')
  with Image.open(source)as picture:w,h=picture.size
  data=base64.b64encode(source.read_bytes()).decode()
  overlay=''
  if kind=='torn':
   # Preserve the complete paired photo's face RGB below the new generated fiber edge.
   torn=Image.open(source).convert('RGBA').resize(im.size)
   a=torn.getchannel('A');points=[]
   for x in range(0,im.width,6):
    top=None
    for y in range(im.height-24):
     if a.getpixel((x,y))>180 and all(a.getpixel((x,y+k))>160 for k in (4,12,20)):
      top=y+14;break
    if top is not None:points.append((x,top))
   if points:
    pts=' '.join(f'{x},{y}'for x,y in points)+f' {points[-1][0]},{im.height} {points[0][0]},{im.height}'
    original=base64.b64encode(file.read_bytes()).decode()
    overlay=f'<defs><clipPath id="face-color"><polygon points="{pts}"/></clipPath><mask id="torn-alpha" mask-type="alpha"><image width="{im.width}" height="{im.height}" href="data:image/png;base64,{data}"/></mask></defs><g mask="url(#torn-alpha)"><image width="{im.width}" height="{im.height}" href="data:image/png;base64,{original}" clip-path="url(#face-color)"/></g>'
  dest=source.with_suffix('.svg')
  dest.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1457" viewBox="0 0 1080 1457"><defs>{clean}</defs><g filter="url(#clean-edge)" transform="matrix({sx} 0 0 {sy} {tx} {ty})"><image width="{w}" height="{h}" href="data:image/png;base64,{data}"/>{overlay}</g></svg>')
(root/'registration.json').write_text(json.dumps(transforms,indent=2))
print('Registered eight complete/torn pairs and surprise with common white-border framing.')
# Each torn image carries its own photographic silhouette and fiber edge.
# Register each full photograph as a single unit; never add an independent seam.
for direction in ['center','n','ne','e','se','s','sw','w','nw','surprise']:
 source=root/'torn'/f'{direction}.png'
 image=Image.open(source).convert('RGBA');pixels=np.asarray(image,dtype=np.float32)
 gx0,gy0=gx.copy(),gy.copy();target0=target.copy()
 keep=gy>570;gx,gy=gx[keep],gy[keep];target=target[keep]
 sx,_,tx,ty=transforms[direction];params=np.array([sx,tx,ty])
 def loss_torn(params):
  v=sample(pixels,*params);delta=(v[:,:3]-target[:,:3])/255
  return float(np.mean(np.minimum(delta*delta,.035))+np.mean(np.abs(v[:,3]-target[:,3]))/255*.12)
 for scale_step,shift_step in [(.012,6),(.004,2),(.001,.5)]:
  for iteration in range(12):
   candidates=[params]
   for axis,step in enumerate([scale_step,shift_step,shift_step]):
    for sign in [-1,1]:
     q=params.copy();q[axis]+=sign*step
     if axis==0:
      q[1]=515-(515-params[1])*q[0]/params[0];q[2]=650-(650-params[2])*q[0]/params[0]
     candidates.append(q)
   best=min(candidates,key=loss_torn)
   if np.array_equal(best,params):break
   params=best
 sx,tx,ty=map(float,params);gx,gy,target=gx0,gy0,target0
 data=base64.b64encode(source.read_bytes()).decode();w,h=image.size
 source.with_suffix('.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1457" viewBox="0 0 1080 1457"><defs>{clean}</defs><g filter="url(#clean-edge)" transform="matrix({sx} 0 0 {sx} {tx} {ty})"><image width="{w}" height="{h}" href="data:image/png;base64,{data}"/></g></svg>')
print('Every torn gaze now uses its own complete image, outline and tear edge.')

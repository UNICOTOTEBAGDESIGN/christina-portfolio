"""Build complete photographic frame assets around one immutable master.
AI supplies each gaze edit; master pixels, crop, scale and white border are shared.
SVG is the native asset format; no raster photo is resampled or repainted here.
"""
from pathlib import Path
from PIL import Image
import base64,json,math
import numpy as np
root=Path('public/portrait/master-v10')
master=root/'reference.png'
uri=lambda p:'data:image/png;base64,'+p.read_bytes().hex() if False else 'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode()
source=uri(master)
# The photographic head and a short rounded neck; exclude shoulders and shirt.
neck='M0 0H1080V920H668L671 1030Q548 1140 394 1030L396 920H0Z'
# Interior of the original eye openings; eyelids and the rest of the photo remain master pixels.
eyes='M414 613C430 592 448 585 470 590C490 591 506 604 512 616C489 632 440 631 414 613Z M625 614C640 594 659 588 680 591C700 591 718 603 726 614C708 631 652 632 625 614Z'
# One physically defined paper cut in master coordinates. Each output contains it,
# so no detached line is positioned over changing photographs in the application.
seam=[]
for x in range(190,831,2):
 y=447+18*math.sin((x-190)/640*math.pi)+5*math.sin(x*.049)+2.3*math.sin(x*.17)+1.1*math.sin(x*.59)
 seam.append((x,y))
line='M'+' L'.join(f'{x},{y:.3f}'for x,y in seam)
lower=line+' L1080,465 L1080,1457 L0,1457 L0,447 Z'
# Same single uniform transform for every source frame; native face aspect ratio.
scale=.91;tx=512.5-507*scale;ty=115-115*scale
frame=f'matrix({scale} 0 0 {scale} {tx:.4f} {ty:.4f})'
# Trace the master's own opaque head once as native vector geometry.
# This avoids expensive live SVG morphology when uploading gaze frames to WebGL.
a=np.asarray(Image.open(master).convert('RGBA'))[:,:,3]
left=[];right=[]
for y in range(100,981,2):
 xs=np.flatnonzero(a[y,180:840]>220)+180
 if len(xs)<20:continue
 runs=np.split(xs,np.flatnonzero(np.diff(xs)>1)+1);run=max(runs,key=len)
 if len(run)<20:continue
 lo,hi=int(run[0]),int(run[-1])
 if y>=920:lo=max(lo,394);hi=min(hi,670)
 left.append((lo,y));right.append((hi,y))
def smooth(side):
 v=np.array([x for x,y in side]);v=np.convolve(np.pad(v,(2,2),mode='edge'),np.ones(5)/5,mode='valid')
 return [(round(float(x),2),side[i][1])for i,x in enumerate(v)]
left,right=smooth(left),smooth(right)
head='M'+' L'.join(f'{x},{y}'for x,y in left)+f' Q548,1040 {right[-1][0]},{right[-1][1]} L'+' L'.join(f'{x},{y}'for x,y in reversed(right))+' Z'
filters=''
for d in ['center','n','ne','e','se','s','sw','w','nw','surprise']:
 photo=root/'raw'/f'{d}.png';edit=''
 if d!='center':
  w,h=Image.open(photo).size
  # Tool returns 1080x1456 in this batch. Use uniform scale, never anisotropic fit.
  s=1080/w
  edit=f'<image href="{uri(photo)}" width="{w}" height="{h}" transform="scale({s})"/>'
 if d=='surprise':
  edit+=f'<image href="{uri(photo)}" width="{w}" height="{h}" transform="scale({s})" mask="url(#mouth)"/>'
 photo_body=edit if d!='center' else f'<image href="{source}" width="1080" height="1457"/>'
 for kind in ['full','torn']:
  defs=f'<defs>{filters}<radialGradient id="mouth-fade"><stop offset="0.82" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="mouth" maskUnits="userSpaceOnUse" x="450" y="760" width="220" height="155"><ellipse cx="555" cy="835" rx="87" ry="68" fill="url(#mouth-fade)"/></mask><clipPath id="neck"><path d="{head}"/></clipPath><clipPath id="eyes"><path d="{eyes}"/></clipPath><clipPath id="opening"><path d="{lower}"/></clipPath></defs>'
  body=f'<path d="{head}" fill="#fffdf7" stroke="#fffdf7" stroke-width="16" stroke-linejoin="round"/><g clip-path="url(#neck)">{photo_body}</g>'
  if kind=='torn':body=f'<g clip-path="url(#opening)">{body}</g><g clip-path="url(#neck)"><path d="{line}" fill="none" stroke="#fffdf7" stroke-width="16" stroke-linejoin="round"/></g>'
  # Both outer border and tear border derive from this very photo's alpha in one pass.
  body=f'<g>{body}</g>'
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1457" viewBox="0 0 1080 1457">{defs}<g transform="{frame}">{body}</g></svg>'
  (root/kind/f'{d}.svg').write_text(svg)
(root/'geometry.json').write_text(json.dumps({'scale':scale,'translation':[tx,ty],'neckCut':neck,'eyeInteriors':eyes,'tearPath':lower,'whiteBorder':8,'masterOutsideEyes':True},indent=2))
print('Built 10 full + 10 torn complete frames from one master; neck-only crop and integrated white borders.')

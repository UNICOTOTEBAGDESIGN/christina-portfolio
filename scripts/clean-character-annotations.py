"""Remove background annotations by fitting adjacent paper colour; no generated art.
Original assets remain untouched. Character pixels are outside the edit rectangles.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1];out=root/'public/projects/rented-time'
manifest=json.loads((out/'asset-manifest.json').read_text())
paths={a['asset'].removesuffix('.webp'):a['source'] for a in manifest}
def paper(im,box):
 x0,y0,x1,y1=box
 arr=np.array(im).astype(float);h,w=arr.shape[:2]
 # Sample only a narrow, text-free border immediately around each annotation.
 xx,yy=np.meshgrid(np.arange(max(0,x0-5),min(w,x1+5)),np.arange(max(0,y0-5),min(h,y1+5)))
 border=(xx<x0)|(xx>=x1)|(yy<y0)|(yy>=y1)
 x=xx[border]/w;y=yy[border]/h
 A=np.column_stack([np.ones(len(x)),x,y,x*y,x*x,y*y])
 colors=arr[yy[border],xx[border]]
 fit=np.linalg.lstsq(A,colors,rcond=None)[0]
 xx,yy=np.meshgrid(np.arange(x0,x1)/w,np.arange(y0,y1)/h)
 B=np.stack([np.ones_like(xx),xx,yy,xx*yy,xx*xx,yy*yy],axis=-1)
 fill=np.clip(B@fit,0,255).astype('uint8');im.paste(Image.fromarray(fill),(x0,y0))
 return im
for age in [8,18,28,58,80]:
 name=f'age-{age}';im=Image.open(paths[name]).convert('RGB')
 if age in [18,58,80]:im=paper(im,(18,20,180,175))
 for box in [(200,945,410,1005),(680,945,895,1005),(1160,945,1515,1023)]:im=paper(im,box)
 im.save(out/f'{name}-clean.webp','WEBP',quality=91,method=6)
 im.crop((35,15,565,930)).save(out/f'{name}-front-clean.webp','WEBP',quality=91,method=6)
for name,boxes in {
 'rabbit':[(20,10,225,180),(1230,165,1460,260),(1225,275,1328,635),(1210,720,1510,910),(160,760,300,855),(585,760,720,855),(960,760,1100,855)],
 'shop-assistant':[(10,10,215,125),(280,945,425,1000),(735,945,900,1000),(1200,945,1350,1000)]
}.items():
 im=Image.open(paths[name]).convert('RGB')
 for box in boxes:im=paper(im,box)
 im.save(out/f'{name}-clean.webp','WEBP',quality=91,method=6)
print('Clean derivatives saved; original sheets retained.')
# Pocket-watch captions occupy the two neutral gutters. Keep dial numerals.
im=Image.open(paths['pocket-watch']).convert('RGB')
for box in [(0,544,1536,600),(0,950,1536,1010)]:im=paper(im,box)
# Clone neighbouring metal texture over the small inscription, with soft edges.
from PIL import ImageFilter,ImageDraw
box=(1000,735,1140,830)
patch=im.crop((978,650,1118,745))
mask=Image.new('L',patch.size,0);ImageDraw.Draw(mask).rectangle((6,6,patch.width-7,patch.height-7),fill=255);mask=mask.filter(ImageFilter.GaussianBlur(4))
im.paste(patch,(box[0],box[1]),mask)
im.save(out/'pocket-watch-clean.webp','WEBP',quality=92,method=6)

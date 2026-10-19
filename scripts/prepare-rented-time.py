"""Deterministic derivatives of user-supplied art; never modifies source files."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
sources=[Path('/Users/christinahuang/Desktop')/folder for folder in ['电影画面','女孩8-80','其他人+道具']]
files=[str(p) for folder in sources for p in sorted(folder.glob('*.png'))]
out=root/'public/projects/rented-time'; out.mkdir(parents=True,exist_ok=True)
names=['shadow-alley','mirror','schoolwork','aging','watch-intact','watch-broken','banknote-step','elderly-rabbit','rabbit-banknote','age-18','age-58','age-80','age-8','age-28','banknote','fairy','rabbit','shop-assistant','pocket-watch','shopkeeper','older-shopkeeper','pink-bicycle']
manifest=[]
for i,(file,name) in enumerate(zip(files,names)):
 im=Image.open(file).convert('RGB'); size=im.size
 im.thumbnail((2200,1500)); im.save(out/(name+'.webp'),'WEBP',quality=88,method=6)
 if i>=9 and i<=13:
  # The front-facing figure occupies the left third. Keep the warm paper ground;
  # transparent masking would damage hair, soft edges, and clay textures.
  original=Image.open(file).convert('RGB')
  crop=original.crop((35,15,565,930))
  crop.save(out/(name+'-front.webp'),'WEBP',quality=90,method=6)
 manifest.append({'source':file,'asset':name+'.webp','originalSize':size,'kind':'film-still' if i<9 else 'design-sheet','processing':'Proportional WebP; full artwork retained'})
im=Image.open('/Users/christinahuang/Desktop/海报2.png').convert('RGB'); size=im.size
im.thumbnail((1600,2400)); im.save(out/'poster.webp','WEBP',quality=91,method=6)
manifest.append({'source':'/Users/christinahuang/Desktop/海报2.png','asset':'poster.webp','originalSize':size,'kind':'poster','processing':'Full poster; no crop'})
(out/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Prepared',len(manifest),'original artworks and five front-view crops.')

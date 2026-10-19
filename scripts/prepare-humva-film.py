from pathlib import Path
from PIL import Image
import json,shutil
root=Path(__file__).resolve().parents[1];out=root/'public/projects/humva-film';out.mkdir(exist_ok=True,parents=True)
inputs=['/Users/christinahuang/Desktop/老鼠素材/Gemini_Generated_Image_665qq9665qq9665q.png', '/Users/christinahuang/Desktop/老鼠素材/Gemini_Generated_Image_oohmf0oohmf0oohm.png', '/Users/christinahuang/Desktop/老鼠素材/Gemini_Generated_Image_t3d6nqt3d6nqt3d6.png', '/Users/christinahuang/Desktop/老鼠素材/Gemini_Generated_Image_ow7s49ow7s49ow7s.png', '/Users/christinahuang/Desktop/老鼠素材/1.png', '/Users/christinahuang/Desktop/截屏2026-10-17 19.39.02.png', '/Users/christinahuang/Desktop/截屏2026-10-17 19.39.14.png', '/Users/christinahuang/Desktop/截屏2026-10-17 19.39.25.png'];manifest=[]
def save(path,name,box=None):
 im=Image.open(path).convert('RGB');original=im.size
 if box:im=im.crop(box)
 size=im.size;im.thumbnail((2200,1600));im.save(out/(name+'.webp'),'WEBP',quality=89,method=6)
 manifest.append(dict(source=str(path),asset=name+'.webp',originalSize=original,crop=box,displaySize=size))
for i,file in enumerate(inputs[:5]):
 im=Image.open(file);w,h=im.size
 box=(0,0,w,h-100) if Path(file).name=='1.png' else None
 save(file,f'experiment-{i+1}',box)
# Work only on derivatives, excluding the dock and stray UI at the lower edges.
for i,name in [(5,'final-computer'),(6,'final-young-man'),(7,'final-hamster')]:
 im=Image.open(inputs[i]);w,h=im.size
 bottom=h-200 if i==6 else h-150 if i==7 else h-115
 save(inputs[i],name,(0,0,w,bottom))
 # Portrait crops retain the actual scene background and all facial features.
 if i==5:box=(int(w*.35),int(h*.10),int(w*.70),int(h*.68))
 elif i==6:box=(int(w*.10),int(h*.035),int(w*.77),int(h*.86))
 else:box=(int(w*.18),int(h*.14),int(w*.77),int(h*.83))
 save(inputs[i],name+'-portrait',box)
for i,p in enumerate(sorted(Path('/Users/christinahuang/Desktop/老鼠素材').glob('*.mp4'))):
 shutil.copy2(p,out/f'experiment-video-{i+1}.mp4');manifest.append(dict(source=str(p),asset=f'experiment-video-{i+1}.mp4',kind='early demo; not final film'))
(out/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print([(a['asset'],a.get('originalSize')) for a in manifest])

"""Delete the retired project artwork explicitly requested by the user."""
from pathlib import Path
import shutil,json
root=Path.cwd();portrait=root/'public/portrait';keep={'final-v3','manicure','paper'};removed=[]
for path in portrait.iterdir():
 if path.name in keep:continue
 removed.append(str(path.relative_to(root)))
 if path.is_dir():shutil.rmtree(path)
 else:path.unlink()
for folder,filename in [('manicure','point-up.png'),('paper','torn-fiber-v1.png')]:
 for path in (portrait/folder).iterdir():
  if path.name==filename:continue
  removed.append(str(path.relative_to(root)));path.unlink()
art=root/'public/art'
if art.exists():removed.append('public/art');shutil.rmtree(art)
for folder in [root/'tests',root/'tmp']:
 for path in folder.rglob('*'):
  if path.is_file() and path.suffix.lower()in {'.png','.jpg','.jpeg','.webp'} and not path.name.startswith('final-v3-'):
   removed.append(str(path.relative_to(root)));path.unlink()
(portrait/'final-v3/removed-assets.json').write_text(json.dumps(removed,indent=2))
print('Removed',len(removed),'retired asset paths; kept final-v3, active hand and paper fiber.')

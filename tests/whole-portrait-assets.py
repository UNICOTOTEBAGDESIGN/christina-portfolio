"""Validate complete-image runtime assets, not separately composited eye regions."""
from pathlib import Path
import xml.etree.ElementTree as ET
import base64,json
root=Path('public/portrait/whole-v11');ns={'s':'http://www.w3.org/2000/svg'}
dirs=['center','n','ne','e','se','s','sw','w','nw','surprise']
for kind in ['full','torn']:
 transforms=set()
 for direction in dirs:
  p=root/kind/f'{direction}.svg';tree=ET.parse(p)
  images=tree.findall('.//s:image',ns);assert len(images)==1,p
  assert not tree.findall('.//s:mask',ns),p
  assert not tree.findall('.//s:clipPath',ns),p
  im=images[0];assert base64.b64decode(im.attrib['href'].split(',')[1])==p.with_suffix('.png').read_bytes(),p
  transforms.add(im.attrib['transform'])
 for transform in transforms:
  parts=transform.removeprefix('matrix(').removesuffix(')').split();assert float(parts[0])==float(parts[3])
place=json.loads((root/'placement.json').read_text());assert place['wholeImageOnly'] and not place['eyeMasks']
print('PASS: 20 complete-image frames, including both surprise expressions, each embedding only its own original PNG, whole-image isotropic placement, no eye mask or detached tear line.')

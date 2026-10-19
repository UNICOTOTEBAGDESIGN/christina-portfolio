const base='/projects/humva-film/';
const image=(id,title,caption='',width=2200,height=1400)=>({id,src:base+id+'.webp',title,caption,width,height,type:'image'});
export const humvaChapters=[['opening','Opening'],['background','Project Background'],['screening','Watch the Film'],['characters','Concept & Characters'],['development','Visual Development'],['experiments','Early Experiments'],['reflection','Reflection']];
export const humvaFinals=[
 image('final-computer','A screen with a face','Cool blue light and an expressive vintage monitor make a familiar desk feel alive.',2866,1505),
 image('final-hamster','A warmer moment','Golden light, soft fur and a playful expression bring warmth to the product story.',2026,1242),
 image('final-young-man','A human expression','The young male character connects the stylized visual world to a recognisable human emotion.',1306,1388)
];
export const humvaCharacters=[
 image('final-hamster-portrait','The hamster','Soft textures and a clear, playful expression.',1195,961),
 image('final-computer-portrait','The vintage computer','A simple screen becomes an expressive character.',1003,940),
 image('final-young-man-portrait','The young man','Facial expression carries the emotional beat.',875,1311)
];
export const humvaExperiments=Array.from({length:3},(_,i)=>image('experiment-'+(i+1),`Unused visual study ${i+1}`,'Early exploration · not a final-film scene'));
export const humvaDemoVideos=[
 {id:'experiment-video-1',type:'video',src:base+'experiment-video-1.mp4',poster:base+'experiment-video-1-poster.webp',title:'Hamster Meets Humva on a Snowy Night',caption:'Unused 8-second demo · an early visual experiment.'},
 {id:'experiment-video-2',type:'video',src:base+'experiment-video-2.mp4',poster:base+'experiment-video-2-poster.webp',title:'Hamster’s Digital Encounter',caption:'Unused 8-second demo · an early visual experiment.'}
];
export const humvaOfficialFilm={url:'https://www.youtube.com/watch?v=qfwh876R8zc',embed:'https://www.youtube-nocookie.com/embed/qfwh876R8zc?rel=0'};

export const humvaProductContext=image('humva-studio-context','Humva.Studio — product context','Product image supplied for context; shown separately from the animation.',2870,1210);
export const humvaReferenceCharacters=[
 {...image('references/hamster-reference','The hamster','Soft textures and a playful expression.',1122,1402),type:'image',provenance:'supplemental'},
 {...image('references/computer-reference','The vintage computer','A cyan screen and pixel expressions.',1122,1402),type:'image',provenance:'supplemental'},
 {...image('references/young-man-reference','The young man','Gray hoodie, backpack and a restrained expression.',1122,1402),type:'image',provenance:'supplemental'}
];

export const humvaReferenceSheets=[
 {...image('references/computer-expressions','Computer expression studies','Six supplemental AI-generated expressions, prepared from the final-film character.',1536,1024),provenance:'supplemental'},
 {...image('references/hamster-variations','Hamster pose & expression studies','Six supplemental AI-generated variations, prepared from the final-film character.',1536,1024),provenance:'supplemental'}
];

export const humvaStoryFrames=[
 image('story-office','An ordinary desk, an urgent task','The wide office composition places the worker within rows of quiet cubicles. A small pool of desk light draws attention to him, grounding the last-minute assignment in a familiar working environment.',2844,1156),
 image('story-interaction','Pressure becomes a conversation','The hamster’s raised paw and the computer’s worried expression turn the work problem into a character exchange. Gesture and eye lines make the tension readable without a lengthy explanation.',2868,1174),
 image('story-city','From the desk to the city','The worker looks up at Humva on a large city screen. The shift from an enclosed office to an open urban view gives the product reveal a larger visual scale and connects it back to the person who needs it.',2862,1523)
];

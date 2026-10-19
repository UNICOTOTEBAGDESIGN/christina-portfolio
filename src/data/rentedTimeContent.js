const base='/projects/rented-time/';
const art=(id,title,caption='')=>({id,src:base+id+((id.startsWith('age-')||['rabbit','shop-assistant','pocket-watch'].includes(id))?'-clean':'')+'.webp',title,caption,width:id==='poster'?1024:id.startsWith('age-')||['rabbit','fairy','shop-assistant','shopkeeper','older-shopkeeper','pocket-watch','banknote','pink-bicycle'].includes(id)?1536:2870,height:id==='poster'?1536:id.startsWith('age-')||['rabbit','fairy','shop-assistant','shopkeeper','older-shopkeeper','pocket-watch','banknote','pink-bicycle'].includes(id)?1024:1226});
export const filmPoster=art('poster','Renting Time — original film poster');
export const filmUrl='https://www.youtube.com/watch?v=j2dVorygG3I';
export const filmFrames=[
 art('shadow-alley','The shadow-theatre alley','An ordinary alley becomes a threshold into a world where time can be traded.'),
 art('mirror','An unfamiliar reflection','The mirror brings the wish to grow up face to face with its consequences.'),
 art('schoolwork','The weight of growing up','Schoolwork and a small companion hold the story close to everyday childhood.'),
 art('aging','A life passing','Repeated framing lets the changes in her face carry the passage of years.'),
 art('watch-intact','Time, still whole','A small, tangible object gives an invisible bargain its weight.'),
 art('watch-broken','Time, broken','The exposed mechanism turns the promise of control into something fragile.'),
 art('banknote-step','The price of a wish','A shoe and a banknote make the exchange physical: money against a lifetime.'),
 art('elderly-rabbit','What remains','At the end of a changing life, the rabbit becomes a quiet thread back to childhood.'),
 {...art('rabbit-banknote','The wish drifts away','A floating banknote and the rabbit bring the story’s symbols together.'),src:base+'rabbit-banknote-cropped.webp',width:2803,height:1094}
];
export const filmAges=[8,18,28,58,80].map(age=>({...art('age-'+age,`The girl at ${age} — original three-view sheet`),age,front:base+`age-${age}-front-clean.webp`}));
export const filmDesigns=[
 art('rabbit','The rabbit','A soft companion connecting the girl to childhood.'),
 art('fairy','The fairy','A storybook presence within the magical world.'),
 art('shop-assistant','The shop assistant'),
 art('shopkeeper','The shopkeeper'),
 art('older-shopkeeper','Additional shopkeeper design'),
 art('pocket-watch','The pocket watch','Time made tangible: a beautiful mechanism that cannot make a life reversible.'),
 art('banknote','The 100-yuan note','A small sum becomes the measure of an immeasurable loss.'),
 art('pink-bicycle','The pink bicycle','An everyday object that keeps the fantasy rooted in a remembered childhood.')
];

export const filmWorldFrame=art('birthday-tableau','A birthday in miniature','Warm candlelight and felt-like textures give a childhood celebration its storybook atmosphere.');

export const filmShadowFrame={...art('rabbit-shadow-window','A childhood in shadows','A rabbit watches a small scene unfold in the window: childhood becomes a memory framed in light.'),width:2580,height:875};

export const childhoodMemory={src:base+'childhood-film-web.mp4',poster:base+'childhood-film-thumb.webp',title:'A Little Piece of the Beginning',caption:'A glimpse of the film I made with friends during childhood.'};

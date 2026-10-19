# Christina — Interactive Portrait Portfolio

React + Vite 本地作品集。以 https://www.trevornoah.com/ 的头像开场、撕纸、立体物件、长页滚动和菜单呈现为参照，使用 Christina 的照片、美甲、CV 和紫色／奶黄色配色重新制作。房屋与角色已移出当前页面。

## 启动

```bash
npm install
npm run dev
```

当前运行地址：http://127.0.0.1:5174/#/home 。每次重新打开或刷新首页，自动完整播放一次；Replay intro 可手动重播。

```bash
npm run build
npm run test:reference
```

浏览器检查使用本机 Google Chrome，可通过 BASE_URL 修改测试地址。

## 交互和素材

- 首屏先留白，头像贴纸自动从底部升起、短暂停留、放大并自动撕去头顶，再显示姓名与 3D 相机、电脑、笔记本、手机、AI 立方体、电影板。物件可拖动和点击；键盘 Tab 也能访问对应入口。
- 眼神按鼠标所在八个方向切换真实生成眼部，保留原照片其余部分；自然眨眼，展开后点击脸部张嘴。
- 首页头像随滚动上移、张嘴、翻出白色纸背并离场；回滚时还原。About 露出完整脸部并支持点击张嘴。逐词滚动显现、作品拼贴、章节纸边与捏纸手势、个人介绍指向手势、全屏菜单。
- 八方向素材：`public/portrait/gaze/`，完整生成提示词和来源见 `GENERATION.json`。
- 用户美甲手势：`public/portrait/manicure/`，完整生成提示词和来源见 `GENERATION.json`。
- 头像、张嘴、闭眼及其历史提示词：`public/portrait/` 内 `PROMPT.md`、`ANIMATION_ASSETS.md`。
- 根据 CV 使用 AI 内容、跨语言传播、电影创作、交互设计和多伦多大学笔记本等个人物件。

## 修改位置

- `src/components/PortraitHome.jsx`：开场状态机、章节与路由入口。
- `src/components/PortraitFace.jsx`：八方向眼部软遮罩、眨眼和张嘴。
- `src/components/PersonalObjects.jsx`：独立程序化 Three.js 模型，可逐一换成自己的 GLB 模型；首页按需加载，DPR 上限 1.5。
- `src/motion/usePortfolioMotion.js`：滚动进度；`src/reference-motion.css`：本轮版式和动作覆盖。
- `src/data/portfolio.js`：真实 CV 经历、项目内容、封面与链接。
- `public/media/`：放真实作品封面，再填写数据中的 cover；当前未提供的作品媒体保留明确占位。
- `public/resume.pdf`：收到的 CV。

手机布局与系统减少动态效果已适配。完整项目内容及媒体仍需后续补充。这是对照原站重建的个性化 Demo，尚不能声称所有镜头、纸张曲面和物件物理均逐像素一致；原站专有模型未直接复制。当前使用真实 3D 几何物件、照片分层及自定义卷纸网格；开场撕顶保留独立的照片遮罩动画。旧房屋文件保留但不会加载。

`npm run test:scroll` 验证自动开场、滚动翻纸、完整 About 头像及手机布局。

## 表情与纸张（本轮更新）

- 表情素材由同一张照片编辑生成：微张嘴中间帧、O 形惊讶（睁眼抬眉）、思考（向上看、轻皱眉）。素材与完整提示词：`public/portrait/expressions/GENERATION.json`。
- 点击脸部在惊讶与思考之间轮换；About 的 “Hmm, what’s next?” 可直接触发思考。
- 表情使用 SVG 羽化遮罩、过渡帧和时间序列合成；不是视频文件，也不是直接瞬间替换整张脸。开合经过 anticipation → surprised → recover → neutral；思考保持约 3 秒再恢复。
- 实拍风格纸纤维贴图为生成素材：`public/portrait/paper/torn-fiber-v1.png`，提示词见同目录 `GENERATION.json`。曲线撕口与贴图一起调整，替换早期重复锯齿条。

## 按连续截图重做卷纸

`src/components/PaperCurl.jsx` 使用细分网格和圆柱弯曲的顶点着色器，固定未揭起的照片区域，让左下角逐渐卷向右上方；纸背为暖白材质，带曲面明暗与纸纤维。章节使用独立的右下角卷纸，露出下一章节的紫色底纸。滚动进度可逆，向上滚动会铺回纸面。离屏暂停渲染，系统减少动态效果时保留静态内容。

开场状态机只由页面进入或明确点击 Replay intro 启动，以单一单调时钟安排各阶段；滚动不会触发撕顶。开发热更新会按原时钟继续，不会重新从头安排一次。开场动画与滚动卷角分别控制。`npm run test:curl` 检查一次开场、回滚、章节卷纸、手机布局及头像／纸背在截图中的实际可见像素。

本轮按用户提供的九帧截图重新校对方向与时机，尚未声称原站所有材质及镜头逐像素一致。

Light Mode 已恢复在右上角太阳按钮，配色保存在 localStorage；浅色模式同步首页、正文、菜单和卷纸底色。章节卷走后保留不规则纸纤维撕痕。`npm run test:theme` 验证明暗切换、持久化及手机布局。

## 统一的生成头像贴图

首页展开后直接使用 `public/portrait/stickers/torn-head-registered-v2.png` 中已生成的真实纸纤维撕口，不再叠加独立纸条，也不在 GPU 中重新画另一个上沿。完整提示词见同目录 `GENERATION.json`。同一套原始五官坐标保留给眼神和表情；统一的下巴轮廓及图片路径由 `src/data/portraitGeometry.js` 定义，DOM 与卷曲网格共享。上半头发仅在开场完整头像与飞走纸片中显示。

图片容器按原始 1080:1457 比例排布，按眉眼位置定位；不同尺寸不再让 object-fit 的多余留白把脸推到屏幕下面。`npm run test:sticker` 检查 1440、800、390px 下的相同图片路径、坐标、无独立纸条以及卷纸显示。第一版重新取景的 `torn-head-v1.png` 保留为备选，当前首页不用它。

Section tear: both paper surfaces use the same `tearY` UV contour in `PaperCurl.jsx`. The stationary fiber edge is revealed by the moving fold distance, so intact areas show no advance tear mark. The exposed edge remains after the curl passes. `test:curl` checks rendered pixels before and during the tear, as well as reverse scrolling.

Opening cap: `PaperCurl` mode `intro` isolates the original photographic crown against the registered torn portrait, bends its geometry downward with a slight diagonal, shades the paper reverse, and releases it at the end of the single intro timeline. CSS no longer supplies a floating white strip or a moving horizontal crop. The section underlayer keeps a uniform next-section color below the tear rather than changing color along the curl diagonal.

All portrait states now use `STICKER_BORDER` in `src/data/portraitGeometry.js` (4 units in the shared 1080px image coordinates). Intact and torn SVGs and both WebGL portrait modes read this value; CSS halo stacking is disabled. The detached opening paper stays opaque and exits through motion, without opacity fading. Section tears use a stationary upper sheet and a curled lower sheet over the next background, rather than a separate rectangular color reveal.

Portrait color consistency: all intact, opening, curled, and finished portrait color pixels now come from `/portrait/christina-cutout-v1.png`. The generated torn portrait supplies only its alpha silhouette, not replacement face RGB. The opening tear lasts 1.8 seconds and the opaque detached piece moves beyond the viewport; there is no paper opacity fade.

Gaze consistency: neutral and eight directional states all sample the original portrait, shifted only within tight eye-aperture paths; generated gaze photos are no longer composited. `node tests/gaze-consistency.mjs` checks identical rendered skin pixels between neutral and side gaze with parallax held still. Opening now releases the connected cap from left to right through bending, with an overlap hiding the finished torn edge until the cap lifts; the temporary diagonal white cut line is removed.

Current gaze behavior (user preference): restore complete directional photos from `/portrait/gaze/{n,ne,e,se,s,sw,w,nw}.png`; center uses the original portrait. SVGs swap the whole photo, with the same overall head/tear silhouette and sticker border. No isolated eye patches or translated irises are used. `npm run test:gaze` verifies full-photo URLs, absence of eye patches, and the compact About layout at desktop/mobile. About spacing is reduced and the manicure hand is positioned next to the portrait, pointing toward its right cheek.

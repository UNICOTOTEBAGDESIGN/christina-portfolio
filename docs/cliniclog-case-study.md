# ClinicLog content outline and evidence

Primary source: owner-supplied CCT478 ClincLog app presentation.pdf, 13 pages. Original files unchanged. BlueDrift screenshots inspected as storytelling references only. Existing Humva/film-book layouts provide the editorial system.

## Seven chapters
1. Background: multilingual clinic communication, target audiences, CCT478, actual UX/UI contribution; real home screen, one prominent Figma access button. State prototype scope.
2. Research: two explicitly labeled datasets from p3; symptom difficulties 50/33.3/16.7, coping methods 50/25/15/5/5. No research sample size inferred. Unlabeled Yes/Maybe/No chart excluded. Pair evidence with design opportunities, not invented historical research.
3. IA/flow: original FigJam captured and cropped blank canvas only; expandable/pannable zoom, live source link. Simplified patient journey derived from PDF p4 and visible board. Four navigation destinations from p5.
4. Visual/accessibility: original pink/lavender/blue UI, actual extracted login/language/accessibility screens and components. VoiceOver/side-key voice mode described as a design proposal, not implemented OS support.
5. Three tasks: original extracted UI sequences from p8–10, no fake functioning software. Input/body map/record/QR; role/voice/bilingual chat; notes/English/Chinese summary. Screens click to enlarge at original aspect ratio.
6. Evaluation: p11 role-based walkthrough/interview/survey plan; p12 actual survey screenshots visibly show five replies, 3 patient/2 doctor role split. All five rated ease of use 5/5; clarity 2 at 4 and 3 at 5. Do not generalize to clinical accuracy. Three documented problems and proposed fixes; no unsupported before/after.
7. Outcome/reflection: high-fidelity Figma prototype, concise centered reflection and limitations/future priorities. Shared next-project footer retained.

## Access checked 2026-10-18
Figma Design LQCwQkA0SJfC72oDOiRRCy accessible in guest canvas: Page 1 / Ready for dev; layers include symptom intake, case page to qr code, doctor view chat, Task 2/3, generate, language, account settings, save/return, share. Present and Prototype view trigger Sign up for Figma; cannot execute/verify all prototype edges. No connected Figma MCP. Use supplied design URL rather than inventing a /proto start node.
FigJam H8VRDsX4G5WYxbpXpZgH6a accessible guest canvas: one page, login/account recovery/accessibility branches, three task routes, case creation/selection, language selection, symptom input/location/severity, QR/save/share, patient/doctor switch, chat and after-visit notes. Native source remains available for full-resolution inspection.

## Assets
case-study/*.webp are derivatives of embedded original PDF images, preserving original UI. user-flow.webp is an actual browser capture of supplied FigJam, blank/editor chrome cropped. No generated UI, personas, wireframes, feedback, videos or analytics. Existing legacy assets retained.

## Reading edit — 2026-10-18
Reorganized the visible page into background → research-based patient profile and pain/decision pairs → readable simplified flow → one composed three-screen overview → collapsible task sequences → concise testing → reflection. Supporting research, the original detailed flow, visual-system notes and evaluation evidence are collapsed by default. Persona explicitly synthesizes the documented Mandarin-speaking student scenario and audience; no invented name, photo, biography or interview quote. The main flow uses live readable text; the original board remains a supplementary expandable resource. Only one external prototype CTA remains in the opening.

## Feature emphasis requested by owner
PPT tasks are the main visual content: voice symptom entry, anatomical pain selection/severity, generated bilingual record/QR, same-patient-phone doctor/patient translation, and doctor-entered visit notes. Owner clarified paper handwriting photographed/uploaded to the patient's phone or direct typing on that phone; these are described as intended workflows, without invented handwriting-recognition performance. Existing screens show photo/voice/text controls.
Medical-code reference verified against CDC ICD-10-CM overview and CMS v38 Definitions Manual P1333: displayed M25.561 (CMS M25561) = Pain in right knee. Identify CM correctly as the US clinical modification, not an automatically validated diagnosis/translation. References are linked alongside the code explanation.

## Separate design page and evidence update
Added /projects/cliniclog-design as a scoped companion page, linked from the case study with a return link. Owner-supplied component screenshots provide five stacked case-card states and four navigation states, presented as selectable original images. Palette, buttons, login and accessibility concepts use the original project assets. No reconstruction is presented as the original Figma application.
Research now combines two switchable survey charts with three selectable original public-discussion excerpts extracted from the primary PDF. These are explicitly desk-research context, not participant interview quotes. No legal claims from the comments are asserted as verified policy. The unlabeled Yes/Maybe/No chart remains excluded.
Replaced the tall simplified box diagram with a three-stage interactive visit view, pairing concise routing decisions with actual prototype screens. Complete FigJam remains linked. The main introduction immediately identifies the app's purpose and intended users.
Owner-supplied 5.017-second skeleton MP4 copied unchanged as body-model-concept.mp4; poster generated from its frame at 1s. Video uses native controls, preload=none, no autoplay, and pauses on collapse. Identified as a rotation concept animation rather than a working 3D app.
Figma CTA updated to the exact newly supplied URL with m=dev and t parameter. Browser guest verification still resolved to the design canvas and Present triggered Sign up for Figma. No claim of verified guest prototype playback.
Validation: production build passed (638 modules; pre-existing Three.js chunk-size warning). Browser verified main/design route entry and return at scrollY=0; new exact Figma href; original case variants; navigation state selection; section scrolling without changing the hash route; survey/comment switching; visit-stage tabs and ArrowLeft/Right navigation; 390px and 1280px layouts without horizontal overflow. Native video played to 5.016667 seconds at 704×1248 and was paused on collapse. No browser console errors in the preview.


## Final visual refinement — October 18
- Rebuilt case stacks, navigation states, palette and button samples with HTML/CSS/SVG to remove enlarged raster component references.
- Added five-phone hero composition, phone frames for navigation and accessibility, and 2/2/3 related screens across visit stages.
- Promoted the FigJam link to a prominent interactive CTA. Moved the rotating-body concept into the visible symptom heading with viewport playback and a pause control.
- Removed repeated symptom screens from the QR disclosure; retained the sharing screen only.
- Fixed duplicate React sibling keys discovered during stage-switch QA; verified one active copy panel and three after-visit phones.
- Verified desktop composition, four native navigation comparisons, three framed accessibility screens, video playback/pause, and one QR sharing image. Both main and design routes have 390px content width at a 390px viewport.
- Production build passes; existing Three.js bundle size warning remains.

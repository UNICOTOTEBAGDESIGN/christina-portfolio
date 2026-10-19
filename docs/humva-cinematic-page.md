# Humva cinematic project page

Route: `#/projects/humva-pixar`. Dedicated HumvaFilmProject component; no changes to Renting Time, internship content, global navigation, or unrelated project data.

Seven scroll chapters with a persistent bottom chapter selector and previous/next controls: Opening, Project Background, Watch the Film, Creative Concept & Characters, Visual Development, Early Experiments, Reflection. Uses the portfolio's existing film editorial styles with scoped Humva additions.

## Content and sources
Inspected the existing published project and local `humvaFilmContent.js`. Retained AI video production, storyboarding, visual storytelling, narrative-led product promotion, Humva AI / RightBrain Tech attribution, and Pixar-inspired aesthetics. Avoided unsupported metrics, outcomes, or invented character biographies. Official film remains https://www.youtube.com/watch?v=qfwh876R8zc, loaded without autoplay in a 16:9 privacy-enhanced YouTube player.

No local original final-film video was found among the supplied files. Used the three supplied final screenshots, making three proportional character close-ups (six final-film derivatives in total). These are crop variants of three sources, not six distinct film moments. Mac Dock, tooltips and lower interface edges are cropped away; no characters are generated or redrawn. All source files remain unchanged.

Five supplied early visual tests and two 8-second MP4 demos remain distinct from final work in a closed-by-default archive. Demo thumbnails are extracted from each actual video at two seconds. The demo files are already web-playable MP4, so no re-encoding was necessary.

Assets: public/projects/humva-film/. Source/crop map: asset-manifest.json. Editable content: src/data/humvaCinematicContent.js. Processing: scripts/prepare-humva-film.py and scripts/prepare-humva-thumbnails.swift. Optimized WebP stills retain the scene backgrounds, natural framing and original lighting. Video controls, Escape, native modal focus containment, focus restoration, arrow-key image navigation and reduced-motion CSS are included.

## Verification
Production build passes. Browser: seven chapters present, archive closed initially; expanded gallery includes all five early images and two demos; image next navigation and Escape work. First demo loaded paused with controls and completed an eight-second playback; second demo loaded paused and native play started playback on a 390 × 844 viewport. No mobile page overflow, all seven navigation buttons fit. Video errors absent. Official embed uses qfwh876R8zc with no autoplay. Temporary viewport override reset.

## Owner-requested reference update
The owner subsequently requested newly prepared high-resolution character references, computer expressions and hamster variations. Three neutral-background reference portraits now replace the cropped character cards; two six-view sheets sit in a closed-by-default supplemental gallery. All five are explicitly identified as supplemental AI-generated references, distinct from original production work. Original final-frame crops remain available in the media archive. Built-in imagegen was used; prompts are recorded in humva-reference-prompts.md, humva-reference-sheet-prompts.json and humva-hamster-spacing-prompt.txt. PNG masters and WebP display copies are saved in public/projects/humva-film/references/.

The supplied Humva.Studio image is added only to Project Background, cropped above the player overlay. The internship context action now sits beside Watch Film. Desktop and 390px mobile checks verified the action row, images, closed gallery, two sheet lightboxes and Escape. No broken images or mobile overflow. Production build passes.

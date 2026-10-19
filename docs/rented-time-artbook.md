# The Girl Who Rented Time — implementation notes

Route: `#/projects/rented-time`. This project alone uses the scrolling FilmProject art-book component; the shared presentation and all internship templates are retained.

## Assets
23 supplied originals are represented: 1 poster, 9 cinematic frames, 5 age sheets (8, 18, 28, 58, 80), and 8 supporting character/prop sheets. WebP derivatives live in `public/projects/rented-time/`, with a source-to-output inventory in `asset-manifest.json`. The source artwork is untouched. Five front-view crops retain the original paper background: masking hair and soft clay edges would reduce fidelity. Full sheets remain available in the closed-by-default archive and lightbox.

`python scripts/prepare-rented-time.py` rebuilds derivatives using Pillow and the supplied Desktop folders. Uses proportional resizing only (maximum 2200 × 1500 for sheets/frames), quality 88; poster quality 91 and front crops quality 90. No generated art or model-based image manipulation.

## Behavior
- Film: https://www.youtube.com/watch?v=j2dVorygG3I
- Click-to-load 16:9 YouTube privacy-enhanced embed, without autoplay; persistent external link.
- Native details galleries start closed and remain keyboard accessible.
- Native modal dialog: focus containment, Escape, previous/next buttons and arrow keys; restores focus and scrolling on close.
- Responsive layouts, lazy-loaded secondary artwork, reserved image dimensions, reduced-motion override.
- Next project uses existing `#/projects/love-roi`; back uses existing project gallery.

## Content limits
Only supplied artwork and brief-supported process descriptions. No invented production screenshots, prompts, performance metrics, or awards. No missing asset is represented by a placeholder. The nine supplied film images cover all requested scenes, so the optional stills archive also offers a compact index of those frames.

## Verification
Production build passes. Browser checks: genuine YouTube film loaded paused; three archives closed initially, expanded to 5 / 8 / 9 images; image dialog next and keyboard arrows / Escape work; mobile tested at 390 × 844 with no page overflow and 145px swipeable age studies; All Projects and Next Project use existing routes. All 23 asset files verified.

## Childhood-film Easter egg
Added at the end of Background & Inspiration. Uses only the supplied 第一段.mov (61.505 seconds); the 550MB original is unchanged. A local AVFoundation derivative (960 × 540 H.264/AAC MP4, approximately 35MB, fast-start enabled) removes only the 90px top/bottom black mattes from the 2880 × 1800 recording. No music, filters, footage additions, or colour changes. Thumbnail is from the same clip at 12 seconds, with the same border crop. The video is mounted only when its native modal opens, stays paused, has native controls and playsInline, and is paused/unmounted on close. Escape and the close button restore focus to the teaser. Paths and teaser text live in rentedTimeContent.js. The Swift conversion script is retained in scripts/prepare-childhood-film.swift.

Childhood video verification: production build passes. Desktop browser reports readyState 4, 960 × 540, 61.53s, autoplay false and controls enabled; manual playback advanced beyond 15s. Escape removes/pauses the player and returns focus to the teaser. At 390 × 844, player fits within 351 × 197px without page overflow; manual playback advanced beyond 13s. Close button works. Temporary viewport override was reset.

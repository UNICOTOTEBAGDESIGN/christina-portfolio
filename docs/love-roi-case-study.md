# Love ROI case-study redesign

Scope: dedicated page for `projects/love-roi`; legacy `projects/dating-app-critique` alias retained. No Humva, Renting Time or other project content edited.

## Verified sources
- Existing `src/data/loveRoiContent.js` and `src/data/portfolio.js`.
- Original project: https://unicototebagdesign.github.io/HXQ-portfolio/#/projects/dating-app-critique (visually inspected).
- XinqiHuangCV.pdf, page 2, visually rendered and inspected: Jan–Feb 2026; campaign concept; calculator interaction; independent HTML/CSS/JS development using AI coding tools.
- Live site: https://loveroicalculator.netlify.app/ (visited and tested).
- Public live HTML inspected: semantic forms, inline CSS and JavaScript, form validation, weighted profile score, tier mapping, conditional feedback and bounded ROI calculation; client side, no matchmaking.

## Assets
Original poster1.png, poster2.png, cover.png and previous screenshots remain unchanged. Optimized WebP copies in `public/projects/love-roi/optimized/`. Poster artwork and typography are preserved.

New actual browser captures: live-overview, live-inputs, live-self-result, live-roi-result. Interface close-ups cropped from a full-page capture at 825px width, without browser chrome. Illustrative test inputs: self Male/25/Medium/Bachelor/attractiveness5; target Female/25/Medium/Bachelor/attractiveness5/interest5. Actual output: self65/TierC, target63/TierC, ROI25.2%. These are clearly labelled demonstration values, not participant evidence or campaign analytics.

Only two full original posters and one cover graphic were found. Social section uses original posters in explicitly labelled post-format previews; separate published social artwork, engagement metrics and demographic research are not claimed. Additional artwork appears in an expandable gallery.

Live fields do not separately ask time, money or emotional investment. Those remain conceptual themes; UI explanation accurately lists profile traits and target interest matchability.

## Implementation
Seven scrolling chapters, fixed bottom chapter navigation, active chapter observation, previous/next chapter controls, responsive layouts, original artwork lightbox with Escape/backdrop close, arrow navigation and focus restoration. Prominent live links use the verified URL. Existing rose gallery/detail theme preserved; pink/black artwork accents scoped to the Love ROI page.

## Final editorial revision
User requested less repetition: hero now uses an editorial text composition; each original poster appears once in Part I; duplicate poster gallery and social-post previews removed. Satire is introduced explicitly before Part I (posters) and Part II (website). Social distribution remains in the campaign journey explanation. Chapter 06 contains verified development work. Exactly one live calculator CTA remains, in the opening.

Validation: production build passed; seven chapters and seven nav targets; one live CTA; two poster images; desktop and 390px mobile no horizontal overflow; lightbox next/Escape/close and mobile opening checked. Public calculator tested successfully with illustrative inputs. Other project source files untouched except adding Love ROI route dispatch in ProjectDetail.

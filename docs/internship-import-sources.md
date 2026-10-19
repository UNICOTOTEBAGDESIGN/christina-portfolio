# TuSee and Humva content import

Verified 2026-10-16. Only the `tusee` and `humva` detail configurations were populated. The existing template, palettes, navigation, other internship content, original CV and `portfolio.js` remain unchanged.

## Primary source: public/resume.pdf

Visually inspected both pages because most CV text is outlined and does not extract as searchable text.

- TuSee: page 2, Turing Sense — Tusee App, Overseas Content Operations Intern, Apr–Sep 2024. Content strategy with four pillars; official overseas TikTok launch; 1–2 weekly tutorial videos; 2.4M+ views on one video; performance analysis of views / CTR / engagement; sneaker / streetwear KOL collaboration and Facebook community participation. These facts inform the overview, four contribution cards and three result cards. Cadence and pillar count are labelled operational outputs, not growth KPIs.
- Humva: page 1, RightBrain Tech — Humva AI, AI Product Operations & Growth Intern, Aug–Nov 2025. Global content growth; 3.8K Instagram and 4.1K TikTok followers; top videos 242K+ / 45K+ views respectively; creative format comparison, product promotion for AI Avatar 1.0 / Promo Video 2.0, Reddit SaaS recruitment and feedback. Rewritten concisely, not copied wholesale.

## Supplementary source: legacy portfolio

- Repository: https://github.com/unicototebagdesign/HXQ-portfolio
- Account / media / link mapping: `src/data/portfolioData.ts`, account entries `tusee-sneaker`, `tusee-beauty`, `humva-tiktok`.
- Each recovered file and source URL, hash and unaltered status are recorded in `internship-import-manifest.json`.
- 13 original repo assets were verified byte-for-byte against their Git blob hashes. One additional TuSee official-site marketing image was imported from https://tusee.ai/images/bg.png. This is labelled a category visual, not a product UI screenshot.
- Humva's archived `humva-1.png` is labelled promotional artwork. Detailed mockups described by the old source as AI-generated concepts were not passed off as authentic product UI.

## Verified specific-content links

TikTok short URLs were followed to content-specific destinations. Where TikTok supplied author and ID metadata, canonical links were saved; otherwise the original resolving short URL was retained.

| Work | Type | Content ID |
| --- | --- | --- |
| Nike Dunk comparison | Video | 7433513217734839557 |
| Timberland comparison | Video | 7452146528820432134 |
| Chanel sneaker | Photo post | 7431739446996765957 |
| Dior lipsticks | Photo post | 7507285936435203334 |
| Clinique comparison | Photo post | 7589180615061179669 |
| Gucci Bloom | Photo post | 7438011515774569784 |
| Is This Humva AI? | Video | 7582871731690360094 |
| I Wasn't Built For This | Video | 7578048205552700703 |
| Breaking News | Video | 7582079011719859486 |

Account URLs: `@tusee.legitcheck`, `@tuseecheck`, `@official_humva_ai`. The Beauty account screenshot and all three post images show @tuseecheck; this direct visual evidence takes priority over the old config button @tusee.beauty. Current availability of @tuseecheck is not independently confirmed because TikTok serves a challenge response. They are separate from all video / photo URLs. TikTok may require cookies, login or geographic access when visitors open posts.

### Dates and conflicting metrics

TuSee examples have publication dates after the Apr–Sep 2024 CV period. The user explicitly confirmed these are their works and that Nike is the 2.4M+ CV video. Keep CV dates unchanged. Later screenshot totals (e.g. 2.5M and follower counts) were preserved inside the original images, not used to overwrite CV statistics.

Humva example posts date to Nov–Dec 2025. The user authorized importing the corresponding legacy Humva work; do not change the CV period to match publication dates. Legacy video counts (including 415.6K) were not assigned to the CV's platform-level results or substituted for 45K+.

The old TuSee 20% CTR / follower growth figures and conversion claims were not imported as fresh results.

## Product links and missing materials

- TuSee product site: https://tusee.ai/ returned 200 and describes AI + expert authentication.
- Humva product site: https://humva.ai/ retained from the CV; live verification timed out. https://www.humva.studio/ appeared in the TikTok metadata but also timed out, so no replacement URL was invented.
- Instagram URLs / screenshots: not found in the old repository or TuSee product page. Config entries remain null and hidden.
- Actual in-app UI screenshots: not found. Current overview visuals are accurately labelled marketing / product-category assets.
- Third standalone TuSee video: not found. The reusable `creative-video` entry remains disabled in the data configuration, ready for a real URL and cover. Beauty / Chanel posts are photos, not videos.
- No local MP4s existed in the legacy repo. Video cards display the recovered cover and open the actual TikTok video; no synthetic local video is provided.

## Editing

- Content and media fields: `src/data/internshipContent.js`.
- Template dispatcher: `src/data/internshipTemplates.js` (only TuSee and Humva now reference real content).
- Shared renderer supports optional photo-post labels, source captions and video-cover-only display; other three internship configurations have no new fields or content.
- Every external link is independently editable. Missing links stay hidden.

## Files changed in the new project

- Added `src/data/internshipContent.js`: independent real-content data for TuSee and Humva.
- Updated `src/data/internshipTemplates.js`: connect only those two records to real content.
- Updated `src/pages/InternshipDetail.jsx`: optional photo-story label / CTA, image captions, per-video result note, avoid duplicate cover editors for populated cards.
- Updated `src/components/MediaSlot.jsx`: a recovered video cover is treated as a present project asset even without a local MP4. Existing empty templates behave as before.
- Updated `src/internship.css`: original-image captions and photo-card aspect ratios, scoped to internship pages.
- Added this source audit and `docs/internship-import-manifest.json`.
- Added 9 files under `public/experience/tusee/` and 5 under `public/experience/humva/`.

The homepage, timeline, CV, entry cards and other three internships were not edited for this import.

## Revision v21 — account links and current engagement

The user subsequently requested **current per-video views**, corner badges, account links immediately below Overview, no product photos, no Section 05, and results limited to highest views + followers. This supersedes the earlier CV-only result presentation, without changing the CV file or career dates.

- TuSee and Humva product images are no longer rendered; original files remain preserved.
- Both TuSee account links and the Humva TikTok account link now live only in Overview; account cards / duplicate links were removed from Selected Work. Humva Instagram has no verified URL, so no guessed account button was added.
- Section 05 is disabled for these two pages. Product Website remains in Overview.
- Every real video has a corner badge with the current fetched TikTok view snapshot. Photo posts show explicitly **archived** view counts from the old portfolio.
- Results: TuSee 2.5M highest views, 4,074 sneaker followers (current TikTok metadata), 942 beauty followers (archived screenshot). Humva 415.6K highest TikTok views, 3,964 TikTok followers (current metadata), 3.8K Instagram followers (latest CV).
- Full exact values, source URLs and source distinctions: `docs/internship-engagement-snapshot.json` (checked 2026-10-16). These are dated snapshots, not an automatic live analytics feed.
- TikTok continued to block the Beauty profile metadata request, so its 942 follower figure is explicitly labelled archived.
- Humva's `humva.ai` and `humva.studio` URLs timed out. `www.humva.com` currently redirects to a `/lander` page, so it was not substituted as the official product URL. The CV-listed `humva.ai` link remains in Overview pending an updated official address.
- Selected Work rows stretch to equal card heights; all thumbnails retain their own aspect ratio and use contain rather than stretching.

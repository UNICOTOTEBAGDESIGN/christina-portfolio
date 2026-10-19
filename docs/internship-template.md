# Internship detail templates

Only these `/projects/:id` routes use the template: `coach-peri`, `catchi`, `tiktok-shop`, `humva`, `tusee`. Other projects, CV records and entry cards are unchanged.

Edit `src/data/internshipTemplates.js`. Each company has independent overview, contributions, selectedWork, results and links configuration. The initial entries are layout placeholders, not claims about work or metrics. Existing role / period labels are read without changing `portfolio.js`.

- Add / remove array entries freely. Keep `id` stable so upload previews remain attached to the correct card.
- Set a section to `null` or `enabled:false` to hide it. Individual entries also support `enabled:false`.
- `preview:true` displays entries explicitly marked `placeholder:true`. Set it to `false` when publishing: empty cards / sections disappear.
- Overview: `companyIntro`, `responsibilityIntro`, and `images` (`src`, `title`).
- Contributions: `items` with `id`, `title`, `body`.
- Selected work: `type` is `video`, `account`, `ui`, `visual` or `image`; fields: `title`, `src`, `cover`, `url`, `views`, `accountName`, `caption`. Video is 9:16; image / UI uses contain (no stretching). Upload the video and its optional cover separately. Account screenshots have an independent View Account link.
- Results: `value`, `label`, `detail`, optional section `note`. No invented statistics are provided.
- Links: each button has its own `url`. Null / empty URLs are hidden, including the entire External Links section if none are set. Only http(s) destinations render.
- Upload / Replace uses the existing local-preview feature; uploads are not persisted. Save final asset paths in this configuration to publish them.

No URLs are prepopulated. No original CV or project descriptions are overwritten.

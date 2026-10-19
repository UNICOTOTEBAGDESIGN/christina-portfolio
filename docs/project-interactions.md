# Project interaction refinement

- Added a native dialog with five selectable project cards. Selection returns to the corresponding gallery slide; Escape closes the dialog and focus returns to its trigger.
- Added cover hover prompts, shared rounded image corners, directional cover transitions and arrow feedback. Original image proportions remain intact.
- Added viewport entry motion for project headings/art and disclosure expansion feedback. Reduced-motion preferences disable decorative motion.
- Shared ClinicLog and Dessert Zoo cover components now render in the gallery, homepage orbit, homepage selected cards and project overview.
- Replaced the homepage Latest sticker artwork with the owner-supplied Renting Time JPG, embedded in the existing SVG so the curl texture uses the same artwork.
- Verified desktop overview selection, close and focus restoration; mobile dialog width stays within 390px; homepage has four synchronized cover instances and no console errors. Confirmed actual rounded image edges after fixing contain-box clipping. Production build passes with the pre-existing Three.js chunk-size notice.

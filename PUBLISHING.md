# Publishing to GitHub Pages

Repository: `unicototebagdesign/christina-portfolio` (main).
Public URL: https://unicototebagdesign.github.io/christina-portfolio/

1. Review changes in GitHub Desktop, commit to main, then Push origin when ready to publish.
2. In this repository on GitHub, choose Settings → Pages → Build and deployment → Source → GitHub Actions.
3. Watch Actions → Build and deploy portfolio to Pages. If the initial push ran before Pages was enabled, choose Run workflow → main → Run workflow.
4. After build and deploy are green, open the public URL. Test images, navigation, the resume, and a direct link such as `#/projects/clinicallog`; refresh that link.

Future pushes to main run npm ci and npm run build, then deploy the generated dist artifact. No copying to the repository root or docs is needed. Existing tracked dist files are build output; the workflow rebuilds rather than trusting them.

## Local checks

Node 22: `npm ci`, `npm run build`, then `npm run preview`.
Open http://127.0.0.1:4173/christina-portfolio/.
Vite base is /christina-portfolio/. A small Vite transform rebases runtime public-asset string paths, including Three.js textures, images, videos, and resume.pdf. Vite handles CSS and HTML asset paths. Keep public assets under the configured public folders, and extend the transform if adding a new top-level folder.

Hash routing is retained: share links with #/projects/... rather than /projects/...; GitHub Pages does not supply history-routing fallbacks.

No changes are required in docs or the old HXQ-portfolio repository. No deployment secrets are needed; GitHub's scoped GITHUB_TOKEN deploys the Pages artifact.

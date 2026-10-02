# My Jersey Studio

A working browser-based jersey production workspace: image upload, four-corner perspective mapping, five-panel extraction, vector tracing, editable text/logo layers, review and SVG/PDF/PNG/ZIP exports.

## Run locally

Install with the included pnpm lockfile, then run `pnpm dev`. The default workflow does not need an account or API key.

## Deploy to Cloudflare Workers

The repository includes `wrangler.jsonc` with the Worker name and entry point. The Vite build generates the deployable Worker and static assets under `dist`.

For a Git-connected Worker, use these settings:

- Repository: `nafiulnahid17/my-jersey-production-studio`
- Production branch: `main`
- Root directory: `/`
- Build command: `pnpm run build:cloudflare`
- Deploy command: `pnpm exec wrangler deploy --config dist/server/wrangler.json`
- Node version: `24` (also declared in `.node-version`).
- Build variable: `PNPM_VERSION=11.25.0` to match the lockfile's package manager.

Cloudflare installs the pinned pnpm dependencies before the build. Keep the generated `dist` files out of Git. Deploy the generated `dist/server/wrangler.json`, which points to the compiled Worker and its assets, rather than uploading the TypeScript entry file in the browser editor.

To deploy from a signed-in terminal, run `pnpm install --frozen-lockfile`, `pnpm exec wrangler login`, then `pnpm run deploy:cloudflare`. The local production preview is `pnpm start`. `/api/health` returns an `ok` response when the Worker is running.

Core conversion, customization, preview and downloads work without provider secrets. For optional AI, add `AI_API_KEY` as a Worker secret and `AI_BASE_URL` / `AI_MODEL` as Worker variables. For local Wrangler development, copy `.dev.vars.example` to the ignored `.dev.vars` file. Never commit real credentials.

## Use the tool

1. Upload a clear jersey image and select its layout. Use a front and back photograph for a complete design.
2. Adjust the four corners for each panel. Choose detailed tracing or two-colour cleanup and generate panels.
3. Add text, numbers or logos. Images added as logos are traced into paths. Text layers can be dragged, resized and rotated. The bundled font outlines Latin text. For Bangla/Arabic lettering, upload the lettering as artwork.
4. Confirm the actual factory dimensions and cut outline. Import a cut outline for a selected panel from an SVG with a `0 0 width height` viewBox and one path.
5. Export editable SVG, true-size vector PDF, transparent PNG, all-panel ZIP or an editable project JSON.

The supplied photograph and flat output reference are independent example inputs. Loading the reference traces the supplied output image; it is not presented as a photo conversion result.

## Optional AI connection

Set these server-side runtime values to enable AI vision and natural-language editing:

- `AI_API_KEY`: provider credential, stored as a secret.
- `AI_BASE_URL`: the provider's HTTPS compatible chat-completions API base URL (without `/chat/completions`).
- `AI_MODEL`: a model supporting vision and structured JSON output for corner detection.

The API only returns validated colours, text layers or four-corner suggestions. It does not produce generative artwork. Local quick commands remain available without a provider.

## Production limits

Photo rectification maps observed artwork onto a reference-style polo pattern. It does not recover unseen fabric, reverse physical draping or reconstruct unreadable logos. A single-view photo leaves the unobserved back blank. Tracing changes pixels into paths but cannot create missing source detail.

All sizes are millimetres. Added Latin lettering becomes outline paths in SVG/PDF exports. RGB artwork needs the print shop's ICC profile. Border allowance reserves extra space and does not extend artwork beyond the cut line. Factory dimensions, cutting outline, seam allowance and bleed must be checked before print.

PNG exports are limited to 65 million pixels and 16,384 pixels on either side. Large 300-DPI sheets should be exported as individual panels. Current panel dimensions are capped by the controls. Unsupported image formats should first be converted to PNG/JPG.

Projects stay in browser memory until downloaded as JSON. AI calls send only the image or command explicitly submitted by the user. Cloudflare deployment settings are documented above.

## Validation

`node node_modules/typescript/bin/tsc --noEmit` checks the source.

`scripts/verify-production.ts` checks perspective geometry, background handling, real-source tracing, vector-only exports, text outlines, millimetre sizing, quick commands, project safety validation and PNG resolution metadata. It requires `tsx` and a Sharp installation; the hosted runtime's Sharp dependency can be selected using `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.

The bundled DejaVu font license is included under `public/fonts/LICENSE.txt`.

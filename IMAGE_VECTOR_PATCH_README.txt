MY JERSEY STUDIO — IMAGE TO VECTOR UPDATE PATCH

This patch implements the requested staged Image to Vector workflow:

1) Upload + Settings
   - Common image uploads including JPG/JPEG/PNG/WEBP and HEIC selection
   - Required pattern selection
   - Quality: Standard / HD / 4K Pro / Production Vector
   - Aspect: 4:3 / 1:1 / 9:16 / 16:9
   - Create Vector CTA

2) Generate / Result
   - Pattern-based master command routing
   - OpenAI Images-ready generation endpoint
   - Uses the selected image + pattern + quality + aspect ratio
   - Result CTAs: Download / Customize
   - When OpenAI is not configured, the UI explicitly enters API Preview Mode and does NOT pretend the source image is generated output.

3) Customize
   - AI command box
   - Player name, number, team, sponsor
   - Primary / secondary color
   - Pattern, font, collar, sleeve instructions
   - Add text / remove element
   - Upload logo or reference image
   - Reset changes
   - Edit and Create Vector
   - Go to Next Phase

4) Preview
   - 2D preview
   - Perspective / 3D review mode
   - Edit Again
   - Go to Next Phase

5) Download
   - SVG / AI-compatible / PDF / PNG / JPEG
   - 4K / High / Medium / Low
   - SVG uses the existing imagetracerjs dependency for traced path output
   - PDF / AI-compatible output is produced from traced SVG using jsPDF + svg2pdf.js

OPENAI IMAGE GENERATION
-----------------------
The endpoint is already wired for OpenAI image editing/generation through:
  POST /api/vector-generation

It can reuse the existing AI_API_KEY or use OPENAI_API_KEY.
Optional overrides:
  OPENAI_IMAGE_BASE_URL=https://api.openai.com/v1
  OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst

No API key is stored in this patch.

PATTERN REFERENCES
------------------
The two pattern references supplied in the chat are included only as pattern-selection thumbnails:
  public/patterns/pattern-1-production.webp
  public/patterns/pattern-2-transparent-reference.webp

The dashboard/mockup screenshot itself is NOT copied into the app.
Icons are implementation icons from the already-installed lucide-react package; no copied branded icon assets are included.

APPLY PATCH
-----------
Extract this ZIP directly into:
D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio

Allow Replace / Overwrite.

Then run:

cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"
pnpm run build:cloudflare

If build passes:

git add .
git commit -m "Build Image to Vector production workflow"
git push origin main

Cloudflare Git deployment should then update automatically.

FILES
-----
app/image-to-vector/page.tsx
app/api/vector-generation/route.ts
components/image-vector/image-to-vector-studio.tsx
lib/image-vector/types.ts
lib/image-vector/master-commands.ts
types/imagetracerjs.d.ts
public/patterns/pattern-1-production.webp
public/patterns/pattern-2-transparent-reference.webp

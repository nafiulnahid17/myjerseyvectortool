MY JERSEY STUDIO — HOMEPAGE + ROUTING RECOVERY PATCH

Purpose
-------
This patch fixes the current problem where the dashboard loads but tool links/routes are missing or inaccessible.

What this patch does
--------------------
1. Keeps the premium dashboard homepage.
2. Restores the complete Image to Vector route at /image-to-vector.
3. Restores the Image to Vector generation API route at /api/vector-generation.
4. Makes New Project open the Image to Vector workflow.
5. Adds /tools so View All no longer goes to a missing page.
6. Adds connected pages for every currently visible sidebar/dashboard route so clicks do not lead to 404/missing routes.
7. Does NOT invent fake project data or fake tool functionality. Tools that have not been built yet clearly say they are planned.
8. Includes the two real pattern-reference thumbnails previously supplied for the Image to Vector selector.

IMPORTANT
---------
This ZIP has app/, components/, lib/, public/, and types/ at the ROOT of the ZIP.
Extract the CONTENTS directly into your existing project root:

D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio

Choose Replace/Overwrite when Windows asks.

Then run:

cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"
pnpm run build:cloudflare

If the build passes:

git add .
git commit -m "Fix dashboard routing and restore Image to Vector tool"
git push origin main

Expected routes after patch
---------------------------
/                         Dashboard
/new-project              Redirects to Image to Vector
/image-to-vector           Full current Image to Vector flow
/tools                     Tool directory
/oneclick-creation         Connected planned-module page
/file-converter            Connected planned-module page
/edit-existing-file        Connected planned-module page
/backup                    Connected planned-module page
/projects                  Connected planned-module page
/templates                 Connected planned-module page
/mockup-generator          Connected planned-module page
/design-elements           Connected planned-module page
/ai-assistant              Connected planned-module page
/settings                  Connected planned-module page
/help-support              Connected planned-module page
/upgrade                   Connected planned-module page
/api/vector-generation     Image generation API endpoint

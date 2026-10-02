My Jersey Studio - Dashboard UI Patch

Patch purpose:
- Replaces the homepage/dashboard with a premium dark dashboard inspired by your mockup.
- Uses original UI shapes, icons, gradients, and inline SVG jersey artwork.
- Does NOT use fake recent project data.
- Includes the Fallback Backup tool card.

Files included:
- app/page.tsx
- components/dashboard/dashboard-shell.tsx

How to apply on Windows:
1. Open your project root:
   D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio
2. Extract this patch ZIP directly into the project root.
3. Allow Replace/Overwrite when prompted.
4. Run:
   pnpm run build:cloudflare
5. If build passes, then run:
   git add .
   git commit -m "Update dashboard UI"
   git push origin main

Notes:
- Sidebar/topbar buttons are UI-first and route to clean path names.
- If any of those routes do not exist yet, they can be created later one by one.
- Recent Projects intentionally uses an empty-state design instead of fake sample cards.

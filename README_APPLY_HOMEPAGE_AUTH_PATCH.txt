MY JERSEY STUDIO — HOMEPAGE / AUTH / HAMBURGER PATCH

This patch fixes the homepage interaction layer and adds:
- Real hero background from the supplied stadium/jersey artwork
- Real tool-card artwork from the supplied tool-card sheet
- Working Dark / Light mode toggle (saved in localStorage)
- Working hamburger menu based on the supplied menu mockup
- Login gate before opening any studio feature
- Master login API
- First-time profile completion flow
- Logout
- Search/filter for tools
- Notification dropdown
- Language dropdown
- No fake recent-project entries
- Direct protected-route gate through the root session provider

BOOTSTRAP LOGIN
Username: masteradmin
Password: 179501

The API route also supports future Cloudflare secrets:
MASTER_ADMIN_USERNAME
MASTER_ADMIN_PASSWORD

PROFILE STORAGE
The first profile is currently saved in this browser's localStorage because no user database
has been connected yet. When Supabase/user backend is added, migrate this profile storage there.

APPLY
1. Extract this ZIP directly into:
   D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio

2. Allow Replace / Overwrite.

3. Build:
   pnpm run build:cloudflare

4. If build passes:
   git add .
   git commit -m "Add homepage assets auth theme and hamburger"
   git push origin main

TEST AFTER DEPLOY
- Open homepage.
- Toggle Light/Dark.
- Open hamburger menu.
- Click Image to Vector while logged out -> login popup.
- Login with the bootstrap credentials above.
- Complete the profile form.
- The requested feature should then open.
- Logout from the profile menu/hamburger menu.

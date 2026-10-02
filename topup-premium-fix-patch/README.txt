MY JERSEY STUDIO — TOPUP PAGE PREMIUM FIX PATCH

This patch upgrades the TopUp AI Credit page with:
- stronger premium backgrounds and card styling
- improved payment cards
- premium payment popup modal
- copy payment number button
- copy amount button
- boxed disclaimer / instruction layout
- no fake payment processing or fake history

Apply:
1. Extract into:
   D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio
2. Overwrite files
3. Run:
   pnpm run build:cloudflare
4. If build passes:
   git add .
   git commit -m "Upgrade Topup AI credit UI"
   git push origin main

MY JERSEY STUDIO — MENU UPDATE

Adds two menu items:
1. Topup AI Credits -> /topup-ai-credits
2. About Us -> /about-us

Both are added to:
- dashboard/sidebar navigation
- hamburger menu

Topup AI Credits does NOT show a fake balance or fake payment activity.
The page is ready for a real credit/payment backend later.

Apply:
1. Extract ZIP directly into the project root.
2. Run APPLY_MENU_UPDATE.cmd
3. If build passes:
   git add .
   git commit -m "Add Topup AI Credits and About Us menu items"
   git push origin main

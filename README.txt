MY JERSEY STUDIO — TOPUP AI CREDIT PAGE PATCH

Included:
- Full TopUp AI Credit page based on the supplied mockup structure
- USD amount field
- Automatic conversion at fixed rate: 1 USD = 130 BDT
- Platform: My Jersey Ecosystem
- Payment method selector
- Bkash popup: 01303498506 / Send Money Only
- Nagad popup: 01303498506 / Send Money Only
- Redot Pay disabled / unavailable
- Bank Transfer disabled / unavailable
- Mandatory Transaction ID validation
- Optional payment screenshot upload with image preview
- Live TopUp Summary
- Honest request-status section
- WhatsApp support button

IMPORTANT:
This patch intentionally DOES NOT pretend to send/store a real topup request because no persistent
payment/topup backend was provided. The Add Credit button validates the complete request and clearly
states that backend submission is not connected yet.

Apply:
1. Extract ZIP directly into:
   D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio
2. Overwrite app/topup-ai-credits/page.tsx
3. Run:
   pnpm run build:cloudflare
4. If build passes:
   git add .
   git commit -m "Build Topup AI Credit workflow"
   git push origin main

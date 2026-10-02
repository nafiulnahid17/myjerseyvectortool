MY JERSEY STUDIO — TOPUP AI CREDIT EXACT MOCKUP UPDATE

This patch is a complete replacement of the TopUp AI Credit page based on the uploaded mockup and uploaded icon sheet.

Included:
- isolated CSS Module so existing global Studio styles cannot squeeze the page
- desktop layout matching the mockup: sidebar + main form + right summary column
- uploaded visual icon assets cropped from the supplied icon sheet
- sidebar brand / promo cards from the supplied mockup
- responsive layout
- working USD -> BDT calculation at 1 USD = 130 BDT
- Bkash and Nagad selectable
- Bkash/Nagad payment details: 01303498506, Send Money Only
- Redot Pay and Bank Transfer displayed unavailable
- compact premium payment-method popup
- Copy Number and Copy Amount buttons
- Transaction ID validation
- screenshot click/drag-drop upload + preview
- WhatsApp support link
- no fake payment history, request approval, balance, or backend verification

HOW TO APPLY
1. Extract the ZIP directly into:
   D:\My-Jersey-Production-Studio-Source - Copy\my-jersey-production-studio

2. The project root should contain:
   APPLY_TOPUP_EXACT_MOCKUP.cmd
   payload\

3. Run:
   APPLY_TOPUP_EXACT_MOCKUP.cmd

4. When BUILD PASSED appears, use the Git commands shown by the script.

NOTE
The right-side request status intentionally does NOT claim "request received" because the persistent payment backend is not connected yet. This avoids fake status data while keeping the mockup styling.

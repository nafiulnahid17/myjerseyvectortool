MY JERSEY STUDIO — ONECLICK CREATION + FILE CONVERTER PATCH

What this patch adds:
- /oneclick-creation page
- /file-converter page
- default master command for OneClick Creation
- working file upload, preview, generation trigger, format selection and download
- no fake recent/sample project data inside the tools
- generated visuals and UI created in code, not copied from uploaded mockups

Important notes:
- OneClick Creation calls /api/vector-generation.
- If your AI/API key is not configured yet, the OneClick page will still load, but generation will not run until the API is connected.
- File Converter performs honest in-browser conversion for PNG / JPG / WEBP / SVG / PDF.
- AI / EPS export buttons are shown honestly as not yet enabled, not faked.

How to apply:
1. Extract this patch into:
   D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio
2. Overwrite files if asked.
3. Run:
   APPLY_TOOLS_PATCH.cmd
4. If build passes, run:
   git add .
   git commit -m "Add OneClick Creation and File Converter tools"
   git push origin main

import {
  CLOUDFLARE_AI_MODELS,
  analyzeJerseyBestEffort,
  getWorkersAI,
} from "@/lib/ai/cloudflare-workers-ai";

export async function GET() {
  return Response.json({
    configured: Boolean(getWorkersAI()),
    provider: "Cloudflare Workers AI",
    model: CLOUDFLARE_AI_MODELS.vision,
    purpose: "Jersey source analysis",
  });
}

export async function POST(request: Request) {
  const ai = getWorkersAI();
  if (!ai) {
    return Response.json(
      {
        configured: false,
        error: "Cloudflare Workers AI binding is not available.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const image = form.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ error: "Upload a jersey image first." }, { status: 400 });
  }

  const analysis = await analyzeJerseyBestEffort(ai, image);
  return Response.json({
    configured: true,
    provider: "Cloudflare Workers AI",
    ...analysis,
  });
}

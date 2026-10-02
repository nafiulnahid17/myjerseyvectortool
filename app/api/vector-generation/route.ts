import { buildMasterCommand } from "@/lib/image-vector/master-commands";
import type { AspectRatioId, PatternId, QualityId } from "@/lib/image-vector/types";
import {
  CLOUDFLARE_AI_MODELS,
  analyzeJerseyBestEffort,
  cloudflareImageSize,
  getWorkersAI,
  runFluxImage,
} from "@/lib/ai/cloudflare-workers-ai";

const patterns = new Set<PatternId>(["production-black", "transparent-layout"]);
const qualities = new Set<QualityId>(["standard", "hd", "4k-pro", "production-vector"]);
const aspects = new Set<AspectRatioId>(["4:3", "1:1", "9:16", "16:9"]);

export async function GET() {
  const ai = getWorkersAI();

  return Response.json({
    configured: Boolean(ai),
    provider: "Cloudflare Workers AI",
    model: CLOUDFLARE_AI_MODELS.final,
    previewModel: CLOUDFLARE_AI_MODELS.preview,
    visionModel: CLOUDFLARE_AI_MODELS.vision,
    vectorEngine: "ImageTracerJS SVG vector engine",
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const image = form.get("image");
    const references = form
      .getAll("reference")
      .filter((item): item is File => item instanceof File);

    const pattern = String(form.get("pattern") || "") as PatternId;
    const quality = String(form.get("quality") || "") as QualityId;
    const aspectRatio = String(form.get("aspectRatio") || "") as AspectRatioId;
    const mode = String(form.get("mode") || "generate");
    const customizationPrompt = String(form.get("customizationPrompt") || "").slice(0, 6000);

    if (!(image instanceof File) || image.size === 0) {
      return Response.json({ error: "Upload a source jersey image first." }, { status: 400 });
    }
    if (image.size > 25 * 1024 * 1024) {
      return Response.json({ error: "Source image must be 25 MB or smaller." }, { status: 413 });
    }
    if (!patterns.has(pattern)) {
      return Response.json({ error: "Choose a valid production pattern." }, { status: 400 });
    }
    if (!qualities.has(quality)) {
      return Response.json({ error: "Choose a valid quality." }, { status: 400 });
    }
    if (!aspects.has(aspectRatio)) {
      return Response.json({ error: "Choose a valid aspect ratio." }, { status: 400 });
    }
    if (!["generate", "edit"].includes(mode)) {
      return Response.json({ error: "Unsupported generation mode." }, { status: 400 });
    }

    const ai = getWorkersAI();
    const prompt = buildMasterCommand({
      pattern,
      quality,
      aspectRatio,
      customizationPrompt,
    });

    if (!ai) {
      return Response.json(
        {
          configured: false,
          message:
            "Cloudflare Workers AI is not bound yet. Add the AI binding and redeploy; no API key is required inside the app.",
          prompt,
          provider: "Cloudflare Workers AI",
          model: CLOUDFLARE_AI_MODELS.final,
        },
        { status: 503 },
      );
    }

    // Existing prompts remain untouched. Provider selection only changes the
    // execution backend:
    // - generate/reconstruction -> FLUX.2 Dev
    // - customization/edit -> FLUX.2 Klein 9B
    const model =
      mode === "edit"
        ? CLOUDFLARE_AI_MODELS.preview
        : CLOUDFLARE_AI_MODELS.final;

    const { width, height } = cloudflareImageSize(aspectRatio, quality);

    const [imageDataUrl, visionAnalysis] = await Promise.all([
      runFluxImage({
        ai,
        model,
        prompt,
        source: image,
        references,
        width,
        height,
        quality,
      }),
      analyzeJerseyBestEffort(ai, image),
    ]);

    return Response.json({
      configured: true,
      imageDataUrl,
      message:
        mode === "edit"
          ? "Customization preview generated with Cloudflare Workers AI."
          : "Production layout generated with Cloudflare Workers AI.",
      provider: "Cloudflare Workers AI",
      model,
      visionModel: CLOUDFLARE_AI_MODELS.vision,
      visionAnalysis,
      vectorEngine: "ImageTracerJS SVG vector engine",
      outputSize: { width, height },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Vector generation failed.";

    const friendly =
      /capacity|3040|429/i.test(message)
        ? "Cloudflare Workers AI is temporarily at capacity. Please try again."
        : message;

    return Response.json({ error: friendly }, { status: 500 });
  }
}

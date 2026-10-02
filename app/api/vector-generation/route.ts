import { env } from "cloudflare:workers";
import type {
  AspectRatioId,
  PatternId,
  QualityId,
} from "@/lib/image-vector/types";
import { ONECLICK_MASTER_COMMAND } from "@/lib/tools/master-command";

const IMAGEGPT_HOST = "the-oe1n.imagegpt.host";
const INPUT_BASE_URL =
  "https://pub-f473e32f703644f4a7d4987ac0ebb871.r2.dev";

const MODELS = {
  imageAnalysis: "gemini-3.1-flash-image",
  imageToVector: "gemini-3.1-flash-image",
  customize: "gemini-3-pro-image",
  oneClick: "gemini-3-pro-image",
} as const;

const CLOUDFLARE_FALLBACKS = {
  fast: "@cf/black-forest-labs/flux-2-klein-9b",
  quality: "@cf/black-forest-labs/flux-2-dev",
} as const;

const IMAGE_TO_VECTOR_MASTER_COMMAND = `MASTER JERSEY → PRODUCTION VECTOR LAYOUT COMMAND

Analyze the uploaded jersey image carefully and reconstruct the COMPLETE jersey design as a clean, high-resolution, vector-style sublimation production layout.

STRICT OUTPUT STRUCTURE:

Canvas:
• Aspect ratio as selected 
• pattern as selected 
• 4K-quality appearance
• Extremely sharp, clean edges
• High-detail vector-style graphics
• Enhanced/boosted original colors
• Professional production-template presentation
• No perspective distortion
• No hanger, person, mannequin, floor, shadows, advertisement background, phone, watermark, or unnecessary objects

MAIN PLACEMENT — MUST FOLLOW EXACTLY:

LEFT SIDE:
LEFT SLEEVE

CENTER LEFT:
FRONT BODY

CENTER RIGHT:
BACK BODY

RIGHT SIDE:
RIGHT SLEEVE

BELOW FRONT BODY:
FRONT COLLAR PIECE

BELOW BACK BODY:
BACK COLLAR PIECE

TOP CENTER:
One separate narrow rib / cuff / trim strip

BOTTOM CENTER:
One separate narrow rib / cuff / trim strip

CRITICAL CUTTING RULE:

The jersey body panels MUST NOT contain an attached collar.

CUT THE COLLAR COMPLETELY OUT OF BOTH BODY PANELS.

The FRONT BODY must have only the clean neckline opening where the collar will later be sewn.

The BACK BODY must also have only the clean neckline opening.

Generate the FRONT COLLAR and BACK COLLAR separately below the corresponding body panels.

DO NOT show a collar on the body AND another separate collar.
NO DOUBLE COLLARS.
NO DUPLICATED COMPONENTS.

SLEEVE RULE:

Both sleeves must be completely detached from the body.

Generate:
1 left sleeve only
1 right sleeve only

Sleeves should be large enough to clearly show the complete artwork and should preserve the original sleeve graphics, cuff design, stripes, colors, logos, and patterns.

DESIGN RECONSTRUCTION:

Preserve the uploaded jersey as closely as possible:
• Original front design
• Original back design
• Original color palette
• Logos and crest positions
• Names
• Numbers
• Typography style
• Sponsor text
• Patterns
• Side graphics
• Shoulder graphics
• Sleeve graphics
• Collar colors
• Cuff patterns
• Decorative lines
• Small design elements

Correct wrinkles, folds, fabric distortion, perspective distortion, shadows, and photography artifacts.

Reconstruct hidden/distorted artwork intelligently while maintaining symmetry and the original design language.

Do NOT redesign the jersey unless reconstruction is necessary.

BODY SHAPE:

Create clean flat sublimation-cut shapes.

FRONT BODY and BACK BODY:
• Similar size
• Same visual scale
• Straight and symmetrical
• Clearly separated
• No sleeves attached
• No collar attached

Maintain realistic jersey panel proportions.

LAYOUT SPACING:

Keep generous black spacing between every component.

Nothing should touch or overlap another component.

Maintain a clean symmetrical arrangement similar to a professional apparel tech-pack / sublimation print sheet.

QUALITY:

Produce the BEST possible visual reconstruction:
• Ultra-clean
• High contrast
• Crisp typography
• Smooth geometric lines
• Detailed patterns
• Accurate color separation
• Strong saturation without oversaturation
• Print-ready visual quality
• Premium vector illustration appearance

IMPORTANT:

Do NOT create a normal jersey mockup.
Do NOT create a person wearing the jersey.
Do NOT create front/back shirts with sleeves attached.
Do NOT attach collars to the body.
Do NOT duplicate collars.
Do NOT duplicate sleeves.
Do NOT add random panels.
Do NOT change names or numbers.
Do NOT invent new branding.

FINAL COMPONENT COUNT:

1 × Front Body — collar removed
1 × Back Body — collar removed
1 × Left Sleeve
1 × Right Sleeve
1 × Front Collar
1 × Back Collar
1 × Top Trim Strip
1 × Bottom Trim Strip

TOTAL = 8 SEPARATED COMPONENTS.

Use the uploaded jersey only as the design source and transform it into this exact production-layout pattern.`;

const IMAGE_ANALYSIS_PROMPT = `IMAGE ANALYSIS FOR JERSEY PRODUCTION

Analyze the uploaded jersey visually and create a normalized, faithful reference image for the next production-layout stage.

Preserve exactly:
• front and back design language
• original colors
• logos and crest positions
• sponsor marks
• names and numbers
• typography style
• sleeve graphics
• collar graphics
• cuffs, stripes, patterns, side graphics and small decorative elements

Correct only:
• wrinkles and folds
• perspective distortion
• lighting/shadow artifacts
• photography background distractions
• partially hidden artwork where faithful reconstruction is possible

Do NOT redesign the jersey.
Do NOT invent branding.
Do NOT change names, numbers, colors, logos or typography.
Do NOT simplify important graphics.

Return a clean faithful reference image only.`;

type Workflow =
  | "image-to-vector-analysis"
  | "image-to-vector-final"
  | "customize"
  | "oneclick";

type R2Like = {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
    },
  ): Promise<unknown>;
  delete(key: string): Promise<unknown>;
};

type WorkersAILike = {
  run(
    model: string,
    input: {
      multipart: {
        body: ReadableStream<Uint8Array>;
        contentType: string;
      };
    },
  ): Promise<{ image?: string }>;
};

type RuntimeEnv = {
  my_jersey_ai_inputs?: R2Like;
  AI?: WorkersAILike;
};

const patterns = new Set<PatternId>([
  "production-black",
  "transparent-layout",
]);

const qualities = new Set<QualityId>([
  "standard",
  "hd",
  "4k-pro",
  "production-vector",
]);

const aspects = new Set<AspectRatioId>([
  "4:3",
  "1:1",
  "9:16",
  "16:9",
]);

function bucket() {
  return (env as unknown as RuntimeEnv).my_jersey_ai_inputs ?? null;
}

function workersAI() {
  return (env as unknown as RuntimeEnv).AI ?? null;
}

export async function GET() {
  return Response.json({
    configured: Boolean(bucket()),
    provider: "ImageGPT.cloud",
    mode: "browser-direct",
    host: IMAGEGPT_HOST,
    models: MODELS,
    cloudflareFallback: {
      configured: Boolean(workersAI()),
      fast: CLOUDFLARE_FALLBACKS.fast,
      quality: CLOUDFLARE_FALLBACKS.quality,
    },
    inputStorage: "Cloudflare R2",
    vectorEngine: "ImageTracerJS SVG vector engine",
    cloudflareVisionUsed: false,
    seedreamUsed: false,
    premiumOneClick: false,
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const image = form.get("image");

    const workflow = String(
      form.get("workflow") || "image-to-vector-final",
    ) as Workflow;

    const pattern = String(
      form.get("pattern") || "production-black",
    ) as PatternId;

    const quality = String(
      form.get("quality") || "hd",
    ) as QualityId;

    const aspectRatio = String(
      form.get("aspectRatio") || "4:3",
    ) as AspectRatioId;

    const customizationPrompt = String(
      form.get("customizationPrompt") || "",
    ).slice(0, 7000);

    const forceCloudflare =
      String(form.get("forceCloudflare") || "") === "true";

    if (!(image instanceof File) || !image.size) {
      return Response.json(
        { error: "Upload a source image first." },
        { status: 400 },
      );
    }

    if (image.size > 25 * 1024 * 1024) {
      return Response.json(
        { error: "Source image must be 25 MB or smaller." },
        { status: 413 },
      );
    }

    if (!patterns.has(pattern)) {
      return Response.json(
        { error: "Invalid production pattern." },
        { status: 400 },
      );
    }

    if (!qualities.has(quality)) {
      return Response.json(
        { error: "Invalid quality." },
        { status: 400 },
      );
    }

    if (!aspects.has(aspectRatio)) {
      return Response.json(
        { error: "Invalid aspect ratio." },
        { status: 400 },
      );
    }

    const resolved = resolveWorkflow({
      workflow,
      pattern,
      quality,
      aspectRatio,
      customizationPrompt,
    });

    if (forceCloudflare) {
      const result = await generateCloudflareFallback({
        image,
        prompt: resolved.prompt,
        aspectRatio,
        workflow,
      });

      return Response.json({
        configured: true,
        provider: "Cloudflare Workers AI",
        mode: "fallback",
        workflow,
        model: result.model,
        imageDataUrl: result.imageDataUrl,
        message: `ImageGPT unavailable → Cloudflare fallback used (${result.model}).`,
      });
    }

    const r2 = bucket();

    if (!r2) {
      return Response.json(
        {
          configured: false,
          error: "R2 binding my_jersey_ai_inputs is unavailable.",
        },
        { status: 503 },
      );
    }

    const uploaded = await uploadTemporary(r2, image);

    return Response.json({
      configured: true,
      provider: "ImageGPT.cloud",
      mode: "browser-direct",
      workflow,
      model: resolved.model,
      directUrl: buildImageGptUrl({
        prompt: resolved.prompt,
        model: resolved.model,
        aspectRatio,
        imageUrl: uploaded.publicUrl,
        fresh: resolved.fresh,
      }),
      cleanupKey: uploaded.key,
      message: workflowMessage(workflow, resolved.model),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not prepare image generation.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const r2 = bucket();
    if (!r2) {
      return Response.json(
        { ok: false },
        { status: 503 },
      );
    }

    const body =
      (await request.json()) as {
        key?: string;
      };

    const key = body.key || "";

    if (
      !/^imagegpt-inputs\/[a-f0-9-]{20,}\.(?:png|jpg|webp)$/i.test(
        key,
      )
    ) {
      return Response.json(
        { error: "Invalid cleanup key." },
        { status: 400 },
      );
    }

    await r2.delete(key);

    return Response.json({
      ok: true,
    });
  } catch {
    return Response.json({
      ok: false,
    });
  }
}

function resolveWorkflow(args: {
  workflow: Workflow;
  pattern: PatternId;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  customizationPrompt: string;
}) {
  switch (args.workflow) {
    case "image-to-vector-analysis":
      return {
        model: MODELS.imageAnalysis,
        prompt: IMAGE_ANALYSIS_PROMPT,
        fresh: false,
      };

    case "image-to-vector-final":
      return {
        model: MODELS.imageToVector,
        prompt: buildImageToVectorPrompt({
          pattern: args.pattern,
          aspectRatio: args.aspectRatio,
          quality: args.quality,
        }),
        fresh: false,
      };

    case "customize":
      return {
        model: MODELS.customize,
        prompt: buildCustomizePrompt({
          pattern: args.pattern,
          aspectRatio: args.aspectRatio,
          quality: args.quality,
          customizationPrompt: args.customizationPrompt,
        }),
        fresh: true,
      };

    case "oneclick":
      return {
        model: MODELS.oneClick,
        prompt: ONECLICK_MASTER_COMMAND,
        fresh: false,
      };

    default:
      throw new Error(
        `Unsupported workflow: ${args.workflow}`,
      );
  }
}

function buildImageToVectorPrompt(args: {
  pattern: PatternId;
  aspectRatio: AspectRatioId;
  quality: QualityId;
}) {
  const selectedPattern =
    args.pattern === "transparent-layout"
      ? "Transparent Layout"
      : "Production Black";

  return `${IMAGE_TO_VECTOR_MASTER_COMMAND}

SELECTED RUNTIME SETTINGS:

Aspect ratio selected:
${args.aspectRatio}

Pattern selected:
${selectedPattern}

Quality selected:
${args.quality}

IMPORTANT RUNTIME RULE:

The selected aspect ratio and selected pattern above override any default assumptions.

If Production Black is selected:
Use a solid pure black production-sheet background.

If Transparent Layout is selected:
Use a transparent / isolated production layout while preserving the exact same eight-component structure.

Follow the MASTER JERSEY → PRODUCTION VECTOR LAYOUT COMMAND exactly.`;
}

function buildCustomizePrompt(args: {
  pattern: PatternId;
  aspectRatio: AspectRatioId;
  quality: QualityId;
  customizationPrompt: string;
}) {
  return `${buildImageToVectorPrompt({
    pattern: args.pattern,
    aspectRatio: args.aspectRatio,
    quality: args.quality,
  })}

CUSTOMIZATION OVERRIDES:

Apply ONLY the requested changes below.
Preserve every unmentioned original element, name, number, logo, color, pattern, production component and structural rule.

${args.customizationPrompt || "Preserve the current design and improve production fidelity only."}`;
}

function workflowMessage(
  workflow: Workflow,
  model: string,
) {
  if (
    workflow ===
    "image-to-vector-analysis"
  ) {
    return `Image Analysis · Gemini 3.1 Flash Image (${model})`;
  }

  if (
    workflow ===
    "image-to-vector-final"
  ) {
    return `Image To Vector · Gemini 3.1 Flash Image (${model})`;
  }

  if (workflow === "customize") {
    return `AI Customize · Gemini 3 Pro Image (${model})`;
  }

  return `OneClick Production · Gemini 3 Pro Image (${model})`;
}

async function uploadTemporary(
  r2: R2Like,
  file: File,
) {
  const ext =
    /webp/i.test(file.type)
      ? "webp"
      : /jpe?g/i.test(file.type)
        ? "jpg"
        : "png";

  const key =
    `imagegpt-inputs/${crypto.randomUUID()}.${ext}`;

  await r2.put(
    key,
    await file.arrayBuffer(),
    {
      httpMetadata: {
        contentType:
          file.type ||
          "image/png",
        cacheControl:
          "public, max-age=300",
      },
    },
  );

  return {
    key,
    publicUrl:
      `${INPUT_BASE_URL}/${key}`,
  };
}

function buildImageGptUrl(args: {
  prompt: string;
  model: string;
  aspectRatio: AspectRatioId;
  imageUrl: string;
  fresh: boolean;
}) {
  const params =
    new URLSearchParams({
      prompt: args.prompt,
      model: args.model,
      aspect_ratio:
        args.aspectRatio,
      format: "png",
      image_url:
        args.imageUrl,
    });

  if (args.fresh) {
    params.set(
      "cache",
      "false",
    );
  }

  return `https://${IMAGEGPT_HOST}/image?${params.toString()}`;
}

async function generateCloudflareFallback(args: {
  image: File;
  prompt: string;
  aspectRatio: AspectRatioId;
  workflow: Workflow;
}) {
  const ai = workersAI();

  if (!ai) {
    throw new Error(
      "Cloudflare Workers AI binding is unavailable.",
    );
  }

  const priority =
    args.workflow ===
    "image-to-vector-analysis"
      ? [
          CLOUDFLARE_FALLBACKS.fast,
          CLOUDFLARE_FALLBACKS.quality,
        ]
      : [
          CLOUDFLARE_FALLBACKS.quality,
          CLOUDFLARE_FALLBACKS.fast,
        ];

  let lastError: unknown;

  for (
    const model
    of priority
  ) {
    try {
      const form =
        new FormData();

      const dimensions =
        dimensionsForAspectRatio(
          args.aspectRatio,
        );

      form.append(
        "prompt",
        args.prompt,
      );

      form.append(
        "width",
        String(
          dimensions.width,
        ),
      );

      form.append(
        "height",
        String(
          dimensions.height,
        ),
      );

      form.append(
        "input_image_0",
        new Blob(
          [
            await args.image.arrayBuffer(),
          ],
          {
            type:
              args.image.type ||
              "image/png",
          },
        ),
        args.image.name ||
          "jersey-reference.png",
      );

      const serialized =
        new Response(form);

      const contentType =
        serialized.headers.get(
          "content-type",
        );

      if (
        !serialized.body ||
        !contentType
      ) {
        throw new Error(
          "Could not serialize Cloudflare multipart request.",
        );
      }

      const result =
        await ai.run(
          model,
          {
            multipart: {
              body:
                serialized.body,
              contentType,
            },
          },
        );

      if (
        !result?.image
      ) {
        throw new Error(
          `Cloudflare ${model} returned no image.`,
        );
      }

      return {
        model,
        imageDataUrl:
          `data:image/png;base64,${result.image}`,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw (
    lastError ||
    new Error(
      "All Cloudflare image fallbacks failed.",
    )
  );
}

function dimensionsForAspectRatio(
  aspectRatio:
    AspectRatioId,
) {
  switch (
    aspectRatio
  ) {
    case "1:1":
      return {
        width: 1024,
        height: 1024,
      };

    case "9:16":
      return {
        width: 864,
        height: 1536,
      };

    case "16:9":
      return {
        width: 1536,
        height: 864,
      };

    case "4:3":
    default:
      return {
        width: 1344,
        height: 1008,
      };
  }
}

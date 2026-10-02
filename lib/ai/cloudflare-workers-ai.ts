import { env } from "cloudflare:workers";
import type { AspectRatioId, QualityId } from "@/lib/image-vector/types";

export const CLOUDFLARE_AI_MODELS = {
  final: "@cf/black-forest-labs/flux-2-dev",
  preview: "@cf/black-forest-labs/flux-2-klein-9b",
  vision: "@cf/meta/llama-3.2-11b-vision-instruct",
} as const;

type WorkersAI = {
  run(model: string, input: unknown, options?: unknown): Promise<unknown>;
};

export function getWorkersAI(): WorkersAI | null {
  const runtime = env as unknown as { AI?: WorkersAI };
  return runtime.AI ?? null;
}

export function cloudflareImageSize(aspect: AspectRatioId, quality: QualityId) {
  const level = quality === "standard" ? 0 : quality === "hd" ? 1 : 2;

  const sizes: Record<AspectRatioId, Array<[number, number]>> = {
    "4:3": [
      [1024, 768],
      [1536, 1152],
      [1920, 1440],
    ],
    "1:1": [
      [1024, 1024],
      [1536, 1536],
      [1920, 1920],
    ],
    "9:16": [
      [576, 1024],
      [864, 1536],
      [1080, 1920],
    ],
    "16:9": [
      [1024, 576],
      [1536, 864],
      [1920, 1080],
    ],
  };

  const [width, height] = sizes[aspect][level];
  return { width, height };
}

export async function runFluxImage(args: {
  ai: WorkersAI;
  model: typeof CLOUDFLARE_AI_MODELS.final | typeof CLOUDFLARE_AI_MODELS.preview;
  prompt: string;
  source: File;
  references?: File[];
  width: number;
  height: number;
  quality: QualityId;
}) {
  const form = new FormData();
  form.append("prompt", args.prompt);
  form.append("width", String(args.width));
  form.append("height", String(args.height));
  form.append("guidance", "3.5");

  if (args.model === CLOUDFLARE_AI_MODELS.final) {
    const steps =
      args.quality === "standard"
        ? 20
        : args.quality === "hd"
          ? 25
          : args.quality === "4k-pro"
            ? 28
            : 30;
    form.append("steps", String(steps));
  }

  form.append("input_image_0", args.source, args.source.name || "jersey-source.webp");
  for (const [index, reference] of (args.references ?? []).slice(0, 3).entries()) {
    form.append(`input_image_${index + 1}`, reference, reference.name || `reference-${index + 1}.webp`);
  }

  // Cloudflare FLUX.2 models currently accept multipart input through the
  // Workers AI binding. Serializing FormData through Response produces the
  // required multipart boundary and body stream.
  const serialized = new Response(form);
  const body = serialized.body;
  const contentType = serialized.headers.get("content-type");
  if (!body || !contentType) {
    throw new Error("Could not serialize the Cloudflare Workers AI image request.");
  }

  const result = await args.ai.run(args.model, {
    multipart: {
      body,
      contentType,
    },
  });

  const base64 = extractImageBase64(result);
  if (!base64) {
    throw new Error("Cloudflare Workers AI returned no image.");
  }

  return `data:image/png;base64,${base64}`;
}

export async function analyzeJerseyBestEffort(ai: WorkersAI, image: File) {
  // Vision analysis must never block image generation. It is supplemental
  // metadata only, so the existing master generation prompt remains unchanged.
  try {
    if (image.size > 6 * 1024 * 1024) {
      return { available: false, reason: "vision_input_too_large" as const };
    }

    const imageDataUrl = await fileToDataUrl(image);
    const result = await ai.run(CLOUDFLARE_AI_MODELS.vision, {
      messages: [
        {
          role: "system",
          content:
            "You analyze jersey source images for a sublimation-production workflow. Do not redesign the jersey.",
        },
        {
          role: "user",
          content:
            "Identify the visible jersey structure, colors, patterns, logos, text, names, numbers, sponsor marks, sleeve/collar details, and photography distortions. Return a concise production-analysis description.",
        },
      ],
      image: imageDataUrl,
    });

    return {
      available: true,
      model: CLOUDFLARE_AI_MODELS.vision,
      result: extractTextResult(result),
    };
  } catch (error) {
    return {
      available: false,
      model: CLOUDFLARE_AI_MODELS.vision,
      reason: error instanceof Error ? error.message.slice(0, 240) : "vision_analysis_unavailable",
    };
  }
}

function extractImageBase64(result: unknown): string | null {
  const clean = (value: string) => {
    if (value.startsWith("data:image/")) {
      const comma = value.indexOf(",");
      return comma >= 0 ? value.slice(comma + 1) : value;
    }
    return value;
  };

  if (typeof result === "string") return clean(result);

  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;

    if (typeof record.image === "string") return clean(record.image);

    const nestedResult = record.result;
    if (nestedResult && typeof nestedResult === "object") {
      const nested = nestedResult as Record<string, unknown>;
      if (typeof nested.image === "string") return clean(nested.image);
    }

    if (typeof record.data === "string") return clean(record.data);
  }

  return null;
}

function extractTextResult(result: unknown): unknown {
  if (!result || typeof result !== "object") return result;
  const record = result as Record<string, unknown>;

  if (typeof record.response === "string") return record.response;

  const choices = record.choices;
  if (Array.isArray(choices)) {
    const first = choices[0] as Record<string, unknown> | undefined;
    const message = first?.message as Record<string, unknown> | undefined;
    if (typeof message?.content === "string") return message.content;
  }

  return result;
}

async function fileToDataUrl(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return `data:${file.type || "image/jpeg"};base64,${btoa(binary)}`;
}

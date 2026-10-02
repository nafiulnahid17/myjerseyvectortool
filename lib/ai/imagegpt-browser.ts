export type ImageGptWorkflow =
  | "image-to-vector-analysis"
  | "image-to-vector-final"
  | "customize"
  | "oneclick";

type RunArgs = {
  image: File;
  workflow: ImageGptWorkflow;
  pattern?: string;
  quality?: string;
  aspectRatio?: string;
  customizationPrompt?: string;
};

export async function runImageWorkflow(
  args: RunArgs,
) {
  const prepared =
    await prepareImageGptGeneration(
      args,
    );

  try {
    const direct =
      await fetchImageGptDirect(
        prepared.directUrl,
      );

    return {
      ...direct,
      provider:
        "ImageGPT.cloud",
      model:
        prepared.model,
      usedFallback:
        false,
    };
  } catch (imageGptError) {
    const fallbackImage =
      await resizeForCloudflareFallback(
        args.image,
      );

    const fallback =
      await runCloudflareFallback({
        ...args,
        image:
          fallbackImage,
      });

    return {
      blob:
        await dataUrlToBlob(
          fallback.imageDataUrl,
        ),
      dataUrl:
        fallback.imageDataUrl,
      provider:
        fallback.provider,
      model:
        fallback.model,
      usedFallback:
        true,
      fallbackReason:
        imageGptError instanceof Error
          ? imageGptError.message
          : "ImageGPT request failed.",
    };
  } finally {
    await cleanupImageGptInput(
      prepared.cleanupKey,
    );
  }
}

export async function prepareImageGptGeneration(
  args: RunArgs,
) {
  const form =
    buildForm(args);

  const response =
    await fetch(
      "/api/vector-generation",
      {
        method: "POST",
        body: form,
      },
    );

  const payload =
    await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        "Could not prepare ImageGPT generation.",
    );
  }

  if (!payload?.directUrl) {
    throw new Error(
      "ImageGPT generation URL was not returned.",
    );
  }

  return payload as {
    directUrl: string;
    cleanupKey: string;
    model: string;
    message: string;
  };
}

export async function fetchImageGptDirect(
  url: string,
) {
  const controller =
    new AbortController();

  const timer =
    window.setTimeout(
      () =>
        controller.abort(),
      180000,
    );

  try {
    const response =
      await fetch(
        url,
        {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          signal:
            controller.signal,
        },
      );

    const providerError =
      response.headers.get(
        "igpt-error",
      );

    if (
      !response.ok ||
      providerError
    ) {
      throw new Error(
        providerError ||
          `ImageGPT request failed with HTTP ${response.status}.`,
      );
    }

    const blob =
      await response.blob();

    if (
      !blob.type.startsWith(
        "image/",
      )
    ) {
      throw new Error(
        `ImageGPT returned ${blob.type || "unknown data"} instead of an image.`,
      );
    }

    return {
      blob,
      dataUrl:
        await blobToDataUrl(
          blob,
        ),
    };
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name ===
        "AbortError"
    ) {
      throw new Error(
        "ImageGPT generation timed out after 180 seconds.",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(
      timer,
    );
  }
}

async function runCloudflareFallback(
  args: RunArgs,
) {
  const form =
    buildForm(args);

  form.set(
    "forceCloudflare",
    "true",
  );

  const response =
    await fetch(
      "/api/vector-generation",
      {
        method: "POST",
        body: form,
      },
    );

  const payload =
    await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        "Cloudflare fallback failed.",
    );
  }

  if (
    !payload?.imageDataUrl
  ) {
    throw new Error(
      "Cloudflare fallback returned no image.",
    );
  }

  return payload as {
    provider: string;
    model: string;
    imageDataUrl: string;
  };
}

function buildForm(
  args: RunArgs,
) {
  const form =
    new FormData();

  form.append(
    "image",
    args.image,
    args.image.name,
  );

  form.append(
    "workflow",
    args.workflow,
  );

  form.append(
    "pattern",
    args.pattern ||
      "production-black",
  );

  form.append(
    "quality",
    args.quality ||
      "hd",
  );

  form.append(
    "aspectRatio",
    args.aspectRatio ||
      "4:3",
  );

  if (
    args.customizationPrompt
  ) {
    form.append(
      "customizationPrompt",
      args.customizationPrompt,
    );
  }

  return form;
}

export async function cleanupImageGptInput(
  key?: string,
) {
  if (!key) return;

  try {
    await fetch(
      "/api/vector-generation",
      {
        method: "DELETE",
        headers: {
          "content-type":
            "application/json",
        },
        body:
          JSON.stringify({
            key,
          }),
      },
    );
  } catch {
    // Cleanup must not hide a successful generation.
  }
}

export async function validateProductionLayout(
  dataUrl: string,
) {
  const image =
    await loadImage(
      dataUrl,
    );

  const scale =
    Math.min(
      1,
      320 /
        image.naturalWidth,
    );

  const width =
    Math.max(
      80,
      Math.round(
        image.naturalWidth *
          scale,
      ),
    );

  const height =
    Math.max(
      60,
      Math.round(
        image.naturalHeight *
          scale,
      ),
    );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    width;
  canvas.height =
    height;

  const ctx =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      },
    );

  if (!ctx) {
    return {
      valid: true,
      score: 1,
      failedZones:
        [] as string[],
      note:
        "Canvas validator unavailable.",
    };
  }

  ctx.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  const pixels =
    ctx.getImageData(
      0,
      0,
      width,
      height,
    ).data;

  const zones = [
    ["left sleeve", 0.00, 0.15, 0.24, 0.82, 0.035],
    ["front body", 0.18, 0.12, 0.52, 0.76, 0.12],
    ["back body", 0.48, 0.12, 0.82, 0.76, 0.12],
    ["right sleeve", 0.76, 0.15, 1.00, 0.82, 0.035],
    ["front collar", 0.24, 0.64, 0.50, 0.96, 0.018],
    ["back collar", 0.50, 0.64, 0.76, 0.96, 0.018],
    ["top trim", 0.36, 0.00, 0.64, 0.22, 0.008],
    ["bottom trim", 0.36, 0.78, 0.64, 1.00, 0.008],
  ] as const;

  const failedZones:
    string[] = [];

  for (
    const [
      name,
      x1,
      y1,
      x2,
      y2,
      min,
    ]
    of zones
  ) {
    let total = 0;
    let foreground = 0;

    for (
      let y =
        Math.floor(
          height * y1,
        );
      y <
      Math.ceil(
        height * y2,
      );
      y++
    ) {
      for (
        let x =
          Math.floor(
            width * x1,
          );
        x <
        Math.ceil(
          width * x2,
        );
        x++
      ) {
        const i =
          (y * width +
            x) *
          4;

        total++;

        if (
          pixels[i + 3] >
            24 &&
          Math.max(
            pixels[i],
            pixels[i + 1],
            pixels[i + 2],
          ) >
            22
        ) {
          foreground++;
        }
      }
    }

    if (
      !total ||
      foreground /
        total <
        min
    ) {
      failedZones.push(
        name,
      );
    }
  }

  const score =
    (zones.length -
      failedZones.length) /
    zones.length;

  return {
    valid:
      failedZones.length <=
        1 &&
      score >=
        0.875,
    score,
    failedZones,
    note:
      failedZones.length
        ? `Missing/weak zones: ${failedZones.join(", ")}`
        : "All expected production zones contain artwork.",
  };
}

export async function traceImageToSvg(
  dataUrl: string,
  quality:
    | "4k"
    | "high"
    | "medium"
    | "low" =
      "high",
) {
  const image =
    await loadImage(
      dataUrl,
    );

  const maxEdge =
    quality === "4k"
      ? 3840
      : quality ===
          "high"
        ? 2560
        : quality ===
            "medium"
          ? 1600
          : 1024;

  const ratio =
    Math.min(
      1,
      maxEdge /
        Math.max(
          image.naturalWidth,
          image.naturalHeight,
        ),
    );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    Math.max(
      1,
      Math.round(
        image.naturalWidth *
          ratio,
      ),
    );

  canvas.height =
    Math.max(
      1,
      Math.round(
        image.naturalHeight *
          ratio,
      ),
    );

  const ctx =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      },
    );

  if (!ctx) {
    throw new Error(
      "Vector tracing is unavailable in this browser.",
    );
  }

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const {
    default: ImageTracer,
  } = await import(
    "imagetracerjs"
  );

  const colors =
    quality === "4k"
      ? 64
      : quality ===
          "high"
        ? 48
        : quality ===
            "medium"
          ? 32
          : 20;

  return ImageTracer.imagedataToSVG(
    ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    ),
    {
      ltres: 1,
      qtres: 1,
      pathomit:
        quality ===
          "low"
          ? 16
          : 6,
      colorsampling: 2,
      numberofcolors:
        colors,
      mincolorratio:
        0.01,
      scale: 1,
    },
  );
}

async function resizeForCloudflareFallback(
  file: File,
) {
  const src =
    URL.createObjectURL(
      file,
    );

  const image =
    await loadImage(
      src,
    );

  const maxEdge =
    500;

  const ratio =
    Math.min(
      1,
      maxEdge /
        Math.max(
          image.naturalWidth,
          image.naturalHeight,
        ),
    );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    Math.max(
      1,
      Math.round(
        image.naturalWidth *
          ratio,
      ),
    );

  canvas.height =
    Math.max(
      1,
      Math.round(
        image.naturalHeight *
          ratio,
      ),
    );

  const ctx =
    canvas.getContext(
      "2d",
    );

  if (!ctx) {
    throw new Error(
      "Could not prepare Cloudflare fallback reference.",
    );
  }

  ctx.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob =
    await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          "image/webp",
          0.92,
        ),
    );

  if (!blob) {
    throw new Error(
      "Could not resize Cloudflare fallback reference.",
    );
  }

  return new File(
    [blob],
    "cloudflare-reference.webp",
    {
      type:
        "image/webp",
    },
  );
}

function blobToDataUrl(
  blob: Blob,
) {
  return new Promise<string>(
    (
      resolve,
      reject,
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            String(
              reader.result ||
                "",
            ),
          );

      reader.onerror =
        () =>
          reject(
            new Error(
              "Could not read generated image.",
            ),
          );

      reader.readAsDataURL(
        blob,
      );
    },
  );
}

async function dataUrlToBlob(
  dataUrl: string,
) {
  const response =
    await fetch(
      dataUrl,
    );

  return await response.blob();
}

function loadImage(
  src: string,
) {
  return new Promise<HTMLImageElement>(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image();

      const revoke =
        src.startsWith(
          "blob:",
        );

      image.onload =
        () => {
          if (revoke) {
            URL.revokeObjectURL(
              src,
            );
          }
          resolve(image);
        };

      image.onerror =
        () => {
          if (revoke) {
            URL.revokeObjectURL(
              src,
            );
          }
          reject(
            new Error(
              "Could not load image.",
            ),
          );
        };

      image.src =
        src;
    },
  );
}

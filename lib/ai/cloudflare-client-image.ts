export async function prepareCloudflareReferenceImage(
  file: File,
  maxSide = 512,
): Promise<File> {
  if (typeof window === "undefined" || typeof createImageBitmap !== "function") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const largest = Math.max(bitmap.width, bitmap.height);

    if (
      largest <= maxSide &&
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      bitmap.close();
      return file;
    }

    const scale = Math.min(1, maxSide / largest);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error("Could not prepare AI reference image."))),
        "image/webp",
        0.94,
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "jersey";
    return new File([blob], `${baseName}-workers-ai.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    // Preserve the existing workflow for browser formats that cannot be decoded
    // locally. Cloudflare will return a provider error if the source is unsupported.
    return file;
  }
}

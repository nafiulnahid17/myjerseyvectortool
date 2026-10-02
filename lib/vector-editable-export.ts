"use client";

export type EditableVectorQuality = "high" | "medium" | "low";

export type EditableVectorPackage = {
  svg: string;
  ai: Blob;
  eps: Blob;
  pathCount: number;
};

export async function buildEditableVectorPackage(args: {
  previewUrl: string;
  quality: EditableVectorQuality;
  transparent: boolean;
  preserveLayers: boolean;
  title?: string;
  onProgress?: (progress: number, message: string) => void;
}): Promise<EditableVectorPackage> {
  const step = async (progress: number, message: string) => {
    args.onProgress?.(progress, message);
    await paint();
  };

  await step(8, "Preparing source artwork...");
  const canvas = await renderCanvas(args.previewUrl, args.quality, args.transparent);

  await step(25, "Tracing every visible element into editable vector paths...");
  const traced = await traceCanvas(canvas, args.quality);

  await step(55, "Separating and naming editable vector objects...");
  const prepared = prepareSvg(traced, args.preserveLayers, args.title || "Editable Vector Artwork");

  await step(72, "Prepared " + prepared.pathCount.toLocaleString() + " editable vector objects...");

  await step(82, "Building Illustrator-compatible editable AI artwork...");
  const ai = await makeAi(prepared.svg);

  await step(94, "Building editable EPS/PostScript artwork...");
  const eps = makeEps(prepared.svg);

  await step(100, "Editable SVG, AI and EPS files are ready.");

  return { svg: prepared.svg, ai, eps, pathCount: prepared.pathCount };
}

export async function editableSvgToPdfBlob(svg: string) {
  return await makeAi(svg);
}

export async function editableSvgToAiBlob(svg: string) {
  return await makeAi(svg);
}

export function editableSvgToEpsBlob(svg: string) {
  return makeEps(svg);
}

export async function editableSvgToRasterBlob(
  svg: string,
  format: 'png' | 'jpeg',
  maxEdge = 3000,
) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement as unknown as SVGSVGElement;
  const size = bounds(root);
  const ratio = Math.min(1, maxEdge / Math.max(size.width, size.height));
  const width = Math.max(1, Math.round(size.width * ratio));
  const height = Math.max(1, Math.round(size.height * ratio));

  const source = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(source);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Raster export canvas is unavailable.');

    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Could not create raster export.')),
        format === 'png' ? 'image/png' : 'image/jpeg',
        format === 'jpeg' ? 0.95 : undefined,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function paint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function renderCanvas(
  src: string,
  quality: EditableVectorQuality,
  transparent: boolean,
) {
  const image = await loadImage(src);
  const maxEdge = quality === "high" ? 3000 : quality === "medium" ? 2200 : 1500;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const scale = Math.min(1, maxEdge / Math.max(width, height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas vectorization is unavailable in this browser.");

  if (!transparent) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function traceCanvas(canvas: HTMLCanvasElement, quality: EditableVectorQuality) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not read source artwork for vectorization.");

  const { default: ImageTracer } = await import("imagetracerjs");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const options =
    quality === "high"
      ? { ltres: 0.7, qtres: 0.7, pathomit: 2, colorsampling: 2, numberofcolors: 72, mincolorratio: 0.002, scale: 1 }
      : quality === "medium"
        ? { ltres: 1, qtres: 1, pathomit: 5, colorsampling: 2, numberofcolors: 48, mincolorratio: 0.005, scale: 1 }
        : { ltres: 1.4, qtres: 1.4, pathomit: 9, colorsampling: 2, numberofcolors: 28, mincolorratio: 0.01, scale: 1 };

  const svg = ImageTracer.imagedataToSVG(imageData, options);
  if (!svg || !svg.includes("<svg")) throw new Error("Vector tracing failed.");
  return svg;
}

function prepareSvg(svg: string, preserveLayers: boolean, titleText: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;
  if (root.nodeName.toLowerCase() !== "svg") throw new Error("Invalid SVG output.");

  const ns = "http://www.w3.org/2000/svg";
  root.setAttribute("xmlns", ns);
  root.setAttribute("data-editable-vector", "true");
  root.setAttribute("data-typography-mode", "vector-outlines");

  const title = document.createElementNS(ns, "title");
  title.textContent = titleText;
  root.insertBefore(title, root.firstChild);

  const desc = document.createElementNS(ns, "desc");
  desc.textContent = "Editable vector artwork. Raster typography is converted to vector outlines.";
  root.insertBefore(desc, title.nextSibling);

  const shapes = Array.from(
    root.querySelectorAll("path,polygon,polyline,rect,circle,ellipse,line"),
  ).filter((node) => !node.closest("defs"));

  if (!shapes.length) throw new Error("No editable vector objects were created.");

  const artwork = document.createElementNS(ns, "g");
  artwork.setAttribute("id", "editable-artwork");
  artwork.setAttribute("data-layer", "Editable Artwork");

  const layers = new Map<string, SVGGElement>();

  shapes.forEach((node, index) => {
    node.setAttribute("id", "editable-object-" + String(index + 1).padStart(5, "0"));
    node.setAttribute("data-editable", "true");

    if (!preserveLayers) {
      artwork.appendChild(node);
      return;
    }

    const fill = getFill(node) || "unfilled";
    let group = layers.get(fill);

    if (!group) {
      group = document.createElementNS(ns, "g");
      group.setAttribute("id", "layer-" + String(layers.size + 1).padStart(3, "0"));
      group.setAttribute("data-layer", "Color Layer " + String(layers.size + 1));
      group.setAttribute("data-fill", fill);
      layers.set(fill, group);
      artwork.appendChild(group);
    }

    group.appendChild(node);
  });

  root.appendChild(artwork);
  return { svg: new XMLSerializer().serializeToString(root), pathCount: shapes.length };
}

function getFill(node: Element) {
  const direct = node.getAttribute("fill");
  if (direct) return direct.trim().toLowerCase();

  const style = node.getAttribute("style") || "";
  const match = style.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i);
  return match?.[1]?.trim().toLowerCase() || "";
}

async function makeAi(svg: string) {
  const [{ jsPDF }, svgModule] = await Promise.all([import("jspdf"), import("svg2pdf.js")]);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const element = doc.documentElement as unknown as SVGElement;
  const size = bounds(element);

  const pdf = new jsPDF({
    orientation: size.width >= size.height ? "landscape" : "portrait",
    unit: "pt",
    format: [size.width, size.height],
    compress: true,
  });

  pdf.setProperties({
    title: "My Jersey Studio Editable Vector",
    subject: "Illustrator-compatible editable vector artwork",
    creator: "My Jersey Studio",
  });

  await svgModule.svg2pdf(element, pdf, {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
  });

  return pdf.output("blob");
}

function bounds(svg: SVGElement) {
  const raw = svg.getAttribute("viewBox");
  if (raw) {
    const values = raw.trim().split(/[\s,]+/).map(Number);
    if (values.length === 4 && values.every(Number.isFinite)) {
      return { width: Math.max(1, values[2]), height: Math.max(1, values[3]) };
    }
  }

  return {
    width: Math.max(1, Number.parseFloat(svg.getAttribute("width") || "1200") || 1200),
    height: Math.max(1, Number.parseFloat(svg.getAttribute("height") || "900") || 900),
  };
}

function makeEps(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement as unknown as SVGElement;
  const size = bounds(root);

  const lines: string[] = [
    "%!PS-Adobe-3.0 EPSF-3.0",
    "%%BoundingBox: 0 0 " + Math.ceil(size.width) + " " + Math.ceil(size.height),
    "%%Creator: My Jersey Studio",
    "%%Title: Editable Vector Artwork",
    "%%LanguageLevel: 2",
    "%%Pages: 1",
    "%%EndComments",
    "1 setlinejoin",
    "1 setlinecap",
  ];

  Array.from(root.querySelectorAll("path")).forEach((path, index) => {
    const d = path.getAttribute("d");
    if (!d) return;

    const commands = pathToPs(d, size.height);
    if (!commands) return;

    const fill = parseColor(readStyle(path, "fill"));

    lines.push("% editable-object-" + String(index + 1).padStart(5, "0"));
    lines.push("gsave");
    lines.push("newpath");
    lines.push(commands);

    if (fill) {
      lines.push(fill[0].toFixed(5) + " " + fill[1].toFixed(5) + " " + fill[2].toFixed(5) + " setrgbcolor");
      lines.push("fill");
    }

    lines.push("grestore");
  });

  lines.push("showpage");
  lines.push("%%EOF");

  return new Blob([lines.join("\n")], { type: "application/postscript" });
}

function readStyle(element: Element, property: string) {
  const direct = element.getAttribute(property);
  if (direct) return direct.trim();

  const style = element.getAttribute("style") || "";
  for (const entry of style.split(";")) {
    const colon = entry.indexOf(":");
    if (colon < 0) continue;
    if (entry.slice(0, colon).trim().toLowerCase() === property.toLowerCase()) {
      return entry.slice(colon + 1).trim();
    }
  }
  return "";
}

function parseColor(value: string) {
  const color = value.trim().toLowerCase();
  if (!color || color === "none" || color === "transparent") return null;

  const rgb = color.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/);
  if (rgb) {
    return [clamp(Number(rgb[1]) / 255), clamp(Number(rgb[2]) / 255), clamp(Number(rgb[3]) / 255)] as const;
  }

  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const raw = hex[1].length === 3
      ? hex[1].split("").map((part) => part + part).join("")
      : hex[1];
    return [
      Number.parseInt(raw.slice(0, 2), 16) / 255,
      Number.parseInt(raw.slice(2, 4), 16) / 255,
      Number.parseInt(raw.slice(4, 6), 16) / 255,
    ] as const;
  }

  if (color === "white") return [1, 1, 1] as const;
  return [0, 0, 0] as const;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function pathToPs(d: string, height: number) {
  const tokens = d.match(/[MLQZmlqz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
  if (!tokens.length) return "";

  const out: string[] = [];
  let i = 0;
  let cmd = "";
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;

  const isCmd = (value: string) => /^[A-Za-z]$/.test(value);
  const read = () => Number(tokens[i++]);
  const pt = (px: number, py: number) => round(px) + " " + round(height - py);

  while (i < tokens.length) {
    if (isCmd(tokens[i])) cmd = tokens[i++];
    if (!cmd) break;

    const relative = cmd === cmd.toLowerCase();
    const upper = cmd.toUpperCase();

    if (upper === "Z") {
      out.push("closepath");
      x = sx;
      y = sy;
      cmd = "";
      continue;
    }

    if (upper === "M") {
      if (i + 1 >= tokens.length) break;
      let nx = read();
      let ny = read();
      if (relative) {
        nx += x;
        ny += y;
      }
      x = nx;
      y = ny;
      sx = x;
      sy = y;
      out.push(pt(x, y) + " moveto");
      cmd = relative ? "l" : "L";
      continue;
    }

    if (upper === "L") {
      if (i + 1 >= tokens.length) break;
      let nx = read();
      let ny = read();
      if (relative) {
        nx += x;
        ny += y;
      }
      x = nx;
      y = ny;
      out.push(pt(x, y) + " lineto");
      continue;
    }

    if (upper === "Q") {
      if (i + 3 >= tokens.length) break;
      let qx = read();
      let qy = read();
      let nx = read();
      let ny = read();

      if (relative) {
        qx += x;
        qy += y;
        nx += x;
        ny += y;
      }

      const c1x = x + (2 / 3) * (qx - x);
      const c1y = y + (2 / 3) * (qy - y);
      const c2x = nx + (2 / 3) * (qx - nx);
      const c2y = ny + (2 / 3) * (qy - ny);

      out.push(pt(c1x, c1y) + " " + pt(c2x, c2y) + " " + pt(nx, ny) + " curveto");
      x = nx;
      y = ny;
      continue;
    }

    break;
  }

  return out.join("\n");
}

function round(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)) : 0;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The uploaded artwork could not be rendered for vectorization."));
    image.src = src;
  });
}

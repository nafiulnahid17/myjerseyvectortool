import { env } from 'cloudflare:workers';
import { buildMasterCommand } from '@/lib/image-vector/master-commands';
import type { AspectRatioId, PatternId, QualityId } from '@/lib/image-vector/types';

const patterns = new Set<PatternId>(['production-black', 'transparent-layout']);
const qualities = new Set<QualityId>(['standard', 'hd', '4k-pro', 'production-vector']);
const aspects = new Set<AspectRatioId>(['4:3', '1:1', '9:16', '16:9']);

function cfg() {
  const e = env as unknown as Record<string, string | undefined>;
  return {
    key: e.OPENAI_API_KEY || e.AI_API_KEY,
    base: (e.OPENAI_IMAGE_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
    model: e.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst',
  };
}

function imageSettings(aspect: AspectRatioId, quality: QualityId) {
  const large = quality === '4k-pro' || quality === 'production-vector';
  const medium = quality === 'hd';
  const sizeMap: Record<AspectRatioId, [string, string, string]> = {
    '4:3': ['1024x768', '1536x1152', '3264x2448'],
    '1:1': ['1024x1024', '2048x2048', '2880x2880'],
    '9:16': ['720x1280', '1152x2048', '2160x3840'],
    '16:9': ['1280x720', '2048x1152', '3840x2160'],
  };
  const size = sizeMap[aspect][large ? 2 : medium ? 1 : 0];
  const renderQuality = quality === 'production-vector' ? 'max' : quality === '4k-pro' ? 'xhigh' : quality === 'hd' ? 'high' : 'medium';
  return { size, renderQuality };
}

export async function GET() {
  const c = cfg();
  return Response.json({ configured: Boolean(c.key), provider: 'OpenAI Images', model: c.model });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const image = form.get('image');
    const references = form.getAll('reference').filter((item): item is File => item instanceof File);
    const pattern = String(form.get('pattern') || '') as PatternId;
    const quality = String(form.get('quality') || '') as QualityId;
    const aspectRatio = String(form.get('aspectRatio') || '') as AspectRatioId;
    const mode = String(form.get('mode') || 'generate');
    const customizationPrompt = String(form.get('customizationPrompt') || '').slice(0, 6000);

    if (!(image instanceof File) || image.size === 0) {
      return Response.json({ error: 'Upload a source jersey image first.' }, { status: 400 });
    }
    if (image.size > 25 * 1024 * 1024) {
      return Response.json({ error: 'Source image must be 25 MB or smaller.' }, { status: 413 });
    }
    if (!patterns.has(pattern)) return Response.json({ error: 'Choose a valid production pattern.' }, { status: 400 });
    if (!qualities.has(quality)) return Response.json({ error: 'Choose a valid quality.' }, { status: 400 });
    if (!aspects.has(aspectRatio)) return Response.json({ error: 'Choose a valid aspect ratio.' }, { status: 400 });
    if (!['generate', 'edit'].includes(mode)) return Response.json({ error: 'Unsupported generation mode.' }, { status: 400 });

    const prompt = buildMasterCommand({ pattern, quality, aspectRatio, customizationPrompt });
    const c = cfg();

    if (!c.key) {
      return Response.json(
        {
          configured: false,
          message: 'OpenAI image generation is not connected yet. The workflow is ready; add OPENAI_API_KEY (or reuse AI_API_KEY) to activate real generation.',
          prompt,
          provider: 'OpenAI Images',
          model: c.model,
        },
        { status: 503 },
      );
    }

    const { size, renderQuality } = imageSettings(aspectRatio, quality);
    const outgoing = new FormData();
    outgoing.append('model', c.model);
    outgoing.append('prompt', prompt);
    outgoing.append('size', size);
    outgoing.append('quality', renderQuality);
    outgoing.append('output_format', 'png');
    outgoing.append('background', pattern === 'transparent-layout' ? 'transparent' : 'opaque');
    outgoing.append('image[]', image, image.name || 'jersey-input.png');
    for (const reference of references.slice(0, 4)) {
      outgoing.append('image[]', reference, reference.name || 'reference.png');
    }

    const response = await fetch(`${c.base}/images/edits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.key}` },
      body: outgoing,
      signal: AbortSignal.timeout(150000),
    });

    if (!response.ok) {
      const body = await response.text();
      let providerMessage = 'OpenAI image generation could not complete this request.';
      try {
        const parsed = JSON.parse(body) as { error?: { message?: string } };
        if (parsed.error?.message) providerMessage = parsed.error.message.slice(0, 500);
      } catch {}
      return Response.json({ error: providerMessage }, { status: response.status >= 400 && response.status < 500 ? response.status : 502 });
    }

    const result = (await response.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return Response.json({ error: 'The image provider returned no image.' }, { status: 502 });

    return Response.json({
      configured: true,
      imageDataUrl: `data:image/png;base64,${b64}`,
      message: mode === 'edit' ? 'Customization applied successfully.' : 'Production layout generated successfully.',
      provider: 'OpenAI Images',
      model: c.model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Vector generation failed.';
    return Response.json({ error: message === 'The operation was aborted due to timeout' ? 'Image generation timed out. Please try again.' : message }, { status: 500 });
  }
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { prepareCloudflareReferenceImage } from '@/lib/ai/cloudflare-client-image';
import { ONECLICK_MASTER_COMMAND } from '@/lib/tools/master-command';

type DownloadFormat = 'png' | 'jpg' | 'webp' | 'pdf' | 'svg';
type Quality = '4k' | 'high' | 'medium' | 'low';

const formatCards: { key: DownloadFormat; label: string; note: string }[] = [
  { key: 'svg', label: 'SVG', note: 'Scalable wrapper' },
  { key: 'png', label: 'PNG', note: 'Transparent ready' },
  { key: 'pdf', label: 'PDF', note: 'Printable sheet' },
  { key: 'jpg', label: 'JPG', note: 'Smaller file' },
  { key: 'webp', label: 'WEBP', note: 'Web friendly' },
];

const qualities: { key: Quality; label: string; note: string }[] = [
  { key: '4k', label: '4K', note: 'Ultra High' },
  { key: 'high', label: 'High', note: 'High quality' },
  { key: 'medium', label: 'Medium', note: 'Balanced' },
  { key: 'low', label: 'Low', note: 'Smaller size' },
];

export function OneClickCreationPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string>('');
  const [generatedPreview, setGeneratedPreview] = useState<string>('');
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png');
  const [quality, setQuality] = useState<Quality>('4k');
  const [status, setStatus] = useState<string>('Upload a jersey image to start one-click creation.');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMasterCommand, setShowMasterCommand] = useState(false);

  useEffect(() => {
    return () => {
      if (inputPreview.startsWith('blob:')) URL.revokeObjectURL(inputPreview);
    };
  }, [inputPreview]);

  const supportedInfo = useMemo(() => {
    if (!file) return 'Supports: JPG, PNG, WEBP, HEIC (max 20MB)';
    return `${file.name} • ${formatBytes(file.size)}`;
  }, [file]);

  const handleFileChange = (selected?: File | null) => {
    setError('');
    setStatus('');
    setGeneratedPreview('');

    if (!selected) {
      setFile(null);
      setInputPreview('');
      setStatus('Upload a jersey image to start one-click creation.');
      return;
    }

    if (!selected.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      setError('Please use an image below 20MB.');
      return;
    }

    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setInputPreview((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    setStatus('Image uploaded. Click Generate to run the default master command.');
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Upload a jersey image first.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStatus('Running the default master command with Cloudflare Workers AI...');

    try {
      const cloudflareInput = await prepareCloudflareReferenceImage(file);
      const formData = new FormData();
      formData.append('image', cloudflareInput, cloudflareInput.name);
      formData.append('pattern', 'production-black');
      formData.append('quality', mapQualityToApi(quality));
      formData.append('aspectRatio', '4:3');
      formData.append('customizationPrompt', ONECLICK_MASTER_COMMAND);

      const response = await fetch('/api/vector-generation', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Vector generation failed.');
      }

      if (!payload?.imageDataUrl) {
        throw new Error('No generated output was returned by the AI route.');
      }

      setGeneratedPreview(payload.imageDataUrl);
      setStatus('Production vector layout generated. You can now preview and download it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
      setStatus('Generation did not complete.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPreview) {
      setError('Generate an output first.');
      return;
    }

    const baseName = normalizeFileName(file?.name || 'oneclick-jersey');
    await downloadFromDataUrl(generatedPreview, downloadFormat, `${baseName}-production-layout`);
  };

  return (
    <main className="min-h-screen bg-[#020b18] text-white">
      <div className="mx-auto max-w-[1760px] px-4 py-4 sm:px-5 lg:px-6">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,13,28,0.98),rgba(3,10,22,0.96))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] lg:p-6">
          <div className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_18%),linear-gradient(90deg,rgba(9,17,33,0.98),rgba(7,30,62,0.90))] p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(0,170,255,0.08),transparent)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-[860px]">
                <div className="mb-2 inline-flex items-center gap-3 text-[15px] font-semibold text-[#b8cbff]">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(180deg,#8347ff,#5c85ff)] shadow-[0_10px_35px_rgba(98,87,255,0.35)]">
                    ✦
                  </span>
                  <span className="text-5xl font-bold tracking-tight text-white">OneClick Creation</span>
                </div>
                <p className="max-w-[920px] text-lg text-white/80">
                  Turn any jersey image into a clean, production-ready vector layout in one click.
                </p>
              </div>
              <HeroJerseyWave />
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-amber-400/35 bg-[linear-gradient(90deg,rgba(89,58,7,0.38),rgba(20,28,47,0.72))] px-5 py-4 text-[1rem] font-medium text-amber-200">
            This Tool Can Generate a Vector File in 20-45 seconds — But it may use a high quantity of tokens from your API.
          </div>

          <div className="mt-4 grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-3 lg:p-5">
            <StepChip number="1" title="Upload" description="Add your jersey image" active />
            <StepChip number="2" title="Generate" description="AI creates vector layout" />
            <StepChip number="3" title="Download" description="Get your vector file" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1.4fr_0.8fr]">
            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <PanelHeader number="1" title="Input Image" subtitle="Upload any jersey image (JPG, PNG, WEBP, etc.)" />
              <label
                className="mt-5 flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-sky-400/40 bg-[radial-gradient(circle_at_top,rgba(40,125,255,0.12),transparent_55%),rgba(255,255,255,0.02)] p-6 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files?.[0] || null);
                }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-3xl">☁</div>
                <p className="mt-5 text-[1.9rem] font-semibold leading-tight">Drag &amp; drop your image here</p>
                <p className="mt-2 text-lg text-sky-400">or click to browse</p>
                <p className="mt-3 text-sm text-white/55">Supports: JPG, PNG, WEBP, HEIC (max 20MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
                {inputPreview ? (
                  <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black/20">
                    <img src={inputPreview} alt="Uploaded jersey preview" className="h-[240px] w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleFileChange(null)}
                      className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-dashed border-white/10 bg-black/10 p-8 text-center text-white/45">
                    Your uploaded preview will appear here.
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[20px] border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-white/75">
                <p className="font-semibold text-emerald-400">Ready status</p>
                <p className="mt-2">{supportedInfo}</p>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <PanelHeader number="2" title="Generated Vector Output" subtitle="Your jersey will be converted into a production-ready vector layout." />

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#3368ff,#8a48ff)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(77,93,255,0.35)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? 'Generating...' : 'Create Vector'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMasterCommand((v) => !v)}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]"
                >
                  {showMasterCommand ? 'Hide master command' : 'Show master command'}
                </button>
              </div>

              {showMasterCommand && (
                <div className="mt-4 max-h-[210px] overflow-auto rounded-[20px] border border-white/10 bg-black/20 p-4 text-xs leading-6 text-white/70">
                  <pre className="whitespace-pre-wrap font-mono">{ONECLICK_MASTER_COMMAND}</pre>
                </div>
              )}

              <div className="mt-5 rounded-[22px] border border-white/10 bg-black/30 p-3">
                <div className="flex items-center justify-between pb-3 text-sm text-white/55">
                  <span>Generated production layout</span>
                  <span>{generatedPreview ? 'Ready' : 'Waiting for output'}</span>
                </div>
                <div className="overflow-hidden rounded-[18px] border border-white/8 bg-black">
                  {generatedPreview ? (
                    <img src={generatedPreview} alt="Generated jersey vector layout" className="h-[420px] w-full object-contain" />
                  ) : (
                    <div className="flex h-[420px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(39,77,162,0.18),transparent_35%),#04070d] text-center text-white/45">
                      <div>
                        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/10 text-2xl">⇢</div>
                        <p className="text-xl font-medium">Your AI-generated production layout will appear here.</p>
                        <p className="mt-2 text-sm text-white/40">No placeholder sample is used. Output appears only after generation.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
                <p className="font-semibold text-white">Status</p>
                <p className="mt-2">{status}</p>
                {error ? <p className="mt-2 text-rose-300">{error}</p> : null}
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <PanelHeader number="3" title="Download Vector" subtitle="Choose format and quality to download." />

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-white/85">File format</p>
                <div className="grid grid-cols-2 gap-3">
                  {formatCards.map((format) => (
                    <button
                      key={format.key}
                      type="button"
                      onClick={() => setDownloadFormat(format.key)}
                      className={[
                        'rounded-[18px] border px-4 py-4 text-left transition',
                        downloadFormat === format.key
                          ? 'border-sky-400 bg-sky-400/12 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <div className="text-lg font-bold">{format.label}</div>
                      <div className="mt-1 text-xs text-white/55">{format.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-white/85">Quality</p>
                <div className="grid grid-cols-2 gap-3">
                  {qualities.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setQuality(item.key)}
                      className={[
                        'rounded-[18px] border px-4 py-4 text-left transition',
                        quality === item.key
                          ? 'border-sky-400 bg-sky-400/12 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <div className="text-lg font-bold">{item.label}</div>
                      <div className="mt-1 text-xs text-white/55">{item.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!generatedPreview}
                className="mt-8 inline-flex w-full items-center justify-center rounded-[20px] bg-[linear-gradient(90deg,#2f7bff,#9b53ff)] px-5 py-4 text-xl font-semibold text-white shadow-[0_16px_34px_rgba(74,108,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download Now
              </button>

              <div className="mt-7 rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(180deg,#245cff,#824dff)] text-xl">💡</div>
                  <div>
                    <p className="text-xl font-semibold">Pro Tips</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                      <li>• Use clear source images for better results.</li>
                      <li>• The AI runs the default master command automatically on generate.</li>
                      <li>• Download after previewing the final production layout.</li>
                      <li>• Use PDF or PNG for review, SVG for scalable wrapping output.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function PanelHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(180deg,#2d8cff,#7154ff)] text-3xl font-bold text-white shadow-[0_10px_25px_rgba(57,122,255,0.35)]">
        {number}
      </div>
      <div>
        <h2 className="text-[2rem] font-bold leading-tight text-white">{title}</h2>
        <p className="mt-1 text-[1rem] text-white/65">{subtitle}</p>
      </div>
    </div>
  );
}

function StepChip({ number, title, description, active = false }: { number: string; title: string; description: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-black/15 px-5 py-4">
      <div className={[
        'grid h-14 w-14 place-items-center rounded-full text-2xl font-bold',
        active ? 'bg-[linear-gradient(180deg,#2d8cff,#7154ff)] text-white' : 'bg-white/12 text-[#a9c8ff]',
      ].join(' ')}>
        {number}
      </div>
      <div>
        <p className="text-[1.5rem] font-semibold text-white">{title}</p>
        <p className="text-sm text-white/55">{description}</p>
      </div>
    </div>
  );
}

function HeroJerseyWave() {
  return (
    <div className="hidden xl:block">
      <svg width="430" height="130" viewBox="0 0 430 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-95">
        <path d="M0 105C52 72 84 63 130 76C172 88 204 119 250 116C304 112 335 54 377 46C397 42 412 44 430 52" stroke="#39d0ff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M0 81C52 48 85 38 130 50C173 62 204 97 247 96C295 95 328 48 368 34C389 27 408 27 430 37" stroke="#7e5eff" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
        <path d="M205 18L230 0L304 0L335 23L316 94L214 94L205 18Z" fill="url(#paint0_linear)" stroke="rgba(255,255,255,0.18)" />
        <path d="M234 15L246 30H292L304 15" fill="#07152b" stroke="#061122" strokeWidth="2.3" />
        <path d="M226 19L216 28L205 30V95H334V30L322 28L313 19H226Z" fill="#0b2445" opacity="0.95" />
        <path d="M250 31V94M289 31V94" stroke="#ef4444" strokeWidth="5" opacity="0.8" />
        <path d="M263 31V94" stroke="#1e3a8a" strokeWidth="5" opacity="0.9" />
        <path d="M205 67H334" stroke="rgba(255,255,255,0.08)" />
        <defs>
          <linearGradient id="paint0_linear" x1="270" y1="0" x2="270" y2="94" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0b233f" />
            <stop offset="1" stopColor="#09192d" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function mapQualityToApi(quality: Quality) {
  switch (quality) {
    case '4k':
      return '4k-pro';
    case 'high':
      return 'hd';
    case 'medium':
      return 'standard';
    case 'low':
      return 'standard';
  }
}

async function downloadFromDataUrl(dataUrl: string, format: DownloadFormat, baseName: string) {
  if (format === 'pdf') {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1024, 768] });
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1024, 768);
    pdf.save(`${baseName}.pdf`);
    return;
  }

  if (format === 'svg') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><rect width="1600" height="1200" fill="#000"/><image href="${dataUrl}" x="0" y="0" width="1600" height="1200" preserveAspectRatio="xMidYMid meet"/></svg>`;
    triggerBlobDownload(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${baseName}.svg`);
    return;
  }

  const mime = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = await loadImage(dataUrl);
  canvas.width = image.width;
  canvas.height = image.height;
  if (ctx) {
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0);
  }
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.95));
  if (!blob) throw new Error('Could not prepare the selected download format.');
  triggerBlobDownload(blob, `${baseName}.${format}`);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image loading failed.'));
    image.src = src;
  });
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeFileName(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
}

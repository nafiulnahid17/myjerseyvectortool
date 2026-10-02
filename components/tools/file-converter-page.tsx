'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';

type FormatKey = 'png' | 'jpg' | 'svg' | 'pdf' | 'webp' | 'ai' | 'eps';
type QualityKey = 'high' | 'medium' | 'low';

type PreviewMode = '2d' | '3d';

const outputFormats: { key: FormatKey; title: string; kind: string; enabled: boolean }[] = [
  { key: 'png', title: 'PNG', kind: 'Image', enabled: true },
  { key: 'jpg', title: 'JPG', kind: 'Image', enabled: true },
  { key: 'svg', title: 'SVG', kind: 'Vector', enabled: true },
  { key: 'pdf', title: 'PDF', kind: 'Document', enabled: true },
  { key: 'webp', title: 'WEBP', kind: 'Image', enabled: true },
  { key: 'ai', title: 'AI', kind: 'Illustrator', enabled: false },
  { key: 'eps', title: 'EPS', kind: 'Vector', enabled: false },
];

const qualityOptions: { key: QualityKey; title: string; note: string }[] = [
  { key: 'high', title: 'High', note: 'Best quality' },
  { key: 'medium', title: 'Medium', note: 'Balanced' },
  { key: 'low', title: 'Low', note: 'Small size' },
];

export function FileConverterPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('2d');
  const [selectedFormat, setSelectedFormat] = useState<FormatKey>('png');
  const [quality, setQuality] = useState<QualityKey>('high');
  const [transparent, setTransparent] = useState(true);
  const [preserveLayers, setPreserveLayers] = useState(true);
  const [optimizeWeb, setOptimizeWeb] = useState(false);
  const [optimizePrint, setOptimizePrint] = useState(false);
  const [status, setStatus] = useState('Upload a file to begin conversion.');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canRenderPreview = useMemo(() => {
    if (!file) return false;
    return file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.svg');
  }, [file]);

  const supportedFormatsText = 'AI, SVG, EPS, PDF, PNG, JPG, JPEG, WEBP, PSD, CDR, HEIC, TIFF and more';

  const handlePick = (selected?: File | null) => {
    setError('');
    if (!selected) {
      setFile(null);
      setPreviewUrl('');
      setStatus('Upload a file to begin conversion.');
      return;
    }

    setFile(selected);
    if (selected.type.startsWith('image/') || selected.name.toLowerCase().endsWith('.svg')) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      setPreviewUrl('');
    }
    setStatus('File uploaded successfully. Choose output format and download when ready.');
  };

  const handleDownload = async () => {
    if (!file) {
      setError('Upload a file first.');
      return;
    }

    setError('');

    if (!isFormatEnabled(selectedFormat)) {
      setError(`${selectedFormat.toUpperCase()} export will be enabled after the dedicated server-side conversion engine is connected.`);
      return;
    }

    const baseName = normalizeName(file.name);

    if (selectedFormat === 'pdf') {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1400, 980] });
      if (previewUrl) {
        const dataUrl = await dataUrlFromPreview(previewUrl, quality, transparent);
        pdf.addImage(dataUrl, 'PNG', 40, 40, 1320, 900);
      } else {
        pdf.setFontSize(22);
        pdf.text(`Converted File: ${file.name}`, 40, 60);
        pdf.setFontSize(14);
        pdf.text('Binary file attached to the workflow. Visual preview is not available in-browser for this format.', 40, 92);
      }
      pdf.save(`${baseName}.pdf`);
      return;
    }

    if (selectedFormat === 'svg') {
      if (file.name.toLowerCase().endsWith('.svg')) {
        triggerDownload(file, `${baseName}.svg`);
        return;
      }
      if (!previewUrl) {
        setError('SVG wrapper export requires an image preview.');
        return;
      }
      const dataUrl = await dataUrlFromPreview(previewUrl, quality, transparent);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><rect width="1600" height="1200" fill="${transparent ? 'transparent' : '#ffffff'}"/><image href="${dataUrl}" x="0" y="0" width="1600" height="1200" preserveAspectRatio="xMidYMid meet"/></svg>`;
      triggerDownload(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${baseName}.svg`);
      return;
    }

    if (selectedFormat === 'png' || selectedFormat === 'jpg' || selectedFormat === 'webp') {
      if (!previewUrl) {
        setError('This file type cannot be preview-converted directly in-browser.');
        return;
      }
      const mime = selectedFormat === 'jpg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
      const blob = await renderBlobFromPreview(previewUrl, mime, quality, transparent);
      triggerDownload(blob, `${baseName}.${selectedFormat}`);
      return;
    }
  };

  return (
    <main className="min-h-screen bg-[#020b18] text-white">
      <div className="mx-auto max-w-[1760px] px-4 py-4 sm:px-5 lg:px-6">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,13,28,0.98),rgba(3,10,22,0.96))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] lg:p-6">
          <div className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.20),transparent_18%),linear-gradient(90deg,rgba(9,17,33,0.98),rgba(7,30,62,0.90))] p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(0,170,255,0.08),transparent)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-[860px]">
                <div className="mb-2 inline-flex items-center gap-4 text-[15px] font-semibold text-[#b8cbff]">
                  <span className="grid h-20 w-20 place-items-center rounded-[22px] border border-sky-400/35 bg-[linear-gradient(180deg,rgba(16,84,165,0.35),rgba(11,25,58,0.42))] text-4xl shadow-[0_10px_35px_rgba(33,124,255,0.30)]">
                    ↻
                  </span>
                  <div>
                    <span className="block text-5xl font-bold tracking-tight text-white">File Converter</span>
                    <span className="mt-2 block text-lg text-white/75">Convert your jersey design files between different formats, quickly and easily.</span>
                  </div>
                </div>
              </div>
              <ConverterHeroArt />
            </div>
            <div className="relative mt-5 flex flex-wrap gap-3 text-sm text-white/85">
              <Badge text="50+ File Formats" />
              <Badge text="High Quality Output" />
              <Badge text="Preserves Layers (where possible)" />
              <Badge text="Fast & Secure Conversion" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4 lg:p-5">
            <StepItem number="1" title="Upload" subtitle="Add your file" active />
            <StepItem number="2" title="Settings" subtitle="Choose format & options" />
            <StepItem number="3" title="Preview" subtitle="Check before conversion" />
            <StepItem number="4" title="Download" subtitle="Get your file" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr_1.2fr]">
            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <Panel number="1" title="Upload File" subtitle="Upload any design file you want to convert." />
              <label
                className="mt-5 flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-sky-400/40 bg-[radial-gradient(circle_at_top,rgba(40,125,255,0.12),transparent_55%),rgba(255,255,255,0.02)] p-6 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handlePick(e.dataTransfer.files?.[0] || null);
                }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-3xl">☁</div>
                <p className="mt-5 text-[1.9rem] font-semibold leading-tight">Drag &amp; drop your file here</p>
                <p className="mt-2 text-lg text-sky-400">or click to browse</p>
                <p className="mt-3 text-sm text-white/55">Supports: {supportedFormatsText}</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".ai,.svg,.eps,.pdf,.png,.jpg,.jpeg,.webp,.psd,.cdr,.heic,.tiff,image/*"
                  className="hidden"
                  onChange={(e) => handlePick(e.target.files?.[0] || null)}
                />
              </label>

              {file ? (
                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-3">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Uploaded preview" className="h-20 w-20 rounded-2xl border border-white/10 object-cover" />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/5 text-2xl">📄</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-white">{file.name}</p>
                      <p className="text-sm text-white/55">{formatFileSize(file.size)}</p>
                    </div>
                    <button type="button" onClick={() => handlePick(null)} className="text-2xl text-white/60 transition hover:text-white">×</button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 rounded-[20px] border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
                {status}
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <Panel number="2" title="Choose Format & Settings" subtitle="Select the output format and adjust options." />

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-white/85">Output format</p>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {outputFormats.map((format) => (
                    <button
                      key={format.key}
                      type="button"
                      onClick={() => setSelectedFormat(format.key)}
                      className={[
                        'rounded-[18px] border px-4 py-4 text-left transition',
                        !format.enabled ? 'opacity-55' : '',
                        selectedFormat === format.key
                          ? 'border-sky-400 bg-sky-400/12 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <div className="text-lg font-bold">{format.title}</div>
                      <div className="mt-1 text-xs text-white/55">{format.kind}</div>
                    </button>
                  ))}
                </div>
                {!isFormatEnabled(selectedFormat) ? (
                  <p className="mt-3 text-sm text-amber-300">
                    {selectedFormat.toUpperCase()} export requires the dedicated vector conversion engine and is not being faked in this build.
                  </p>
                ) : null}
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-white/85">Quality</p>
                <div className="grid grid-cols-3 gap-3">
                  {qualityOptions.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setQuality(item.key)}
                      className={[
                        'rounded-[18px] border px-4 py-4 text-center transition',
                        quality === item.key
                          ? 'border-sky-400 bg-sky-400/12 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <div className="text-xl font-semibold">{item.title}</div>
                      <div className="text-xs text-white/55">{item.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-white/85">Additional options</p>
                <div className="space-y-3">
                  <SwitchRow label="Keep Transparent Background (if supported)" enabled={transparent} onChange={setTransparent} />
                  <SwitchRow label="Preserve Layers (where possible)" enabled={preserveLayers} onChange={setPreserveLayers} />
                  <SwitchRow label="Optimize for Web" enabled={optimizeWeb} onChange={setOptimizeWeb} />
                  <SwitchRow label="Optimize for Print (300 DPI)" enabled={optimizePrint} onChange={setOptimizePrint} />
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <Panel number="3" title="Preview" subtitle="Check how your file will look after conversion." />

              <div className="mt-5 flex rounded-[18px] border border-white/10 bg-white/[0.03] p-1">
                {(['2d', '3d'] as PreviewMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={[
                      'flex-1 rounded-[14px] px-4 py-3 text-sm font-semibold transition',
                      previewMode === mode ? 'bg-[linear-gradient(90deg,#107dff,#3b9dff)] text-white' : 'text-white/65',
                    ].join(' ')}
                  >
                    {mode === '2d' ? '2D Preview' : '3D Mockup (Preview)'}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-3">
                <div className="flex h-[420px] items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eeeeee,#dddddd)]">
                  {previewUrl && canRenderPreview ? (
                    previewMode === '2d' ? (
                      <img src={previewUrl} alt="2D preview" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.12),transparent_50%)]">
                        <img
                          src={previewUrl}
                          alt="3D preview"
                          className="max-h-[88%] max-w-[82%] rounded-[18px] shadow-[0_40px_80px_rgba(0,0,0,0.30)]"
                          style={{ transform: 'perspective(1300px) rotateY(-16deg) rotateX(7deg)', transformOrigin: 'center center' }}
                        />
                      </div>
                    )
                  ) : (
                    <div className="px-6 text-center text-slate-600">
                      <p className="text-xl font-semibold text-slate-700">Preview will appear after upload</p>
                      <p className="mt-2 text-sm">No sample data is used here. Preview uses only your real uploaded file.</p>
                    </div>
                  )}
                </div>
              </div>

              {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

              <button
                type="button"
                onClick={handleDownload}
                className="mt-5 inline-flex w-full items-center justify-center rounded-[20px] bg-[linear-gradient(90deg,#2f7bff,#9b53ff)] px-5 py-4 text-xl font-semibold text-white shadow-[0_16px_34px_rgba(74,108,255,0.35)]"
              >
                Download Converted File
              </button>
            </section>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.9fr]">
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <h3 className="text-[1.7rem] font-bold">Supported Formats</h3>
              <p className="mt-1 text-white/65">We support a wide range of file formats for input and output.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['AI', 'SVG', 'EPS', 'PDF', 'PNG', 'JPG', 'JPEG', 'WEBP', 'PSD', 'CDR', 'HEIC', 'TIFF'].map((item) => (
                  <span key={item} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/80">{item}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <h3 className="text-[1.7rem] font-bold">Need Help?</h3>
              <p className="mt-3 text-white/65">If you face any issues with file conversion, check our help guide or contact support.</p>
              <button className="mt-6 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85">View Help Guide</button>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,16,34,0.98),rgba(4,12,26,0.96))] p-5">
              <h3 className="text-[1.7rem] font-bold">Pro Tips</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-white/65">
                <li>• Use vector formats (SVG, AI, EPS) when source vector data is available.</li>
                <li>• Enable transparent background for PNG exports when needed.</li>
                <li>• Keep layers if you plan to edit later.</li>
                <li>• For printing, use high quality (300 DPI or higher).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Panel({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
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

function StepItem({ number, title, subtitle, active = false }: { number: string; title: string; subtitle: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-black/15 px-5 py-4">
      <div className={[
        'grid h-14 w-14 place-items-center rounded-full text-2xl font-bold',
        active ? 'bg-[linear-gradient(180deg,#2d8cff,#7154ff)] text-white' : 'bg-white/12 text-[#a9c8ff]',
      ].join(' ')}>
        {number}
      </div>
      <div>
        <p className="text-[1.3rem] font-semibold text-white">{title}</p>
        <p className="text-sm text-white/55">{subtitle}</p>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return <span className="rounded-full border border-cyan-400/25 bg-cyan-400/8 px-4 py-2 font-medium">{text}</span>;
}

function SwitchRow({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!enabled)} className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
      <span className="text-white/80">{label}</span>
      <span className={[
        'relative inline-flex h-7 w-14 items-center rounded-full transition',
        enabled ? 'bg-[#1877ff]' : 'bg-white/15',
      ].join(' ')}>
        <span className={[
          'inline-block h-6 w-6 rounded-full bg-white transition',
          enabled ? 'translate-x-7' : 'translate-x-1',
        ].join(' ')} />
      </span>
    </button>
  );
}

function ConverterHeroArt() {
  return (
    <svg width="420" height="130" viewBox="0 0 420 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
      <g transform="translate(30 18) rotate(-10 40 45)">
        <rect width="64" height="84" rx="10" fill="#f6b62e" />
        <text x="32" y="42" textAnchor="middle" fill="white" fontSize="20" fontWeight="700">AI</text>
      </g>
      <g transform="translate(110 6) rotate(-6 40 45)">
        <rect width="64" height="84" rx="10" fill="#2f8fff" />
        <text x="32" y="42" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">SVG</text>
      </g>
      <g transform="translate(190 12) rotate(7 40 45)">
        <rect width="64" height="84" rx="10" fill="#ef4444" />
        <text x="32" y="42" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">PDF</text>
      </g>
      <g transform="translate(270 12) rotate(6 40 45)">
        <rect width="64" height="84" rx="10" fill="#25a7ff" />
        <text x="32" y="42" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">PNG</text>
      </g>
      <g transform="translate(345 18) rotate(8 40 45)">
        <rect width="64" height="84" rx="10" fill="#7970ff" />
        <text x="32" y="42" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">JPG</text>
      </g>
      <path d="M116 84C135 98 154 101 175 88" stroke="#2aa8ff" strokeDasharray="6 5" strokeWidth="2.5" />
      <path d="M192 91C215 107 240 104 263 85" stroke="#2aa8ff" strokeDasharray="6 5" strokeWidth="2.5" />
      <path d="M103 95C110 107 117 112 128 115" stroke="#ff9544" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M198 103C208 114 220 117 235 113" stroke="#ff9544" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function isFormatEnabled(format: FormatKey) {
  return outputFormats.find((item) => item.key === format)?.enabled ?? false;
}

async function dataUrlFromPreview(previewUrl: string, quality: QualityKey, transparent: boolean) {
  const mime = 'image/png';
  const blob = await renderBlobFromPreview(previewUrl, mime, quality, transparent);
  return await blobToDataUrl(blob);
}

async function renderBlobFromPreview(previewUrl: string, mime: string, quality: QualityKey, transparent: boolean) {
  const img = await loadImage(previewUrl);
  const canvas = document.createElement('canvas');
  const scale = quality === 'high' ? 1.5 : quality === 'medium' ? 1.1 : 1;
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');
  if (!transparent || mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.94));
  if (!blob) throw new Error('Conversion failed.');
  return blob;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Preview could not be loaded.'));
    img.src = src;
  });
}

function triggerDownload(blob: Blob | File, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not prepare preview data.'));
    reader.readAsDataURL(blob);
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeName(filename: string) {
  return filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
}

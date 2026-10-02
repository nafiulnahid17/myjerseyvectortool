'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  Download,
  FileCog,
  FileImage,
  FolderOpen,
  Globe,
  Home,
  Image as ImageIcon,
  Layers3,
  LoaderCircle,
  Menu,
  PackageOpen,
  Palette,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  SwatchBook,
  Type,
  Upload,
  WandSparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type {
  AspectRatioId,
  ExportFormat,
  ExportQuality,
  GenerationResponse,
  PatternId,
  PatternPreset,
  QualityId,
  StudioPhase,
} from '@/lib/image-vector/types';

const patterns: PatternPreset[] = [
  {
    id: 'production-black',
    title: 'Production Black',
    subtitle: '8 separated parts on pure black',
    preview: '/patterns/pattern-1-production.webp',
    defaultAspect: '4:3',
    background: 'opaque',
  },
  {
    id: 'transparent-layout',
    title: 'Transparent Layout',
    subtitle: '8 isolated parts, no background',
    preview: '/patterns/pattern-2-transparent-reference.webp',
    defaultAspect: '4:3',
    background: 'transparent',
  },
];

const qualities: Array<{ id: QualityId; title: string; subtitle: string }> = [
  { id: 'standard', title: 'Standard', subtitle: 'Faster draft' },
  { id: 'hd', title: 'HD', subtitle: 'High detail' },
  { id: '4k-pro', title: '4K Pro', subtitle: 'Production review' },
  { id: 'production-vector', title: 'Production Vector', subtitle: 'Maximum trace quality' },
];

const aspects: AspectRatioId[] = ['4:3', '1:1', '9:16', '16:9'];
const exportFormats: Array<{ id: ExportFormat; title: string; subtitle: string }> = [
  { id: 'svg', title: 'SVG', subtitle: 'Traced vector' },
  { id: 'ai', title: 'AI', subtitle: 'Illustrator-compatible' },
  { id: 'pdf', title: 'PDF', subtitle: 'Print ready' },
  { id: 'png', title: 'PNG', subtitle: 'Lossless image' },
  { id: 'jpeg', title: 'JPEG', subtitle: 'Universal image' },
];
const exportQualities: Array<{ id: ExportQuality; title: string }> = [
  { id: '4k', title: '4K' },
  { id: 'high', title: 'High' },
  { id: 'medium', title: 'Medium' },
  { id: 'low', title: 'Low' },
];

const steps = [
  { key: 'setup', number: 1, label: 'Upload & Settings' },
  { key: 'result', number: 2, label: 'Generate' },
  { key: 'customize', number: 3, label: 'Customize' },
  { key: 'preview', number: 4, label: 'Preview' },
  { key: 'download', number: 5, label: 'Download' },
] as const;

const phaseRank: Record<StudioPhase, number> = {
  setup: 1,
  generating: 2,
  result: 2,
  customize: 3,
  preview: 4,
  download: 5,
};

const quickRows = [
  { key: 'playerName', label: 'Player Name', icon: Type, placeholder: 'Enter player name' },
  { key: 'jerseyNumber', label: 'Jersey Number', icon: Type, placeholder: 'Enter jersey number' },
  { key: 'teamName', label: 'Team Name', icon: Type, placeholder: 'Enter team name' },
  { key: 'sponsorText', label: 'Sponsor Text', icon: Type, placeholder: 'Enter sponsor text' },
] as const;

const styleRows = [
  { key: 'patternStyle', label: 'Pattern Style', icon: SwatchBook, placeholder: 'e.g. Keep original / simplify' },
  { key: 'fontStyle', label: 'Font Style', icon: Type, placeholder: 'e.g. Bold athletic' },
  { key: 'collarStyle', label: 'Collar Style', icon: Pencil, placeholder: 'e.g. V-neck, rib trim' },
  { key: 'sleeveStyle', label: 'Sleeve Style', icon: Pencil, placeholder: 'e.g. Keep cuff stripes' },
  { key: 'addText', label: 'Add Text', icon: Type, placeholder: 'Extra text and placement' },
  { key: 'removeElement', label: 'Remove Element', icon: X, placeholder: 'Element to remove' },
] as const;

type CustomizeValues = {
  playerName: string;
  jerseyNumber: string;
  teamName: string;
  sponsorText: string;
  primaryColor: string;
  secondaryColor: string;
  patternStyle: string;
  fontStyle: string;
  collarStyle: string;
  sleeveStyle: string;
  addText: string;
  removeElement: string;
};

const emptyCustomize: CustomizeValues = {
  playerName: '',
  jerseyNumber: '',
  teamName: '',
  sponsorText: '',
  primaryColor: '#0f7cff',
  secondaryColor: '#ffffff',
  patternStyle: '',
  fontStyle: '',
  collarStyle: '',
  sleeveStyle: '',
  addText: '',
  removeElement: '',
};

export function ImageToVectorStudio() {
  const inputRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<StudioPhase>('setup');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [pattern, setPattern] = useState<PatternId | null>(null);
  const [quality, setQuality] = useState<QualityId>('hd');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('4:3');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [resultMode, setResultMode] = useState<'generate' | 'edit'>('generate');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [providerConfigured, setProviderConfigured] = useState<boolean | null>(null);
  const [providerModel, setProviderModel] = useState<string>('');
  const [customize, setCustomize] = useState<CustomizeValues>(emptyCustomize);
  const [customPrompt, setCustomPrompt] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg');
  const [exportQuality, setExportQuality] = useState<ExportQuality>('4k');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/vector-generation')
      .then((response) => response.json())
      .then((data: { configured?: boolean; model?: string }) => {
        setProviderConfigured(Boolean(data.configured));
        setProviderModel(data.model || '');
      })
      .catch(() => setProviderConfigured(false));
  }, []);

  useEffect(() => {
    return () => {
      if (sourceUrl.startsWith('blob:')) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  const selectedPattern = useMemo(() => patterns.find((item) => item.id === pattern) || null, [pattern]);
  const visibleOutput = generatedUrl || sourceUrl;
  const isPreviewOnly = Boolean(visibleOutput) && !generatedUrl;

  function chooseSource(file?: File | null) {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setError('Please choose an image up to 25 MB.');
      return;
    }
    if (sourceUrl.startsWith('blob:')) URL.revokeObjectURL(sourceUrl);
    setSourceFile(file);
    setSourceUrl(URL.createObjectURL(file));
    setGeneratedUrl('');
    setError('');
    setStatusMessage('');
  }

  function choosePattern(next: PatternPreset) {
    setPattern(next.id);
    setAspectRatio(next.defaultAspect);
    setError('');
  }

  async function generate(mode: 'generate' | 'edit') {
    if (!sourceFile) {
      setError('Upload a jersey image before continuing.');
      return;
    }
    if (!pattern) {
      setError('Choose a production pattern before continuing.');
      return;
    }

    setError('');
    setResultMode(mode);
    setStatusMessage(mode === 'edit' ? 'Applying your customization…' : 'Preparing the production layout…');
    setPhase('generating');

    const customizationPrompt = mode === 'edit' ? buildCustomizationPrompt(customize, customPrompt) : '';
    const activeFile = mode === 'edit' && generatedUrl ? await dataUrlToFile(generatedUrl, 'generated-layout.png') : sourceFile;
    const form = new FormData();
    form.append('image', activeFile, activeFile.name);
    form.append('pattern', pattern);
    form.append('quality', quality);
    form.append('aspectRatio', aspectRatio);
    form.append('mode', mode);
    if (customizationPrompt) form.append('customizationPrompt', customizationPrompt);
    if (logoFile) form.append('reference', logoFile, logoFile.name);

    try {
      const response = await fetch('/api/vector-generation', { method: 'POST', body: form });
      const data = (await response.json()) as GenerationResponse & { error?: string };
      if (!response.ok) {
        if (response.status === 503 && data.configured === false) {
          setProviderConfigured(false);
          setStatusMessage(data.message);
          setPhase('result');
          return;
        }
        throw new Error(data.error || data.message || 'Generation failed.');
      }
      if (!data.imageDataUrl) throw new Error('The image service returned no output.');
      setGeneratedUrl(data.imageDataUrl);
      setProviderConfigured(true);
      setProviderModel(data.model || providerModel);
      setStatusMessage(data.message || 'Production layout ready.');
      setPhase('result');
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Generation failed.');
      setPhase(mode === 'edit' ? 'customize' : 'setup');
    }
  }

  async function downloadCurrent() {
    if (!visibleOutput) {
      setError('Generate or prepare an output before downloading.');
      return;
    }
    setExporting(true);
    setError('');
    try {
      await exportArtwork(visibleOutput, exportFormat, exportQuality, selectedPattern?.background === 'transparent');
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  }

  const currentStep = phaseRank[phase];

  return (
    <main className="min-h-screen bg-[#020812] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1900px]">
        <StudioSidebar />

        <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#07111f]/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,.28)] backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] xl:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-medium text-sky-400">My Jersey Studio</p>
                <h1 className="truncate text-lg font-bold sm:text-xl">Image to Vector</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65 md:block">
                {providerConfigured === null
                  ? 'Checking AI engine…'
                  : providerConfigured
                    ? `OpenAI connected${providerModel ? ` · ${providerModel}` : ''}`
                    : 'OpenAI image engine ready for API key'}
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/80">
                <Globe className="h-4 w-4" /> English <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </header>

          <StepRail currentStep={currentStep} />

          {error ? (
            <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-100/70 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
          ) : null}

          <div className="mt-5">
            {phase === 'setup' ? (
              <SetupPhase
                sourceFile={sourceFile}
                sourceUrl={sourceUrl}
                pattern={pattern}
                quality={quality}
                aspectRatio={aspectRatio}
                onChooseFile={() => inputRef.current?.click()}
                onDropFile={chooseSource}
                onChoosePattern={choosePattern}
                onQuality={setQuality}
                onAspect={setAspectRatio}
                onGenerate={() => void generate('generate')}
              />
            ) : null}

            {phase === 'generating' ? <GeneratingPhase message={statusMessage} pattern={selectedPattern} sourceUrl={sourceUrl} /> : null}

            {phase === 'result' ? (
              <ResultPhase
                outputUrl={visibleOutput}
                previewOnly={isPreviewOnly}
                statusMessage={statusMessage}
                pattern={selectedPattern}
                quality={quality}
                aspectRatio={aspectRatio}
                afterEdit={resultMode === 'edit'}
                onBack={() => setPhase(resultMode === 'edit' ? 'customize' : 'setup')}
                onDownload={() => setPhase('download')}
                onCustomize={() => setPhase('customize')}
                onPreview={() => setPhase('preview')}
              />
            ) : null}

            {phase === 'customize' ? (
              <CustomizePhase
                outputUrl={visibleOutput}
                values={customize}
                prompt={customPrompt}
                logoFile={logoFile}
                onValue={(key, value) => setCustomize((prev) => ({ ...prev, [key]: value }))}
                onPrompt={setCustomPrompt}
                onLogo={() => logoRef.current?.click()}
                onReset={() => {
                  setCustomize(emptyCustomize);
                  setCustomPrompt('');
                  setLogoFile(null);
                }}
                onRegenerate={() => void generate('edit')}
                onNext={() => setPhase('preview')}
              />
            ) : null}

            {phase === 'preview' ? (
              <PreviewPhase
                outputUrl={visibleOutput}
                mode={previewMode}
                onMode={setPreviewMode}
                onEdit={() => setPhase('customize')}
                onNext={() => setPhase('download')}
              />
            ) : null}

            {phase === 'download' ? (
              <DownloadPhase
                outputUrl={visibleOutput}
                format={exportFormat}
                quality={exportQuality}
                exporting={exporting}
                previewOnly={isPreviewOnly}
                onFormat={setExportFormat}
                onQuality={setExportQuality}
                onBack={() => setPhase('preview')}
                onDownload={() => void downloadCurrent()}
              />
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*,.heic,.heif"
        onChange={(event) => chooseSource(event.target.files?.[0])}
      />
      <input
        ref={logoRef}
        className="hidden"
        type="file"
        accept="image/*,.svg"
        onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
      />
    </main>
  );
}

function StudioSidebar() {
  const first = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/new-project', label: 'New Project', icon: Plus },
    { href: '/image-to-vector', label: 'Image To Vector', icon: ImageIcon, active: true },
    { href: '/oneclick-creation', label: 'Oneclick Creation', icon: WandSparkles },
    { href: '/file-converter', label: 'File Converter', icon: FileCog },
    { href: '/edit-existing-file', label: 'Edit Existing File', icon: SquarePen },
    { href: '/backup', label: 'Fallback Backup', icon: ShieldCheck },
  ];
  const second = [
    { href: '/projects', label: 'My Projects', icon: FolderOpen },
    { href: '/templates', label: 'Templates', icon: FileImage },
    { href: '/design-elements', label: 'Design Elements', icon: Layers3 },
    { href: '/mockup-generator', label: 'Mockup Generator', icon: PackageOpen },
    { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help-support', label: 'Help & Support', icon: CircleHelp },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[245px] shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#06101d,#020711)] p-4 xl:block">
      <div className="px-2 pb-5 pt-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#f8fbff,#d8edff)] text-xl font-black text-[#07101f]">
            <span>M<span className="text-[#117bff]">J</span></span>
          </div>
          <div>
            <p className="text-[1.15rem] font-black leading-none tracking-wide">MY JERSEY</p>
            <p className="mt-1 text-xs font-bold tracking-[0.35em] text-[#1589ff]">STUDIO</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {first.map((item) => <SideLink key={item.label} {...item} />)}
      </nav>
      <div className="my-5 h-px bg-white/10" />
      <nav className="space-y-1.5">
        {second.map((item) => <SideLink key={item.label} {...item} />)}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-amber-400/30 bg-[linear-gradient(180deg,rgba(104,66,4,.34),rgba(58,38,3,.20))] p-4">
        <p className="text-sm font-bold text-amber-200">Production workspace</p>
        <p className="mt-1 text-xs leading-5 text-white/60">Higher export quality and batch tools can be connected to your plan system later.</p>
      </div>
    </aside>
  );
}

function SideLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: ComponentType<{ className?: string }>; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${
        active
          ? 'border-sky-400/35 bg-[linear-gradient(90deg,rgba(8,105,230,.70),rgba(10,52,101,.55))] text-white'
          : 'border-transparent text-white/78 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04]"><Icon className="h-4 w-4" /></span>
      {label}
    </Link>
  );
}

function StepRail({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-[22px] border border-white/10 bg-[#07111f]/82 px-3 py-3">
      <div className="mx-auto flex min-w-[700px] max-w-[980px] items-center">
        {steps.map((step, index) => {
          const done = currentStep > step.number;
          const active = currentStep === step.number;
          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex items-center gap-2.5">
                <span className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-bold ${active ? 'border-sky-300 bg-[#0a7dff] shadow-[0_0_0_4px_rgba(10,125,255,.16)]' : done ? 'border-emerald-400/40 bg-emerald-500/18 text-emerald-300' : 'border-white/15 bg-white/[0.06] text-white/70'}`}>
                  {done ? <Check className="h-4 w-4" /> : step.number}
                </span>
                <span className={`whitespace-nowrap text-sm font-medium ${active ? 'text-white' : 'text-white/60'}`}>{step.label}</span>
              </div>
              {index < steps.length - 1 ? <div className={`mx-4 h-px flex-1 ${currentStep > step.number ? 'bg-emerald-400/35' : 'bg-white/12'}`} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SetupPhase(props: {
  sourceFile: File | null;
  sourceUrl: string;
  pattern: PatternId | null;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  onChooseFile: () => void;
  onDropFile: (file?: File | null) => void;
  onChoosePattern: (pattern: PatternPreset) => void;
  onQuality: (quality: QualityId) => void;
  onAspect: (aspect: AspectRatioId) => void;
  onGenerate: () => void;
}) {
  return (
    <section className="grid gap-5 2xl:grid-cols-[0.92fr_1.08fr]">
      <Panel number="1" title="Upload Your Jersey Image" subtitle="Upload any common jersey image format and use it as the source design.">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            props.onDropFile(event.dataTransfer.files?.[0]);
          }}
          className="group relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-sky-400/40 bg-[radial-gradient(circle_at_center,rgba(19,105,204,.13),transparent_55%),#030912]"
        >
          {props.sourceUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img src={props.sourceUrl} alt="Uploaded jersey" className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_25px_60px_rgba(0,0,0,.45)]" />
            </div>
          ) : (
            <div className="px-8 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] border border-sky-400/25 bg-sky-500/10 text-sky-300">
                <CloudUpload className="h-9 w-9" />
              </div>
              <h3 className="mt-5 text-2xl font-bold">Drag & drop your jersey image</h3>
              <p className="mt-2 text-sm text-white/55">JPG, JPEG, PNG, WEBP, HEIC and other browser-supported image files · Max 25 MB</p>
            </div>
          )}
          <button onClick={props.onChooseFile} className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0b7dff] px-5 py-3 text-sm font-semibold shadow-[0_14px_32px_rgba(11,125,255,.30)]">
            <Upload className="h-4 w-4" /> {props.sourceFile ? 'Replace Image' : 'Browse Image'}
          </button>
        </div>
        {props.sourceFile ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm">
            <span className="truncate text-white/75">{props.sourceFile.name}</span>
            <span className="shrink-0 text-white/45">{formatBytes(props.sourceFile.size)}</span>
          </div>
        ) : null}
      </Panel>

      <Panel number="2" title="Choose Output Settings" subtitle="Pattern is required. Quality and aspect ratio control the generation request.">
        <SettingLabel title="Choose Pattern" required />
        <div className="grid gap-3 md:grid-cols-2">
          {patterns.map((preset) => {
            const selected = props.pattern === preset.id;
            return (
              <button key={preset.id} onClick={() => props.onChoosePattern(preset)} className={`overflow-hidden rounded-[22px] border text-left transition ${selected ? 'border-sky-400 bg-sky-500/8 shadow-[0_0_0_1px_rgba(56,189,248,.16)]' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                <div className={`relative h-40 overflow-hidden ${preset.background === 'transparent' ? 'bg-[linear-gradient(45deg,#111827_25%,transparent_25%,transparent_75%,#111827_75%),linear-gradient(45deg,#111827_25%,#0b1220_25%,#0b1220_75%,#111827_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]' : 'bg-black'}`}>
                  <img src={preset.preview} alt={preset.title} className="h-full w-full object-contain p-2" />
                  {selected ? <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#0b7dff]"><Check className="h-4 w-4" /></span> : null}
                </div>
                <div className="p-4">
                  <p className="font-bold">{preset.title}</p>
                  <p className="mt-1 text-sm text-white/55">{preset.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <SettingLabel title="Choose Quality" />
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {qualities.map((item) => (
            <button key={item.id} onClick={() => props.onQuality(item.id)} className={`rounded-2xl border px-3 py-3 text-left transition ${props.quality === item.id ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-white/[0.025] hover:border-white/20'}`}>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-white/45">{item.subtitle}</p>
            </button>
          ))}
        </div>

        <SettingLabel title="Choose Aspect Ratio" />
        <div className="grid grid-cols-4 gap-2">
          {aspects.map((item) => (
            <button key={item} onClick={() => props.onAspect(item)} className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${props.aspectRatio === item ? 'border-sky-400 bg-sky-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/60 hover:border-white/20'}`}>{item}</button>
          ))}
        </div>

        <div className="mt-7 rounded-[22px] border border-sky-400/15 bg-[linear-gradient(90deg,rgba(8,70,150,.16),rgba(13,39,78,.10))] p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
            <div>
              <p className="text-sm font-semibold">Master-command routing is ready</p>
              <p className="mt-1 text-sm leading-6 text-white/55">The selected pattern automatically chooses its production command. Your quality and aspect ratio are injected into the generation request.</p>
            </div>
          </div>
        </div>

        <button onClick={props.onGenerate} disabled={!props.sourceFile || !props.pattern} className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-6 py-4 text-base font-bold shadow-[0_16px_36px_rgba(8,117,255,.26)] transition disabled:cursor-not-allowed disabled:opacity-35">
          <WandSparkles className="h-5 w-5" /> Create Vector <ArrowRight className="h-5 w-5" />
        </button>
      </Panel>
    </section>
  );
}

function GeneratingPhase({ message, pattern, sourceUrl }: { message: string; pattern: PatternPreset | null; sourceUrl: string }) {
  return (
    <section className="mx-auto max-w-5xl rounded-[28px] border border-white/10 bg-[#07111f] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-black/40 p-5">
          {sourceUrl ? <img src={sourceUrl} alt="Source jersey" className="h-full max-h-[390px] w-full object-contain opacity-45" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(14,165,233,.14),transparent)] animate-pulse" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-24 w-24 place-items-center rounded-full border border-sky-400/25 bg-[#061321]/90 shadow-[0_0_60px_rgba(14,165,233,.20)]">
              <LoaderCircle className="h-10 w-10 animate-spin text-sky-300" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-400">Generation Stage</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Building your production layout</h2>
          <p className="mt-4 text-base leading-7 text-white/60">{message || 'Reading the source jersey, applying the selected master command, and preparing separated production components.'}</p>
          <div className="mt-6 space-y-3">
            {['Source image prepared', `${pattern?.title || 'Pattern'} command selected`, 'Quality + aspect ratio applied', 'Waiting for image-generation result'].map((text, index) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm text-white/75">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${index < 3 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-sky-500/15 text-sky-300'}`}>{index < 3 ? <Check className="h-4 w-4" /> : <LoaderCircle className="h-4 w-4 animate-spin" />}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultPhase(props: {
  outputUrl: string;
  previewOnly: boolean;
  statusMessage: string;
  pattern: PatternPreset | null;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  afterEdit: boolean;
  onBack: () => void;
  onDownload: () => void;
  onCustomize: () => void;
  onPreview: () => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Panel number="2" title="Generated Vector Output" subtitle="Review the production result before customization or export.">
        <ArtworkStage url={props.outputUrl} transparent={props.pattern?.background === 'transparent'} previewOnly={props.previewOnly} />
      </Panel>

      <div className="space-y-5">
        <div className="rounded-[26px] border border-white/10 bg-[#07111f] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">Generation Summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow label="Pattern" value={props.pattern?.title || '—'} />
            <SummaryRow label="Quality" value={qualityLabel(props.quality)} />
            <SummaryRow label="Aspect" value={props.aspectRatio} />
            <SummaryRow label="Parts" value="8 separated components" />
          </div>
          <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${props.previewOnly ? 'border-amber-400/25 bg-amber-500/8 text-amber-100/80' : 'border-emerald-400/25 bg-emerald-500/8 text-emerald-100/80'}`}>
            {props.previewOnly ? 'OpenAI generation is not connected yet. The source image is shown only as a workflow preview; it is not being presented as a generated vector result.' : props.statusMessage || 'Generation completed.'}
          </div>
        </div>

        {props.afterEdit ? (
          <>
            <button onClick={props.onPreview} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-4 font-bold">
              Go to Preview <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={props.onCustomize} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/12 bg-white/[0.04] px-5 py-4 font-semibold text-white/85">
              <Pencil className="h-5 w-5" /> Continue Editing
            </button>
          </>
        ) : (
          <>
            <button onClick={props.onCustomize} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-4 font-bold">
              <Pencil className="h-5 w-5" /> Customize <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={props.onDownload} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/12 bg-white/[0.04] px-5 py-4 font-semibold text-white/85">
              <Download className="h-5 w-5" /> Download
            </button>
          </>
        )}
        <button onClick={props.onBack} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/8 px-5 py-3 text-sm text-white/55">
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </button>
      </div>
    </section>
  );
}

function CustomizePhase(props: {
  outputUrl: string;
  values: CustomizeValues;
  prompt: string;
  logoFile: File | null;
  onValue: (key: keyof CustomizeValues, value: string) => void;
  onPrompt: (value: string) => void;
  onLogo: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  onNext: () => void;
}) {
  return (
    <section className="grid gap-5 2xl:grid-cols-[0.95fr_1.05fr]">
      <Panel number="3" title="Customize Jersey" subtitle="Use quick controls or describe a complete edit in the AI command box.">
        <ArtworkStage url={props.outputUrl} transparent={false} previewOnly={!props.outputUrl} compact />
        <div className="mt-4 rounded-[22px] border border-sky-400/16 bg-sky-500/6 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-300"><Bot className="h-4 w-4" /> AI Command Box</div>
          <textarea value={props.prompt} onChange={(event) => props.onPrompt(event.target.value)} rows={7} placeholder="Describe all changes in one command. Example: keep every original graphic, replace the chest logo with my uploaded logo, change the player name, keep sleeve artwork unchanged, make the collar dark navy, and preserve the exact 8-piece layout." className="w-full resize-none rounded-2xl border border-white/10 bg-[#020812] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/28 focus:border-sky-400/50" />
        </div>
      </Panel>

      <Panel number="3A" title="Quick Edit Controls" subtitle="Only filled controls are added to the regeneration instruction.">
        <div className="grid gap-3 sm:grid-cols-2">
          {quickRows.map((row) => (
            <Field key={row.key} label={row.label} icon={row.icon} value={props.values[row.key]} placeholder={row.placeholder} onChange={(value) => props.onValue(row.key, value)} />
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ColorField label="Primary Color" value={props.values.primaryColor} onChange={(value) => props.onValue('primaryColor', value)} />
          <ColorField label="Secondary Color" value={props.values.secondaryColor} onChange={(value) => props.onValue('secondaryColor', value)} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {styleRows.map((row) => (
            <Field key={row.key} label={row.label} icon={row.icon} value={props.values[row.key]} placeholder={row.placeholder} onChange={(value) => props.onValue(row.key, value)} />
          ))}
        </div>

        <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Replace / Add Logo or Reference</p>
              <p className="mt-1 text-xs text-white/45">The reference file is sent with the generated layout during AI regeneration.</p>
            </div>
            <button onClick={props.onLogo} className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold">
              <Upload className="h-4 w-4" /> {props.logoFile ? 'Replace File' : 'Upload File'}
            </button>
          </div>
          {props.logoFile ? <p className="mt-3 truncate rounded-xl bg-black/25 px-3 py-2 text-xs text-white/60">{props.logoFile.name}</p> : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={props.onReset} className="inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white/70"><RotateCcw className="h-4 w-4" /> Reset Changes</button>
          <button onClick={props.onRegenerate} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-3.5 font-bold"><Sparkles className="h-5 w-5" /> Edit and Create Vector</button>
          <button onClick={props.onNext} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] border border-sky-400/25 bg-sky-500/8 px-5 py-3.5 font-bold text-sky-100">Go to Next Phase <ArrowRight className="h-5 w-5" /></button>
        </div>
      </Panel>
    </section>
  );
}

function PreviewPhase(props: { outputUrl: string; mode: '2d' | '3d'; onMode: (mode: '2d' | '3d') => void; onEdit: () => void; onNext: () => void }) {
  return (
    <section className="mx-auto max-w-6xl">
      <Panel number="4" title="Preview Design" subtitle="Inspect the final artwork in flat 2D or a perspective review mode before export.">
        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => props.onMode('2d')} className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${props.mode === '2d' ? 'border-sky-400 bg-sky-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/55'}`}>2D Preview</button>
          <button onClick={() => props.onMode('3d')} className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${props.mode === '3d' ? 'border-sky-400 bg-sky-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/55'}`}>3D Review</button>
        </div>
        <div className="min-h-[560px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(18,106,210,.15),transparent_48%),#02060d] p-6 [perspective:1300px]">
          <div className={`flex h-full min-h-[510px] items-center justify-center transition duration-500 ${props.mode === '3d' ? '[transform:rotateY(-13deg)_rotateX(5deg)_scale(.90)] drop-shadow-[30px_35px_35px_rgba(0,0,0,.48)]' : ''}`}>
            {props.outputUrl ? <img src={props.outputUrl} alt="Final production preview" className="max-h-[500px] max-w-full rounded-xl object-contain" /> : <EmptyPreview />}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button onClick={props.onEdit} className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-white/12 bg-white/[0.03] px-5 py-4 font-semibold"><RefreshCcw className="h-5 w-5" /> Edit Again</button>
          <button onClick={props.onNext} className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-4 font-bold">Go to Next Phase <ArrowRight className="h-5 w-5" /></button>
        </div>
      </Panel>
    </section>
  );
}

function DownloadPhase(props: {
  outputUrl: string;
  format: ExportFormat;
  quality: ExportQuality;
  exporting: boolean;
  previewOnly: boolean;
  onFormat: (format: ExportFormat) => void;
  onQuality: (quality: ExportQuality) => void;
  onBack: () => void;
  onDownload: () => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <Panel number="5" title="Download Output" subtitle="Choose the export format and output quality before downloading.">
        <ArtworkStage url={props.outputUrl} transparent={false} previewOnly={props.previewOnly} compact />
        {props.previewOnly ? <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 text-sm leading-6 text-amber-100/75">The OpenAI generation engine is not connected, so this download would export the current source preview rather than a generated production layout.</div> : null}
      </Panel>

      <div className="rounded-[28px] border border-white/10 bg-[#07111f] p-5 sm:p-6">
        <SettingLabel title="File Format" required />
        <div className="grid grid-cols-2 gap-2">
          {exportFormats.map((item) => (
            <button key={item.id} onClick={() => props.onFormat(item.id)} className={`rounded-2xl border p-3 text-left ${props.format === item.id ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-white/[0.025]'}`}>
              <p className="text-sm font-bold uppercase">{item.title}</p>
              <p className="mt-1 text-xs text-white/45">{item.subtitle}</p>
            </button>
          ))}
        </div>

        <SettingLabel title="Download Quality" required />
        <div className="grid grid-cols-2 gap-2">
          {exportQualities.map((item) => (
            <button key={item.id} onClick={() => props.onQuality(item.id)} className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${props.quality === item.id ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-white/[0.025] text-white/60'}`}>{item.title}</button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-white/55">
          SVG export uses the project&apos;s ImageTracer dependency to trace the final image into paths. PDF and AI-compatible export are built from that traced vector artwork.
        </div>

        <button onClick={props.onDownload} disabled={props.exporting || !props.outputUrl} className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-4 text-lg font-bold disabled:opacity-40">
          {props.exporting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          {props.exporting ? 'Preparing Export…' : 'Download'}
        </button>
        <button onClick={props.onBack} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 px-5 py-3 text-sm text-white/60"><ArrowLeft className="h-4 w-4" /> Back to Preview</button>
      </div>
    </section>
  );
}

function Panel({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,.98),rgba(3,10,20,.98))] p-4 shadow-[0_22px_70px_rgba(0,0,0,.25)] sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 min-w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#1597ff,#005de9)] text-lg font-black shadow-[0_10px_28px_rgba(9,117,255,.28)]">{number}</span>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-white/52">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ArtworkStage({ url, transparent, previewOnly, compact }: { url: string; transparent: boolean; previewOnly: boolean; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] border border-white/10 ${compact ? 'min-h-[390px]' : 'min-h-[570px]'} ${transparent ? 'bg-[linear-gradient(45deg,#111827_25%,transparent_25%,transparent_75%,#111827_75%),linear-gradient(45deg,#111827_25%,#0b1220_25%,#0b1220_75%,#111827_75%)] bg-[length:28px_28px] bg-[position:0_0,14px_14px]' : 'bg-black'}`}>
      <div className={`flex ${compact ? 'min-h-[390px]' : 'min-h-[570px]'} items-center justify-center p-5 sm:p-8`}>
        {url ? <img src={url} alt="Production output" className={`${compact ? 'max-h-[350px]' : 'max-h-[530px]'} max-w-full object-contain`} /> : <EmptyPreview />}
      </div>
      {previewOnly ? <span className="absolute left-4 top-4 rounded-full border border-amber-400/25 bg-[#241801]/90 px-3 py-1.5 text-xs font-semibold text-amber-200">API Preview Mode</span> : <span className="absolute left-4 top-4 rounded-full border border-emerald-400/25 bg-[#052015]/90 px-3 py-1.5 text-xs font-semibold text-emerald-200">Generated Output</span>}
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="text-center text-white/35">
      <ImageIcon className="mx-auto h-12 w-12" />
      <p className="mt-3 text-sm">No image available</p>
    </div>
  );
}

function SettingLabel({ title, required }: { title: string; required?: boolean }) {
  return <p className="mb-2 mt-5 text-sm font-bold text-white/85">{title}{required ? <span className="ml-1 text-sky-400">*</span> : null}</p>;
}

function Field({ label, icon: Icon, value, placeholder, onChange }: { label: string; icon: typeof Type; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/65"><Icon className="h-3.5 w-3.5 text-sky-300" /> {label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent" />
      <div className="min-w-0">
        <span className="flex items-center gap-2 text-xs font-semibold text-white/65"><Palette className="h-3.5 w-3.5 text-sky-300" /> {label}</span>
        <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full bg-transparent text-sm uppercase text-white outline-none" />
      </div>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3"><span className="text-white/45">{label}</span><span className="text-right font-semibold text-white/80">{value}</span></div>;
}

function buildCustomizationPrompt(values: CustomizeValues, prompt: string) {
  const lines: string[] = [];
  if (values.playerName.trim()) lines.push(`Player name: ${values.playerName.trim()}`);
  if (values.jerseyNumber.trim()) lines.push(`Jersey number: ${values.jerseyNumber.trim()}`);
  if (values.teamName.trim()) lines.push(`Team name: ${values.teamName.trim()}`);
  if (values.sponsorText.trim()) lines.push(`Sponsor text: ${values.sponsorText.trim()}`);
  if (values.primaryColor) lines.push(`Preferred primary color: ${values.primaryColor}`);
  if (values.secondaryColor) lines.push(`Preferred secondary color: ${values.secondaryColor}`);
  if (values.patternStyle.trim()) lines.push(`Pattern instruction: ${values.patternStyle.trim()}`);
  if (values.fontStyle.trim()) lines.push(`Font instruction: ${values.fontStyle.trim()}`);
  if (values.collarStyle.trim()) lines.push(`Collar instruction: ${values.collarStyle.trim()}`);
  if (values.sleeveStyle.trim()) lines.push(`Sleeve instruction: ${values.sleeveStyle.trim()}`);
  if (values.addText.trim()) lines.push(`Additional text: ${values.addText.trim()}`);
  if (values.removeElement.trim()) lines.push(`Remove: ${values.removeElement.trim()}`);
  if (prompt.trim()) lines.push(`Full AI instruction: ${prompt.trim()}`);
  return lines.join('\n');
}

function qualityLabel(quality: QualityId) {
  return qualities.find((item) => item.id === quality)?.title || quality;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function dataUrlToFile(dataUrl: string, name: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/png' });
}

function qualityScale(quality: ExportQuality) {
  return quality === '4k' ? 3840 : quality === 'high' ? 2560 : quality === 'medium' ? 1600 : 1024;
}

async function loadImage(url: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read the generated image for export.'));
    image.src = url;
  });
}

async function rasterCanvas(dataUrl: string, quality: ExportQuality, transparent: boolean) {
  const image = await loadImage(dataUrl);
  const maxEdge = qualityScale(quality);
  const ratio = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * ratio));
  const height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas export is unavailable in this browser.');
  if (!transparent) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

async function traceSvg(dataUrl: string, quality: ExportQuality, transparent: boolean) {
  const canvas = await rasterCanvas(dataUrl, quality, transparent);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Vector tracing is unavailable in this browser.');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { default: ImageTracer } = await import('imagetracerjs');
  const colors = quality === '4k' ? 64 : quality === 'high' ? 48 : quality === 'medium' ? 32 : 20;
  return ImageTracer.imagedataToSVG(imageData, {
    ltres: 1,
    qtres: 1,
    pathomit: quality === 'low' ? 16 : 6,
    colorsampling: 2,
    numberofcolors: colors,
    mincolorratio: 0.01,
    scale: 1,
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

async function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create export file.')), type, quality));
}

async function vectorPdfBlob(svg: string) {
  const [{ jsPDF }, svgModule] = await Promise.all([import('jspdf'), import('svg2pdf.js')]);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.documentElement as unknown as SVGElement;
  const viewBox = svgElement.getAttribute('viewBox')?.split(/\s+/).map(Number) || [0, 0, 1200, 900];
  const width = Math.max(1, viewBox[2] || 1200);
  const height = Math.max(1, viewBox[3] || 900);
  const orientation = width >= height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'pt', format: [width, height], compress: true });
  await svgModule.svg2pdf(svgElement, pdf, { x: 0, y: 0, width, height });
  return pdf.output('blob');
}

async function exportArtwork(dataUrl: string, format: ExportFormat, quality: ExportQuality, transparent: boolean) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  if (format === 'png' || format === 'jpeg') {
    const canvas = await rasterCanvas(dataUrl, quality, transparent && format === 'png');
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const blob = await canvasBlob(canvas, mime, format === 'jpeg' ? 0.94 : undefined);
    downloadBlob(blob, `my-jersey-production-${stamp}.${format === 'jpeg' ? 'jpg' : 'png'}`);
    return;
  }

  const svg = await traceSvg(dataUrl, quality, transparent);
  if (format === 'svg') {
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `my-jersey-production-${stamp}.svg`);
    return;
  }

  const pdfBlob = await vectorPdfBlob(svg);
  if (format === 'pdf') {
    downloadBlob(pdfBlob, `my-jersey-production-${stamp}.pdf`);
    return;
  }

  downloadBlob(new Blob([await pdfBlob.arrayBuffer()], { type: 'application/pdf' }), `my-jersey-production-${stamp}.ai`);
}

'use client';

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
  Search,
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
import { runImageWorkflow } from '@/lib/ai/imagegpt-browser';
import { VectorCustomizeEditor } from '@/components/image-vector/vector-customize-editor';
import {
  editableSvgToAiBlob,
  editableSvgToEpsBlob,
  editableSvgToPdfBlob,
  editableSvgToRasterBlob,
} from '@/lib/vector-editable-export';
import type {
  AspectRatioId,
  ExportQuality,
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
  const [editorSvg, setEditorSvg] = useState('');
  const [vectorState, setVectorState] = useState<'idle' | 'building' | 'ready'>('idle');
  const [vectorProgress, setVectorProgress] = useState(0);
  const [vectorStatus, setVectorStatus] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'svg' | 'png' | 'jpeg' | 'pdf' | 'ai' | 'eps'>('svg');
  const [editableSvg, setEditableSvg] = useState('');
  const [editableAiBlob, setEditableAiBlob] = useState<Blob | null>(null);
  const [editablePdfBlob, setEditablePdfBlob] = useState<Blob | null>(null);
  const [editableEpsBlob, setEditableEpsBlob] = useState<Blob | null>(null);
  const [editablePngBlob, setEditablePngBlob] = useState<Blob | null>(null);
  const [editableJpegBlob, setEditableJpegBlob] = useState<Blob | null>(null);
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
    setEditorSvg('');
    setVectorState('idle');
    setVectorProgress(0);
    setVectorStatus('');
    setEditableSvg('');
    setEditableAiBlob(null);
    setEditablePdfBlob(null);
    setEditableEpsBlob(null);
    setEditablePngBlob(null);
    setEditableJpegBlob(null);
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
    setPhase('generating');

    const customizationPrompt =
      mode === 'edit'
        ? buildCustomizationPrompt(customize, customPrompt)
        : '';

    const activeFile =
      mode === 'edit' && generatedUrl
        ? await dataUrlToFile(
            generatedUrl,
            'generated-layout.png',
          )
        : sourceFile;

    try {
      if (mode === 'edit') {
        setStatusMessage(
          'Gemini 3 Pro Image is applying your customization…',
        );

        const result =
          await runImageWorkflow({
            image: activeFile,
            workflow: 'customize',
            pattern,
            quality,
            aspectRatio,
            customizationPrompt,
          });

        setGeneratedUrl(
          result.dataUrl,
        );

        setProviderConfigured(
          true,
        );

        setProviderModel(
          result.model,
        );

        setStatusMessage(
          result.usedFallback
            ? `Customization ready · Cloudflare fallback · ${result.model}`
            : 'Customization ready · Gemini 3 Pro Image',
        );

        setPhase('result');
        return;
      }

      setStatusMessage(
        'Step 1/2 · Gemini 3.1 Flash Image is analyzing the jersey…',
      );

      const analysis =
        await runImageWorkflow({
          image: activeFile,
          workflow:
            'image-to-vector-analysis',
          pattern,
          quality,
          aspectRatio,
        });

      const normalizedFile =
        new File(
          [analysis.blob],
          'jersey-analysis.png',
          {
            type:
              analysis.blob.type ||
              'image/png',
          },
        );

      setStatusMessage(
        'Step 2/2 · Gemini 3.1 Flash Image is creating the production layout…',
      );

      const finalResult =
        await runImageWorkflow({
          image: normalizedFile,
          workflow:
            'image-to-vector-final',
          pattern,
          quality,
          aspectRatio,
        });

      setGeneratedUrl(
        finalResult.dataUrl,
      );

      setProviderConfigured(
        true,
      );

      setProviderModel(
        finalResult.model,
      );

      setStatusMessage(
        finalResult.usedFallback
          ? `Production layout ready · Cloudflare fallback · ${finalResult.model}`
          : 'Production layout ready · Gemini 3.1 Flash Image',
      );

      setPhase('result');
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Generation failed.',
      );

      setPhase(
        mode === 'edit'
          ? 'customize'
          : 'setup',
      );
    }
  }

async function buildEditableVectorFiles() {
    if (!visibleOutput) {
      setError('Generate and preview an output before creating download files.');
      return;
    }

    setPhase('download');
    setVectorState('building');
    setVectorProgress(6);
    setVectorStatus('Preparing the final edited artwork…');
    setEditableSvg('');
    setEditableAiBlob(null);
    setEditablePdfBlob(null);
    setEditableEpsBlob(null);
    setEditablePngBlob(null);
    setEditableJpegBlob(null);
    setError('');

    try {
      await nextPaint();

      let finalSvg = editorSvg.trim();

      if (!finalSvg) {
        setVectorProgress(20);
        setVectorStatus('Tracing artwork into editable vector paths…');

        const tracedSvg = await traceSvg(
          visibleOutput,
          '4k',
          selectedPattern?.background === 'transparent',
        );

        await nextPaint();
        setVectorProgress(38);
        setVectorStatus('Separating paths into the 8 editable jersey component groups…');
        finalSvg = await groupEditableSvg(tracedSvg);
      } else {
        setVectorProgress(38);
        setVectorStatus('Using the customized editable vector canvas…');
      }

      finalSvg = addEditableMetadata(finalSvg);

      await nextPaint();
      setVectorProgress(54);
      setVectorStatus('Building editable SVG and vector PDF…');

      const [pdfBlob, aiBlob] = await Promise.all([
        editableSvgToPdfBlob(finalSvg),
        editableSvgToAiBlob(finalSvg),
      ]);

      await nextPaint();
      setVectorProgress(72);
      setVectorStatus('Building editable EPS artwork…');
      const epsBlob = editableSvgToEpsBlob(finalSvg);

      await nextPaint();
      setVectorProgress(86);
      setVectorStatus('Rendering PNG and JPEG previews from the edited vector…');

      const [pngBlob, jpegBlob] = await Promise.all([
        editableSvgToRasterBlob(finalSvg, 'png', 3200),
        editableSvgToRasterBlob(finalSvg, 'jpeg', 3200),
      ]);

      setEditableSvg(finalSvg);
      setEditablePdfBlob(pdfBlob);
      setEditableAiBlob(aiBlob);
      setEditableEpsBlob(epsBlob);
      setEditablePngBlob(pngBlob);
      setEditableJpegBlob(jpegBlob);
      setVectorProgress(100);
      setVectorStatus('All download formats are ready.');
      setVectorState('ready');
    } catch (vectorError) {
      setVectorState('idle');
      setVectorProgress(0);
      setVectorStatus('');
      setError(
        vectorError instanceof Error
          ? vectorError.message
          : 'Could not create download files.',
      );
    }
  }

  function downloadPreparedFile() {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');

    if (downloadFormat === 'svg' && editableSvg) {
      downloadBlob(
        new Blob([editableSvg], { type: 'image/svg+xml;charset=utf-8' }),
        'my-jersey-editable-' + stamp + '.svg',
      );
      return;
    }

    if (downloadFormat === 'png' && editablePngBlob) {
      downloadBlob(editablePngBlob, 'my-jersey-' + stamp + '.png');
      return;
    }

    if (downloadFormat === 'jpeg' && editableJpegBlob) {
      downloadBlob(editableJpegBlob, 'my-jersey-' + stamp + '.jpg');
      return;
    }

    if (downloadFormat === 'pdf' && editablePdfBlob) {
      downloadBlob(editablePdfBlob, 'my-jersey-editable-' + stamp + '.pdf');
      return;
    }

    if (downloadFormat === 'ai' && editableAiBlob) {
      downloadBlob(editableAiBlob, 'my-jersey-editable-' + stamp + '.ai');
      return;
    }

    if (downloadFormat === 'eps' && editableEpsBlob) {
      downloadBlob(editableEpsBlob, 'my-jersey-editable-' + stamp + '.eps');
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
                <p className="text-sm font-medium text-sky-400">JerseyOS</p>
                <h1 className="truncate text-lg font-bold sm:text-xl">VectorForge</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65 md:block">
                {providerConfigured === null
                  ? 'Checking AI engineâ€¦'
                  : providerConfigured
                    ? `ImageGPT.cloud + Cloudflare fallback${providerModel ? ` Â· ${providerModel}` : ''}`
                    : 'ImageGPT.cloud configuration required'}
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
                onCustomize={() => setPhase('customize')}
                onPreview={() => setPhase('preview')}
              />
            ) : null}

            {phase === 'customize' && pattern ? (
              <VectorCustomizeEditor
                sourceUrl={visibleOutput}
                initialSvg={editorSvg}
                pattern={pattern}
                quality={quality}
                aspectRatio={aspectRatio}
                onComplete={({ svg, previewDataUrl }) => {
                  setEditorSvg(svg);
                  setGeneratedUrl(previewDataUrl);
                  setVectorState('idle');
                  setVectorProgress(0);
                  setVectorStatus('');
                  setEditableSvg('');
                  setEditableAiBlob(null);
                  setEditablePdfBlob(null);
                  setEditableEpsBlob(null);
                  setEditablePngBlob(null);
                  setEditableJpegBlob(null);
                  setPhase('preview');
                }}
              />
            ) : null}

            {phase === 'preview' ? (
              <PreviewPhase
                outputUrl={visibleOutput}
                mode={previewMode}
                onMode={setPreviewMode}
                onNext={() => void buildEditableVectorFiles()}
              />
            ) : null}

            {phase === 'download' ? (
              <DownloadPhase
                outputUrl={visibleOutput}
                state={vectorState}
                progress={vectorProgress}
                status={vectorStatus}
                previewOnly={isPreviewOnly}
                format={downloadFormat}
                onFormat={setDownloadFormat}
                onBack={() => setPhase('preview')}
                onDownload={downloadPreparedFile}
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
  const groups = [
    {
      title: 'AI Powered Tools',
      items: [
        { href: '/image-to-vector', label: 'VectorForge', icon: ImageIcon, active: true },
        { href: '/oneclick-creation', label: 'AutoPilot', icon: WandSparkles },
        { href: '/edit-existing-file', label: 'VectorLab', icon: SquarePen },
        { href: '/mockup-generator', label: 'Showcase AI', icon: PackageOpen },
        { href: '/frontscan', label: 'FrontScan', icon: Search },
        { href: '/batchforge', label: 'BatchForge', icon: Layers3 },
        { href: '/ordersheet', label: 'OrderSheet', icon: FileCog },
      ],
    },
    {
      title: 'Elements Tools',
      items: [
        { href: '/design-elements', label: 'AssetForge', icon: Layers3 },
        { href: '/templates', label: 'DesignVault', icon: FileImage },
        { href: '/file-converter', label: 'ConvertX', icon: FileCog },
        { href: '/exportpack', label: 'ExportPack', icon: PackageOpen },
      ],
    },
    {
      title: 'Emergency Tools',
      items: [
        { href: '/backup', label: 'RescueX', icon: ShieldCheck },
        { href: '/manual-vector-tracing', label: 'TraceDesk', icon: SquarePen },
        { href: '/colour-editor', label: 'ColorDesk', icon: Layers3 },
        { href: '/manual-production-cut-setup', label: 'CutPrep', icon: FileImage },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[245px] shrink-0 overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,#06101d,#020711)] p-4 xl:block">
      <div className="px-2 pb-5 pt-2">
        <div className="flex items-center gap-3">
          <img
            src="/brand/jerseyos-logo.png"
            alt="JerseyOS"
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="text-[1.15rem] font-black leading-none tracking-wide">JerseyOS</p>
            <p className="mt-1 max-w-[145px] text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] text-amber-200/70">
              AI-Powered Jersey Production OS
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        <SideLink href="/" label="Dashboard" icon={Home} />
        <SideLink href="/new-project" label="New Project" icon={Plus} />
      </nav>

      <div className="my-5 h-px bg-white/10" />

      <div className="space-y-5 pb-6">
        {groups.map((group) => (
          <section key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-sky-400">
              {group.title}
            </p>
            <nav className="space-y-1.5">
              {group.items.map((item) => (
                <SideLink key={item.label} {...item} />
              ))}
            </nav>
          </section>
        ))}

        <div className="h-px bg-white/10" />

        <nav className="space-y-1.5">
          <SideLink href="/settings" label="Settings" icon={Settings} />
          <SideLink href="/help-support" label="Help & Support" icon={CircleHelp} />
        </nav>
      </div>
    </aside>
  );
}

function SideLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: ComponentType<{ className?: string }>; active?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${
        active
          ? 'border-sky-400/35 bg-[linear-gradient(90deg,rgba(8,105,230,.70),rgba(10,52,101,.55))] text-white'
          : 'border-transparent text-white/78 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04]"><Icon className="h-4 w-4" /></span>
      {label}
    </a>
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
              <p className="mt-2 text-sm text-white/55">JPG, JPEG, PNG, WEBP, HEIC and other browser-supported image files Â· Max 25 MB</p>
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
            <SummaryRow label="Pattern" value={props.pattern?.title || 'â€”'} />
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
            <button onClick={props.onPreview} className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/12 bg-white/[0.04] px-5 py-4 font-semibold text-white/85">
              <ImageIcon className="h-5 w-5" /> Preview <ArrowRight className="h-5 w-5" />
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

function PreviewPhase(props: {
  outputUrl: string;
  mode: '2d' | '3d';
  onMode: (mode: '2d' | '3d') => void;
  onNext: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl">
      <Panel number="4" title="Preview Design" subtitle="Inspect the final production artwork before generating the editable vector package.">
        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => props.onMode('2d')} className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${props.mode === '2d' ? 'border-sky-400 bg-sky-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/55'}`}>2D Preview</button>
          <button onClick={() => props.onMode('3d')} className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${props.mode === '3d' ? 'border-sky-400 bg-sky-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/55'}`}>3D Review</button>
        </div>

        <div className="min-h-[560px] overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(18,106,210,.15),transparent_48%),#02060d] p-6 [perspective:1300px]">
          <div className={`flex h-full min-h-[510px] items-center justify-center transition duration-500 ${props.mode === '3d' ? '[transform:rotateY(-13deg)_rotateX(5deg)_scale(.90)] drop-shadow-[30px_35px_35px_rgba(0,0,0,.48)]' : ''}`}>
            {props.outputUrl ? <img src={props.outputUrl} alt="Final production preview" className="max-h-[500px] max-w-full rounded-xl object-contain" /> : <EmptyPreview />}
          </div>
        </div>

        <button
          onClick={props.onNext}
          disabled={!props.outputUrl}
          className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-6 py-4 text-lg font-black shadow-[0_16px_36px_rgba(8,117,255,.26)] transition disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Download className="h-5 w-5" />
          Continue to Download
          <ArrowRight className="h-5 w-5" />
        </button>
      </Panel>
    </section>
  );
}

function DownloadPhase(props: {
  outputUrl: string;
  state: 'idle' | 'building' | 'ready';
  progress: number;
  status: string;
  previewOnly: boolean;
  format: 'svg' | 'png' | 'jpeg' | 'pdf' | 'ai' | 'eps';
  onFormat: (format: 'svg' | 'png' | 'jpeg' | 'pdf' | 'ai' | 'eps') => void;
  onBack: () => void;
  onDownload: () => void;
}) {
  const stages = [
    { label: 'Prepare final edited artwork', threshold: 6 },
    { label: 'Preserve / trace editable vector objects', threshold: 20 },
    { label: 'Prepare editable SVG structure', threshold: 38 },
    { label: 'Build editable vector PDF + AI', threshold: 54 },
    { label: 'Build editable EPS artwork', threshold: 72 },
    { label: 'Render PNG + JPEG', threshold: 86 },
    { label: 'All formats ready', threshold: 100 },
  ];

  const formats = [
    { key: 'svg', title: 'SVG', note: 'Editable vector', editable: true },
    { key: 'png', title: 'PNG', note: 'Raster image', editable: false },
    { key: 'jpeg', title: 'JPEG', note: 'Raster image', editable: false },
    { key: 'pdf', title: 'PDF', note: 'Editable vector PDF', editable: true },
    { key: 'ai', title: 'AI', note: 'Illustrator-compatible vector', editable: true },
    { key: 'eps', title: 'EPS', note: 'Editable PostScript vector', editable: true },
  ] as const;

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_440px]">
      <Panel
        number="5"
        title="Download Final Artwork"
        subtitle="Choose PNG/JPEG for raster delivery or SVG/PDF/AI/EPS for editable vector delivery."
      >
        <ArtworkStage
          url={props.outputUrl}
          transparent={false}
          previewOnly={props.previewOnly}
          compact
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <VectorFeature
            title="Illustrator-style Editing Preserved"
            text="Manual vector edits, colors, positions, OCR text layers and object transforms are carried into export."
          />
          <VectorFeature
            title="Editable Vector Formats"
            text="SVG, PDF, AI and EPS are created from vector objects rather than a raster-image wrapper."
          />
          <VectorFeature
            title="Raster Delivery"
            text="PNG and JPEG are rendered from the final edited vector canvas."
          />
        </div>
      </Panel>

      <div className="h-fit rounded-[28px] border border-white/10 bg-[#07111f] p-5 sm:p-6">
        {props.state === 'building' ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">Export Engine</p>
            <h2 className="mt-2 text-2xl font-black">Preparing download formats…</h2>
            <p className="mt-3 min-h-12 text-sm leading-6 text-white/55">{props.status}</p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#0875ff,#22c8ff)] transition-all duration-500"
                style={{ width: String(props.progress) + '%' }}
              />
            </div>
            <div className="mt-2 text-right text-sm font-bold text-cyan-300">{props.progress}%</div>

            <div className="mt-5 space-y-2">
              {stages.map((stage) => {
                const done = props.progress >= stage.threshold;
                const active = !done && props.progress < stage.threshold;
                return (
                  <div
                    key={stage.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm"
                  >
                    <span
                      className={
                        'grid h-7 w-7 place-items-center rounded-full ' +
                        (done
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-sky-500/10 text-sky-300')
                      }
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : active ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current opacity-50" />
                      )}
                    </span>
                    <span className={done ? 'text-white/80' : 'text-white/50'}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : props.state === 'ready' ? (
          <>
            <div className="flex items-center gap-3 rounded-[22px] border border-emerald-400/25 bg-emerald-500/8 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Check className="h-6 w-6" />
              </span>
              <div>
                <p className="font-black text-emerald-100">All Formats Ready</p>
                <p className="mt-1 text-xs text-emerald-100/60">
                  Choose a format below and download the prepared file.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {formats.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => props.onFormat(item.key)}
                  className={
                    'rounded-2xl border p-3 text-left transition ' +
                    (props.format === item.key
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-white/10 bg-white/[0.025] hover:border-white/20')
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black">{item.title}</p>
                    {item.editable ? (
                      <span className="rounded-full bg-violet-500/12 px-2 py-1 text-[10px] font-bold text-violet-200">
                        EDITABLE
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-white/45">{item.note}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={props.onDownload}
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-4 text-base font-black"
            >
              {props.format === 'ai' ? (
                <FileCog className="h-5 w-5" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Download {props.format.toUpperCase()}
            </button>

            <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4 text-xs leading-6 text-white/48">
              OCR-created typography stays as live SVG text in SVG export. Other traced typography stays editable as vector outlines. PDF, AI and EPS preserve vector objects for compatible design software; PNG and JPEG are raster exports.
            </div>
          </>
        ) : (
          <div className="text-sm text-white/55">Export preparation has not started.</div>
        )}

        <button
          onClick={props.onBack}
          disabled={props.state === 'building'}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 px-5 py-3 text-sm text-white/60 disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Preview
        </button>
      </div>
    </section>
  );
}

function VectorFeature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-sky-400/12 bg-sky-500/[0.04] p-4">
      <p className="text-sm font-bold text-sky-100">{title}</p>
      <p className="mt-1 text-xs leading-5 text-white/45">{text}</p>
    </div>
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

function nextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function groupEditableSvg(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;

  if (root.nodeName.toLowerCase() !== 'svg') {
    throw new Error('The vector engine returned an invalid SVG document.');
  }

  root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  root.setAttribute('data-my-jersey-editable', 'true');

  const viewBox = (root.getAttribute('viewBox') || `0 0 ${root.getAttribute('width') || 1200} ${root.getAttribute('height') || 900}`)
    .trim()
    .split(/[\s,]+/)
    .map(Number);

  const width = Math.max(1, viewBox[2] || 1200);
  const height = Math.max(1, viewBox[3] || 900);

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-100000px';
  host.style.top = '0';
  host.style.width = `${width}px`;
  host.style.height = `${height}px`;
  host.style.pointerEvents = 'none';
  host.innerHTML = new XMLSerializer().serializeToString(root);
  document.body.appendChild(host);

  try {
    const liveSvg = host.querySelector('svg');
    if (!liveSvg) throw new Error('Could not prepare editable SVG layers.');

    const ns = 'http://www.w3.org/2000/svg';
    const layerNames = [
      'left-sleeve',
      'front-body',
      'back-body',
      'right-sleeve',
      'front-collar',
      'back-collar',
      'top-trim',
      'bottom-trim',
      'background',
      'unassigned-artwork',
    ];

    const groups = new Map<string, SVGGElement>();

    for (const name of layerNames) {
      const group = document.createElementNS(ns, 'g');
      group.setAttribute('id', name);
      group.setAttribute('data-layer', name);
      group.setAttribute('aria-label', name.replaceAll('-', ' '));
      groups.set(name, group);
      liveSvg.appendChild(group);
    }

    const shapes = Array.from(
      liveSvg.querySelectorAll('path, polygon, polyline, rect, circle, ellipse'),
    ).filter((node) => !(node.parentElement?.hasAttribute('data-layer')));

    for (const node of shapes) {
      let bbox: DOMRect | SVGRect;
      try {
        bbox = (node as SVGGraphicsElement).getBBox();
      } catch {
        groups.get('unassigned-artwork')?.appendChild(node);
        continue;
      }

      const cx = (bbox.x + bbox.width / 2) / width;
      const cy = (bbox.y + bbox.height / 2) / height;

      let layer = 'unassigned-artwork';

      if (bbox.width / width > 0.82 && bbox.height / height > 0.82) {
        layer = 'background';
      } else if (cy < 0.20 && cx >= 0.32 && cx <= 0.68) {
        layer = 'top-trim';
      } else if (cy > 0.78 && cx >= 0.32 && cx <= 0.68) {
        layer = 'bottom-trim';
      } else if (cy > 0.60 && cx >= 0.20 && cx < 0.50) {
        layer = 'front-collar';
      } else if (cy > 0.60 && cx >= 0.50 && cx <= 0.80) {
        layer = 'back-collar';
      } else if (cx < 0.25) {
        layer = 'left-sleeve';
      } else if (cx > 0.75) {
        layer = 'right-sleeve';
      } else if (cx < 0.50) {
        layer = 'front-body';
      } else {
        layer = 'back-body';
      }

      groups.get(layer)?.appendChild(node);
    }

    return new XMLSerializer().serializeToString(liveSvg);
  } finally {
    host.remove();
  }
}

function addEditableMetadata(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  const ns = 'http://www.w3.org/2000/svg';

  const title = document.createElementNS(ns, 'title');
  title.textContent = 'JerseyOS — Editable Production Vector';
  root.insertBefore(title, root.firstChild);

  const desc = document.createElementNS(ns, 'desc');
  desc.textContent =
    'Eight named jersey component groups. Artwork and typography are vector paths editable in Illustrator, Inkscape and compatible vector editors.';
  root.insertBefore(desc, title.nextSibling);

  root.setAttribute('data-vector-structure', '8-component-editable-layout');
  root.setAttribute('data-typography-mode', 'vector-outlines');

  return new XMLSerializer().serializeToString(root);
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

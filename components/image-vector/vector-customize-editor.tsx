'use client';

import {
  Bot,
  Check,
  Circle,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Layers3,
  LoaderCircle,
  Lock,
  MousePointer2,
  Search,
  Square,
  Trash2,
  Type,
  Undo2,
  Redo2,
  Unlock,
  WandSparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { runImageWorkflow } from '@/lib/ai/imagegpt-browser';
import type { AspectRatioId, PatternId, QualityId } from '@/lib/image-vector/types';

type EditorObject = {
  id: string;
  label: string;
  tag: string;
  fill: string;
  opacity: number;
  visible: boolean;
  locked: boolean;
  liveText: boolean;
};

type OcrWord = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  confidence: number;
};

type EditorProps = {
  sourceUrl: string;
  initialSvg?: string;
  pattern: PatternId;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  onComplete: (payload: { svg: string; previewDataUrl: string }) => void;
};

declare global {
  interface Window {
    Tesseract?: {
      createWorker: (
        language?: string,
        oem?: number,
        options?: {
          logger?: (message: { status?: string; progress?: number }) => void;
        },
      ) => Promise<{
        recognize: (
          image: string,
          options?: Record<string, unknown>,
          output?: { tsv?: boolean },
        ) => Promise<{ data: { text?: string; tsv?: string } }>;
        terminate: () => Promise<void>;
      }>;
    };
  }
}

export function VectorCustomizeEditor(props: EditorProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const autoOcrStartedRef = useRef(false);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    tx: number;
    ty: number;
  } | null>(null);

  const [svgMarkup, setSvgMarkup] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState('');
  const [zoom, setZoom] = useState(72);
  const [initializing, setInitializing] = useState(true);
  const [editorError, setEditorError] = useState('');
  const [renderTick, setRenderTick] = useState(0);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState('');

  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrWordCount, setOcrWordCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setInitializing(true);
      setEditorError('');
      setSelectedId('');

      try {
        const next = props.initialSvg && props.initialSvg.trim()
          ? prepareEditorSvg(props.initialSvg)
          : await vectorizeImage(props.sourceUrl, 'high');

        if (cancelled) return;
        setSvgMarkup(next);
        setHistory([next]);
        setHistoryIndex(0);
      } catch (error) {
        if (!cancelled) {
          setEditorError(
            error instanceof Error ? error.message : 'Could not initialize the vector editor.',
          );
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [props.sourceUrl, props.initialSvg]);

  useEffect(() => {
    if (initializing || !svgMarkup || autoOcrStartedRef.current) return;

    autoOcrStartedRef.current = true;
    const timer = window.setTimeout(() => {
      void runOcr();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [initializing, svgMarkup]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const point = clientPointToSvg(event.clientX, event.clientY);
      if (!point) return;

      const element = liveElement(drag.id);
      if (!element) return;

      element.setAttribute('data-tx', String(drag.tx + point.x - drag.startX));
      element.setAttribute('data-ty', String(drag.ty + point.y - drag.startY));
      applyTransform(element);
      setRenderTick((value) => value + 1);
    };

    const up = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      commitLiveSvg();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [svgMarkup, historyIndex]);

  const objects = useMemo(() => listObjects(svgMarkup), [svgMarkup, renderTick]);
  const selected = useMemo(
    () => objects.find((item) => item.id === selectedId) || null,
    [objects, selectedId],
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  function liveSvg() {
    return stageRef.current?.querySelector('svg') || null;
  }

  function liveElement(id: string) {
    const svg = liveSvg();
    return svg ? svg.querySelector<SVGElement>('#' + escapeCss(id)) : null;
  }

  function clientPointToSvg(clientX: number, clientY: number) {
    const svg = liveSvg() as SVGSVGElement | null;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;

    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const transformed = point.matrixTransform(matrix.inverse());

    return { x: transformed.x, y: transformed.y };
  }

  function currentLiveMarkup() {
    const svg = liveSvg();
    return svg ? new XMLSerializer().serializeToString(svg) : svgMarkup;
  }

  function commit(nextMarkup: string) {
    const normalized = prepareEditorSvg(nextMarkup);
    setSvgMarkup(normalized);
    setHistory((previous) => {
      const trimmed = previous.slice(0, historyIndex + 1);
      const next = trimmed.concat(normalized).slice(-40);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }

  function commitLiveSvg() {
    commit(currentLiveMarkup());
  }

  function mutateSelected(
    mutator: (element: SVGElement, root: SVGSVGElement) => void,
  ) {
    if (!selectedId) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
    const root = doc.documentElement as unknown as SVGSVGElement;
    const element = root.querySelector<SVGElement>('#' + escapeCss(selectedId));
    if (!element) return;

    mutator(element, root);
    commit(new XMLSerializer().serializeToString(root));
  }

  function undo() {
    if (!canUndo) return;
    const index = historyIndex - 1;
    setHistoryIndex(index);
    setSvgMarkup(history[index]);
    setSelectedId('');
  }

  function redo() {
    if (!canRedo) return;
    const index = historyIndex + 1;
    setHistoryIndex(index);
    setSvgMarkup(history[index]);
    setSelectedId('');
  }

  function handleStagePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as Element | null;
    const element = target?.closest?.('[data-editor-object="true"]') as SVGElement | null;

    if (!element || element.getAttribute('data-locked') === 'true') {
      setSelectedId('');
      return;
    }

    event.preventDefault();
    setSelectedId(element.id);

    const point = clientPointToSvg(event.clientX, event.clientY);
    if (!point) return;

    dragRef.current = {
      id: element.id,
      startX: point.x,
      startY: point.y,
      tx: numberAttr(element, 'data-tx', 0),
      ty: numberAttr(element, 'data-ty', 0),
    };
  }

  function addText() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
    const root = doc.documentElement as unknown as SVGSVGElement;
    const ns = 'http://www.w3.org/2000/svg';
    const box = viewBox(root);
    const id = makeId('text');

    const text = doc.createElementNS(ns, 'text');
    text.textContent = 'EDIT TEXT';
    text.setAttribute('x', String(box.x + box.width * 0.5));
    text.setAttribute('y', String(box.y + box.height * 0.5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', String(Math.max(24, box.height * 0.045)));
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('stroke', '#000000');
    text.setAttribute('stroke-width', String(Math.max(0.5, box.width * 0.0007)));
    text.setAttribute('paint-order', 'stroke');
    text.setAttribute('data-live-text', 'true');
    initializeObject(text, id);

    root.appendChild(text);
    commit(new XMLSerializer().serializeToString(root));
    setSelectedId(id);
  }

  function addShape(kind: 'rect' | 'circle') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
    const root = doc.documentElement as unknown as SVGSVGElement;
    const ns = 'http://www.w3.org/2000/svg';
    const box = viewBox(root);
    const id = makeId(kind);

    let element: SVGElement;

    if (kind === 'rect') {
      const rect = doc.createElementNS(ns, 'rect');
      rect.setAttribute('x', String(box.x + box.width * 0.39));
      rect.setAttribute('y', String(box.y + box.height * 0.41));
      rect.setAttribute('width', String(box.width * 0.22));
      rect.setAttribute('height', String(box.height * 0.14));
      rect.setAttribute('rx', String(Math.max(4, box.width * 0.008)));
      element = rect;
    } else {
      const circle = doc.createElementNS(ns, 'circle');
      circle.setAttribute('cx', String(box.x + box.width * 0.5));
      circle.setAttribute('cy', String(box.y + box.height * 0.5));
      circle.setAttribute('r', String(Math.min(box.width, box.height) * 0.08));
      element = circle;
    }

    element.setAttribute('fill', '#0f7cff');
    initializeObject(element, id);
    root.appendChild(element);

    commit(new XMLSerializer().serializeToString(root));
    setSelectedId(id);
  }

  async function addLogo(file?: File | null) {
    if (!file) return;
    setEditorError('');

    try {
      const logoSvg = file.name.toLowerCase().endsWith('.svg')
        ? await file.text()
        : await vectorizeImage(await fileDataUrl(file), 'medium');

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
      const root = doc.documentElement as unknown as SVGSVGElement;
      const imported = parser.parseFromString(logoSvg, 'image/svg+xml').documentElement;
      const ns = 'http://www.w3.org/2000/svg';
      const id = makeId('logo');
      const group = doc.createElementNS(ns, 'g');
      initializeObject(group, id);

      Array.from(imported.children).forEach((child) => {
        if (['defs', 'title', 'desc'].includes(child.tagName.toLowerCase())) return;
        group.appendChild(doc.importNode(child, true));
      });

      const hostBox = viewBox(root);
      const logoBox = viewBox(imported);
      const scale = hostBox.width * 0.16 / Math.max(1, logoBox.width);

      group.setAttribute('data-scale', String(scale));
      group.setAttribute(
        'data-tx',
        String(hostBox.x + hostBox.width * 0.5 - (logoBox.x + logoBox.width / 2) * scale),
      );
      group.setAttribute(
        'data-ty',
        String(hostBox.y + hostBox.height * 0.45 - (logoBox.y + logoBox.height / 2) * scale),
      );
      applyTransform(group);
      root.appendChild(group);

      commit(new XMLSerializer().serializeToString(root));
      setSelectedId(id);
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : 'Could not add logo.');
    }
  }

  async function runOcr() {
    if (ocrBusy || !props.sourceUrl) return;

    setOcrBusy(true);
    setOcrProgress(1);
    setOcrStatus('Loading OCR engine...');
    setOcrWordCount(0);
    setEditorError('');

    let worker:
      | Awaited<ReturnType<NonNullable<Window['Tesseract']>['createWorker']>>
      | null = null;

    try {
      await loadOcrScript();
      if (!window.Tesseract) throw new Error('OCR engine did not load.');

      worker = await window.Tesseract.createWorker('eng', 1, {
        logger: (message) => {
          if (typeof message.progress === 'number') {
            setOcrProgress(Math.max(2, Math.round(message.progress * 78)));
          }
          if (message.status) setOcrStatus(message.status);
        },
      });

      const result = await worker.recognize(props.sourceUrl, {}, { tsv: true });
      const words = parseTsv(result.data.tsv || '');

      if (!words.length) {
        setOcrProgress(100);
        setOcrStatus('No reliable text was detected.');
        return;
      }

      const image = await loadImage(props.sourceUrl);
      const next = addOcrLayers(
        svgMarkup,
        words,
        image.naturalWidth || image.width,
        image.naturalHeight || image.height,
      );

      commit(next);
      setOcrWordCount(words.length);
      setOcrProgress(100);
      setOcrStatus(
        String(words.length) +
          ' editable OCR text layer' +
          (words.length === 1 ? '' : 's') +
          ' created.',
      );
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : 'OCR failed.');
      setOcrStatus('OCR did not complete.');
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch {
          // Ignore shutdown errors.
        }
      }
      setOcrBusy(false);
    }
  }

  async function runAiEdit() {
    if (aiBusy || !aiPrompt.trim()) return;

    setAiBusy(true);
    setAiStatus('Preparing current vector canvas for Gemini 3 Pro...');
    setEditorError('');

    try {
      const file = await svgToPngFile(currentLiveMarkup(), 'ai-vector-editor.png', 2200);

      setAiStatus('Gemini 3 Pro is applying your instruction...');

      const result = await runImageWorkflow({
        image: file,
        workflow: 'customize',
        pattern: props.pattern,
        quality: props.quality,
        aspectRatio: props.aspectRatio,
        customizationPrompt: aiPrompt.trim(),
      });

      setAiStatus('AI edit complete. Rebuilding editable vector objects...');

      const rebuilt = await vectorizeImage(result.dataUrl, 'high');
      commit(rebuilt);
      setSelectedId('');
      setAiPrompt('');
      setAiStatus(
        result.usedFallback
          ? 'AI edit ready · Cloudflare fallback · vector canvas rebuilt.'
          : 'AI edit ready · Gemini 3 Pro · vector canvas rebuilt.',
      );
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : 'AI edit failed.');
      setAiStatus('AI edit did not complete.');
    } finally {
      setAiBusy(false);
    }
  }

  async function finish() {
    try {
      setEditorError('');
      const current = currentLiveMarkup();
      const previewDataUrl = await svgToPngDataUrl(current, 2600);
      props.onComplete({ svg: current, previewDataUrl });
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : 'Could not prepare preview.');
    }
  }

  function changeSelected(
    property: 'fill' | 'opacity' | 'scale' | 'rotate' | 'text' | 'fontSize' | 'fontFamily',
    value: string | number,
  ) {
    mutateSelected((element) => {
      if (property === 'fill') {
        applyToObject(element, (target) => target.setAttribute('fill', String(value)));
      } else if (property === 'opacity') {
        element.setAttribute('opacity', String(value));
      } else if (property === 'scale') {
        element.setAttribute('data-scale', String(value));
        applyTransform(element);
      } else if (property === 'rotate') {
        element.setAttribute('data-rotate', String(value));
        applyTransform(element);
      } else if (property === 'text') {
        element.textContent = String(value);
      } else if (property === 'fontSize') {
        element.setAttribute('font-size', String(value));
      } else if (property === 'fontFamily') {
        element.setAttribute('font-family', String(value));
      }
    });
  }

  function duplicateSelected() {
    mutateSelected((element, root) => {
      const clone = element.cloneNode(true) as SVGElement;
      const id = makeId('copy');
      initializeObject(clone, id);
      clone.setAttribute('data-tx', String(numberAttr(element, 'data-tx', 0) + 18));
      clone.setAttribute('data-ty', String(numberAttr(element, 'data-ty', 0) + 18));
      applyTransform(clone);
      root.appendChild(clone);
      setSelectedId(id);
    });
  }

  function deleteSelected() {
    mutateSelected((element) => element.remove());
    setSelectedId('');
  }

  function toggleLock() {
    mutateSelected((element) => {
      element.setAttribute(
        'data-locked',
        element.getAttribute('data-locked') === 'true' ? 'false' : 'true',
      );
    });
  }

  function toggleVisibility() {
    mutateSelected((element) => {
      const hidden = element.getAttribute('data-hidden') === 'true';
      element.setAttribute('data-hidden', hidden ? 'false' : 'true');
      element.setAttribute('display', hidden ? 'inline' : 'none');
    });
  }

  function nudge(dx: number, dy: number) {
    mutateSelected((element) => {
      element.setAttribute('data-tx', String(numberAttr(element, 'data-tx', 0) + dx));
      element.setAttribute('data-ty', String(numberAttr(element, 'data-ty', 0) + dy));
      applyTransform(element);
    });
  }

  function moveLayer(front: boolean) {
    mutateSelected((element, root) => {
      if (front) root.appendChild(element);
      else root.insertBefore(element, root.firstChild);
    });
  }

  function liveValue(attribute: string, fallback = '') {
    const element = liveElement(selectedId);
    if (!element) return fallback;
    if (attribute === 'text') return element.textContent || fallback;
    return element.getAttribute(attribute) || fallback;
  }

  function liveNumber(attribute: string, fallback: number) {
    const value = Number(liveValue(attribute, String(fallback)));
    return Number.isFinite(value) ? value : fallback;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#030914] shadow-[0_30px_90px_rgba(0,0,0,.38)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#07111f] px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">AI Vector Workspace</p>
          <h2 className="mt-1 text-lg font-black">Customize · Illustrator-style Editor</h2>
        </div>

        <div className="flex items-center gap-2">
          <IconButton title="Undo" onClick={undo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" />
          </IconButton>
          <IconButton title="Redo" onClick={redo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" />
          </IconButton>
          <IconButton title="Zoom out" onClick={() => setZoom((value) => Math.max(25, value - 10))}>
            <ZoomOut className="h-4 w-4" />
          </IconButton>
          <span className="min-w-12 text-center text-xs font-bold text-white/60">{zoom}%</span>
          <IconButton title="Zoom in" onClick={() => setZoom((value) => Math.min(180, value + 10))}>
            <ZoomIn className="h-4 w-4" />
          </IconButton>

          <button
            type="button"
            onClick={() => void finish()}
            disabled={initializing || !svgMarkup}
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#0875ff,#16c8ff)] px-4 py-2.5 text-sm font-black text-white disabled:opacity-40"
          >
            <Check className="h-4 w-4" />
            Preview Final Design
          </button>
        </div>
      </div>

      {editorError ? (
        <div className="border-b border-red-400/20 bg-red-500/8 px-4 py-3 text-sm text-red-200">
          {editorError}
        </div>
      ) : null}

      <div className="grid min-h-[760px] xl:grid-cols-[76px_minmax(0,1fr)_330px]">
        <aside className="border-r border-white/10 bg-[#050c17] p-2">
          <div className="space-y-2">
            <ToolButton title="Select / Move" onClick={() => setSelectedId('')}>
              <MousePointer2 className="h-5 w-5" />
            </ToolButton>
            <ToolButton title="Add Text" onClick={addText}>
              <Type className="h-5 w-5" />
            </ToolButton>
            <ToolButton title="Rectangle" onClick={() => addShape('rect')}>
              <Square className="h-5 w-5" />
            </ToolButton>
            <ToolButton title="Circle" onClick={() => addShape('circle')}>
              <Circle className="h-5 w-5" />
            </ToolButton>
            <ToolButton title="Vectorize / Add Logo" onClick={() => logoInputRef.current?.click()}>
              <ImagePlus className="h-5 w-5" />
            </ToolButton>

            <div className="my-3 h-px bg-white/10" />

            <ToolButton title="OCR Text Detection" onClick={() => void runOcr()} busy={ocrBusy}>
              <Search className="h-5 w-5" />
            </ToolButton>
            <ToolButton title="AI Power" onClick={() => setAiStatus('Use the AI Power panel on the right.')}>
              <WandSparkles className="h-5 w-5" />
            </ToolButton>
          </div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={(event) => {
              void addLogo(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </aside>

        <div className="relative min-w-0 overflow-hidden bg-[#101722]">
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:22px_22px]" />

          {initializing ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-[#050b14]/92">
              <div className="text-center">
                <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-sky-400" />
                <p className="mt-4 font-bold">Building editable vector canvas...</p>
                <p className="mt-2 text-sm text-white/45">Tracing shapes, colors and typography outlines.</p>
              </div>
            </div>
          ) : null}

          <div className="absolute left-4 top-4 z-10 rounded-xl border border-white/10 bg-[#07111f]/90 px-3 py-2 text-xs text-white/55 backdrop-blur">
            {objects.length.toLocaleString()} editable objects · drag objects directly
          </div>

          <div className="absolute inset-0 overflow-auto p-12">
            <div className="mx-auto flex min-h-full min-w-full items-center justify-center">
              <div
                ref={stageRef}
                onPointerDown={handleStagePointerDown}
                className="relative select-none [&_svg]:h-auto [&_svg]:max-h-[690px] [&_svg]:max-w-[1100px] [&_svg]:overflow-visible [&_[data-editor-object='true']]:cursor-move"
                style={{
                  transform: 'scale(' + String(zoom / 100) + ')',
                  transformOrigin: 'center center',
                }}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            </div>
          </div>
        </div>

        <aside className="overflow-y-auto border-l border-white/10 bg-[#07111f] p-4">
          <section className="rounded-2xl border border-sky-400/15 bg-sky-500/[0.05] p-4">
            <div className="flex items-center gap-2 text-sm font-black text-sky-200">
              <Bot className="h-4 w-4" />
              AI Power · Gemini 3 Pro
            </div>

            <textarea
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              rows={5}
              placeholder="Example: make sleeve graphics gold, replace sponsor, keep everything else unchanged..."
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#020812] px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-white/25 focus:border-sky-400/45"
            />

            <button
              type="button"
              onClick={() => void runAiEdit()}
              disabled={aiBusy || !aiPrompt.trim()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#0875ff,#16c8ff)] px-3 py-3 text-sm font-black disabled:opacity-35"
            >
              {aiBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              {aiBusy ? 'AI Editing...' : 'Apply AI Edit'}
            </button>

            {aiStatus ? <p className="mt-2 text-xs leading-5 text-white/48">{aiStatus}</p> : null}
          </section>

          <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black">
                <Search className="h-4 w-4 text-cyan-300" />
                OCR Typography
              </div>
              {ocrWordCount ? <span className="text-xs text-emerald-300">{ocrWordCount} text</span> : null}
            </div>

            <button
              type="button"
              onClick={() => void runOcr()}
              disabled={ocrBusy}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/8 px-3 py-2.5 text-xs font-bold text-cyan-100 disabled:opacity-40"
            >
              {ocrBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Type className="h-4 w-4" />}
              {ocrBusy ? 'Detecting Text...' : 'Detect Text → Live Text Layers'}
            </button>

            {ocrBusy || ocrStatus ? (
              <>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9,#22d3ee)] transition-all"
                    style={{ width: String(ocrProgress) + '%' }}
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-white/45">{ocrStatus}</p>
              </>
            ) : null}
          </section>

          <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <MousePointer2 className="h-4 w-4 text-sky-300" />
              Properties
            </div>

            {selected ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-white/40">Selected</p>
                  <p className="mt-1 truncate text-sm font-bold">{selected.label}</p>
                </div>

                {selected.liveText ? (
                  <>
                    <PropertyInput
                      label="Text"
                      value={liveValue('text')}
                      onChange={(value) => changeSelected('text', value)}
                    />
                    <PropertyInput
                      label="Font Family"
                      value={liveValue('font-family', 'Arial')}
                      onChange={(value) => changeSelected('fontFamily', value)}
                    />
                    <PropertyNumber
                      label="Font Size"
                      value={liveNumber('font-size', 36)}
                      min={6}
                      max={400}
                      onChange={(value) => changeSelected('fontSize', value)}
                    />
                  </>
                ) : null}

                <label className="block">
                  <span className="text-xs font-semibold text-white/48">Fill</span>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={safeColor(selected.fill)}
                      onChange={(event) => changeSelected('fill', event.target.value)}
                      className="h-10 w-12 rounded-lg border-0 bg-transparent"
                    />
                    <span className="text-xs uppercase text-white/55">{selected.fill || 'mixed'}</span>
                  </div>
                </label>

                <label className="block">
                  <span className="flex justify-between text-xs font-semibold text-white/48">
                    <span>Opacity</span>
                    <span>{Math.round(selected.opacity * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selected.opacity}
                    onChange={(event) => changeSelected('opacity', Number(event.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-white/48">Scale</span>
                  <input
                    type="range"
                    min="0.15"
                    max="3"
                    step="0.05"
                    value={liveNumber('data-scale', 1)}
                    onChange={(event) => changeSelected('scale', Number(event.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="flex justify-between text-xs font-semibold text-white/48">
                    <span>Rotation</span>
                    <span>{Math.round(liveNumber('data-rotate', 0))}°</span>
                  </span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={liveNumber('data-rotate', 0)}
                    onChange={(event) => changeSelected('rotate', Number(event.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <MiniButton onClick={() => nudge(-5, 0)}>←</MiniButton>
                  <MiniButton onClick={() => nudge(0, -5)}>↑</MiniButton>
                  <MiniButton onClick={() => nudge(5, 0)}>→</MiniButton>
                  <MiniButton onClick={() => nudge(0, 5)}>↓</MiniButton>
                  <MiniButton onClick={() => moveLayer(true)}>Front</MiniButton>
                  <MiniButton onClick={() => moveLayer(false)}>Back</MiniButton>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <MiniButton onClick={duplicateSelected}><Copy className="h-3.5 w-3.5" /> Copy</MiniButton>
                  <MiniButton onClick={toggleLock}>
                    {selected.locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    {selected.locked ? 'Unlock' : 'Lock'}
                  </MiniButton>
                  <MiniButton onClick={toggleVisibility}>
                    {selected.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {selected.visible ? 'Hide' : 'Show'}
                  </MiniButton>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-400/20 bg-red-500/8 px-2 py-2 text-xs font-bold text-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-white/10 p-4 text-center text-xs leading-5 text-white/38">
                Select a vector object on the canvas. You can move, recolor, resize, rotate, duplicate, hide, lock or delete it.
              </div>
            )}
          </section>

          <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <Layers3 className="h-4 w-4 text-violet-300" />
              Layers / Objects
            </div>

            <div className="mt-3 max-h-[300px] space-y-1 overflow-y-auto pr-1">
              {objects.slice(0, 120).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={
                    'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs ' +
                    (selectedId === item.id
                      ? 'bg-sky-500/15 text-sky-100'
                      : 'text-white/50 hover:bg-white/[0.04]')
                  }
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm border border-white/15"
                    style={{ background: safeColor(item.fill) }}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.liveText ? <Type className="h-3 w-3 text-cyan-300" /> : null}
                  {item.locked ? <Lock className="h-3 w-3" /> : null}
                </button>
              ))}
            </div>

            {objects.length > 120 ? (
              <p className="mt-2 text-[11px] text-white/35">
                Showing first 120 objects. Direct canvas selection works for all {objects.length.toLocaleString()} objects.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </section>
  );
}

function IconButton(props: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      disabled={props.disabled}
      className="grid h-9 min-w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.035] px-2 text-white/70 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-25"
    >
      {props.children}
    </button>
  );
}

function ToolButton(props: {
  title: string;
  onClick: () => void;
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      disabled={props.busy}
      className="grid h-12 w-full place-items-center rounded-xl border border-white/8 bg-white/[0.025] text-white/55 transition hover:border-sky-400/25 hover:bg-sky-500/8 hover:text-white disabled:opacity-40"
    >
      {props.busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : props.children}
    </button>
  );
}

function MiniButton(props: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-semibold text-white/65 hover:bg-white/[0.06] hover:text-white"
    >
      {props.children}
    </button>
  );
}

function PropertyInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/48">{props.label}</span>
      <input
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-[#020812] px-3 py-2 text-xs text-white outline-none focus:border-sky-400/45"
      />
    </label>
  );
}

function PropertyNumber(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/48">{props.label}</span>
      <input
        type="number"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-white/10 bg-[#020812] px-3 py-2 text-xs text-white outline-none focus:border-sky-400/45"
      />
    </label>
  );
}

async function vectorizeImage(sourceUrl: string, quality: 'high' | 'medium') {
  const image = await loadImage(sourceUrl);
  const maxEdge = quality === 'high' ? 2600 : 1600;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const ratio = Math.min(1, maxEdge / Math.max(width, height));

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Vector canvas is unavailable.');

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const { default: ImageTracer } = await import('imagetracerjs');
  const svg = ImageTracer.imagedataToSVG(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
    quality === 'high'
      ? {
          ltres: 0.8,
          qtres: 0.8,
          pathomit: 2,
          colorsampling: 2,
          numberofcolors: 64,
          mincolorratio: 0.002,
          scale: 1,
        }
      : {
          ltres: 1,
          qtres: 1,
          pathomit: 5,
          colorsampling: 2,
          numberofcolors: 40,
          mincolorratio: 0.006,
          scale: 1,
        },
  );

  return prepareEditorSvg(svg);
}

function prepareEditorSvg(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;

  if (root.nodeName.toLowerCase() !== 'svg') {
    throw new Error('The editor received an invalid vector document.');
  }

  root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  root.setAttribute('data-vector-editor', 'my-jersey');

  const objects = Array.from(
    root.querySelectorAll('path,polygon,polyline,rect,circle,ellipse,line,text,g[data-editor-object="true"]'),
  ).filter((node) => {
    if (node.closest('defs')) return false;
    const owner = node.parentElement?.closest('[data-editor-object="true"]');
    return !owner;
  });

  let counter = 1;

  objects.forEach((node) => {
    const element = node as SVGElement;
    if (!element.id) {
      element.id = 'vector-object-' + String(counter++).padStart(5, '0');
    }

    if (!element.hasAttribute('data-editor-object')) {
      initializeObject(element, element.id);
    } else {
      ensureTransformData(element);
    }
  });

  return new XMLSerializer().serializeToString(root);
}

function initializeObject(element: SVGElement, id: string) {
  element.id = id;
  element.setAttribute('data-editor-object', 'true');
  if (!element.hasAttribute('data-locked')) element.setAttribute('data-locked', 'false');
  if (!element.hasAttribute('data-hidden')) element.setAttribute('data-hidden', 'false');
  ensureTransformData(element);
}

function ensureTransformData(element: SVGElement) {
  if (!element.hasAttribute('data-tx')) element.setAttribute('data-tx', '0');
  if (!element.hasAttribute('data-ty')) element.setAttribute('data-ty', '0');
  if (!element.hasAttribute('data-scale')) element.setAttribute('data-scale', '1');
  if (!element.hasAttribute('data-rotate')) element.setAttribute('data-rotate', '0');
  applyTransform(element);
}

function applyTransform(element: SVGElement) {
  const tx = numberAttr(element, 'data-tx', 0);
  const ty = numberAttr(element, 'data-ty', 0);
  const scale = numberAttr(element, 'data-scale', 1);
  const rotate = numberAttr(element, 'data-rotate', 0);

  element.setAttribute(
    'transform',
    'translate(' + String(tx) + ' ' + String(ty) + ') rotate(' + String(rotate) + ') scale(' + String(scale) + ')',
  );
}

function applyToObject(element: SVGElement, mutator: (target: SVGElement) => void) {
  if (element.tagName.toLowerCase() === 'g') {
    element
      .querySelectorAll<SVGElement>('path,polygon,polyline,rect,circle,ellipse,line,text')
      .forEach(mutator);
  } else {
    mutator(element);
  }
}

function listObjects(svg: string): EditorObject[] {
  if (!svg) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');

  return Array.from(
    doc.querySelectorAll<SVGElement>('[data-editor-object="true"]'),
  ).map((element, index) => {
    const tag = element.tagName.toLowerCase();
    const fill =
      element.getAttribute('fill') ||
      element.querySelector<SVGElement>('[fill]')?.getAttribute('fill') ||
      '#808080';
    const opacity = Number(element.getAttribute('opacity') || '1');
    const liveText = element.getAttribute('data-live-text') === 'true';

    return {
      id: element.id,
      tag,
      label:
        element.getAttribute('data-layer') ||
        element.getAttribute('aria-label') ||
        (liveText
          ? 'Text · ' + (element.textContent || '').slice(0, 24)
          : capitalize(tag) + ' ' + String(index + 1)),
      fill,
      opacity: Number.isFinite(opacity) ? opacity : 1,
      visible:
        element.getAttribute('data-hidden') !== 'true' &&
        element.getAttribute('display') !== 'none',
      locked: element.getAttribute('data-locked') === 'true',
      liveText,
    };
  });
}

function addOcrLayers(
  svg: string,
  words: OcrWord[],
  imageWidth: number,
  imageHeight: number,
) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement as unknown as SVGSVGElement;
  const ns = 'http://www.w3.org/2000/svg';
  const box = viewBox(root);
  const sx = box.width / Math.max(1, imageWidth);
  const sy = box.height / Math.max(1, imageHeight);

  const layer = doc.createElementNS(ns, 'g');
  layer.setAttribute('id', makeId('ocr-layer'));
  layer.setAttribute('data-layer', 'OCR Live Text');

  words.forEach((word, index) => {
    const text = doc.createElementNS(ns, 'text');
    const x = box.x + (word.left + word.width / 2) * sx;
    const y = box.y + (word.top + word.height * 0.88) * sy;
    const fontSize = Math.max(8, word.height * sy * 0.95);

    text.textContent = word.text;
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', String(fontSize));
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('stroke', '#000000');
    text.setAttribute('stroke-width', String(Math.max(0.3, fontSize * 0.025)));
    text.setAttribute('paint-order', 'stroke');
    text.setAttribute('data-live-text', 'true');
    text.setAttribute('data-ocr-confidence', String(word.confidence));
    initializeObject(text, 'ocr-text-' + String(index + 1).padStart(4, '0'));
    layer.appendChild(text);
  });

  root.appendChild(layer);
  return prepareEditorSvg(new XMLSerializer().serializeToString(root));
}

function parseTsv(tsv: string): OcrWord[] {
  const lines = tsv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].split('\t');
  const index = (name: string) => header.indexOf(name);

  const level = index('level');
  const left = index('left');
  const top = index('top');
  const width = index('width');
  const height = index('height');
  const confidence = index('conf');
  const text = index('text');

  return lines.slice(1).flatMap((line) => {
    const columns = line.split('\t');
    const value = (columns[text] || '').trim();
    const conf = Number(columns[confidence] || 0);
    const rowLevel = Number(columns[level] || 0);

    if (rowLevel !== 5 || !value || conf < 42) return [];

    return [{
      text: value,
      left: Number(columns[left] || 0),
      top: Number(columns[top] || 0),
      width: Number(columns[width] || 0),
      height: Number(columns[height] || 0),
      confidence: conf,
    }];
  });
}

async function loadOcrScript() {
  if (window.Tesseract) return;

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-my-jersey-ocr="true"]',
  );

  if (existing) {
    await waitFor(() => Boolean(window.Tesseract), 20000);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@7/dist/tesseract.min.js';
    script.async = true;
    script.setAttribute('data-my-jersey-ocr', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load OCR engine.'));
    document.head.appendChild(script);
  });

  await waitFor(() => Boolean(window.Tesseract), 5000);
}

function waitFor(predicate: () => boolean, timeout: number) {
  return new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (predicate()) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - start > timeout) {
        window.clearInterval(timer);
        reject(new Error('OCR engine timed out while loading.'));
      }
    }, 100);
  });
}

async function svgToPngFile(svg: string, name: string, maxEdge: number) {
  const dataUrl = await svgToPngDataUrl(svg, maxEdge);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: 'image/png' });
}

async function svgToPngDataUrl(svg: string, maxEdge: number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement as unknown as SVGSVGElement;
  const box = viewBox(root);
  const scale = Math.min(1, maxEdge / Math.max(box.width, box.height));
  const width = Math.max(1, Math.round(box.width * scale));
  const height = Math.max(1, Math.round(box.height * scale));

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Preview canvas is unavailable.');

    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

function viewBox(svg: SVGSVGElement | Element) {
  const raw = svg.getAttribute('viewBox');

  if (raw) {
    const values = raw.trim().split(/[\s,]+/).map(Number);
    if (values.length === 4 && values.every(Number.isFinite)) {
      return {
        x: values[0],
        y: values[1],
        width: Math.max(1, values[2]),
        height: Math.max(1, values[3]),
      };
    }
  }

  return {
    x: 0,
    y: 0,
    width: Number.parseFloat(svg.getAttribute('width') || '1200') || 1200,
    height: Number.parseFloat(svg.getAttribute('height') || '900') || 900,
  };
}

function numberAttr(element: Element, attribute: string, fallback: number) {
  const value = Number(element.getAttribute(attribute));
  return Number.isFinite(value) ? value : fallback;
}

function safeColor(value: string) {
  const color = (value || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;

  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return (
      '#' +
      color
        .slice(1)
        .split('')
        .map((part) => part + part)
        .join('')
    );
  }

  return '#808080';
}

function makeId(prefix: string) {
  return (
    prefix +
    '-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

function escapeCss(value: string) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
}

function capitalize(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

async function fileDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read uploaded file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('Could not load artwork into the vector editor.'));
    image.src = src;
  });
}

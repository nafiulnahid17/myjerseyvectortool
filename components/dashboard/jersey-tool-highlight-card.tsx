'use client';

import type { ComponentType, ReactNode, MouseEvent } from 'react';
import { useId } from 'react';
import {
  ArrowRight,
  FileCog,
  FileImage,
  FileText,
  FolderOpen,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  SquarePen,
} from 'lucide-react';

export type ToolVisualKind =
  | 'vectorforge'
  | 'autopilot'
  | 'vectorlab'
  | 'showcase'
  | 'frontscan'
  | 'batchforge'
  | 'ordersheet'
  | 'assetforge'
  | 'designvault'
  | 'exportpack'
  | 'rescuex'
  | 'tracedesk'
  | 'colordesk'
  | 'cutprep'
  | 'convertx';

export type ToolCardModel = {
  title: string;
  href: string;
  description: string;
  workflow: string[];
  visual: ToolVisualKind;
  icon: ComponentType<{ className?: string }>;
};

export function JerseyToolHighlightCard({
  tool,
  index,
  onOpen,
}: {
  tool: ToolCardModel;
  index: number;
  onOpen?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.href}
      onClick={(event) => onOpen?.(event, tool.href)}
      className="jerseyos-tool-card group"
      aria-label={'Open ' + tool.title}
    >
      <div className="jerseyos-tool-art">
        <ToolHeroVisual kind={tool.visual} />
        <span className="jerseyos-tool-art-index">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="jerseyos-tool-heading">
        <span className="jerseyos-tool-icon">
          <Icon className="h-5 w-5" />
        </span>
        <h3>{tool.title}</h3>
      </div>
      <p className="jerseyos-tool-description">{tool.description}</p>

      <div className="jerseyos-tool-footer">
        <div className="jerseyos-tool-workflow" aria-label={'Workflow: ' + tool.workflow.join(', ')}>
          {tool.workflow.map((step, stepIndex) => (
            <div key={step + '-' + stepIndex} className="jerseyos-workflow-step">
              <span>{step}</span>
              {stepIndex < tool.workflow.length - 1 ? (
                <ArrowRight aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
        <span className="jerseyos-tool-open">Open <ArrowRight aria-hidden="true" /></span>
      </div>
    </a>
  );
}

function ToolHeroVisual({ kind }: { kind: ToolVisualKind }) {
  if (kind === 'vectorforge') {
    return (
      <HeroShell>
        <JerseyGlyph tone="blue" />
        <FlowArrow />
        <div className="grid grid-cols-2 gap-2">
          {['Front', 'Back', 'L Sleeve', 'R Sleeve'].map((label) => (
            <PanelTile key={label} label={label} />
          ))}
        </div>
      </HeroShell>
    );
  }

  if (kind === 'autopilot') {
    return (
      <HeroShell>
        <JerseyGlyph tone="gold" />
        <FlowArrow />
        <div className="grid h-16 w-16 place-items-center rounded-[18px] border border-[#7ecaff] bg-[radial-gradient(circle,#22b8ff,#0b69df)] text-white shadow-[0_0_32px_rgba(30,164,255,.35)]">
          <Sparkles className="h-7 w-7" />
        </div>
        <FlowArrow />
        <div className="flex gap-2">
          <FileBadge label="SVG" tone="blue" />
          <FileBadge label="AI" tone="gold" />
        </div>
      </HeroShell>
    );
  }

  if (kind === 'vectorlab') {
    return (
      <HeroShell>
        <div className="w-[86%] rounded-2xl border border-[#b9d8f8] bg-[#0d274b] p-3 shadow-[0_16px_30px_rgba(13,39,75,.18)]">
          <div className="flex gap-2">
            <div className="w-9 space-y-1.5 rounded-xl bg-white/8 p-2">
              <SquarePen className="h-4 w-4 text-cyan-300" />
              <Layers3 className="h-4 w-4 text-cyan-300" />
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>
            <div className="relative flex flex-1 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#eff8ff,#dcecff)] p-3">
              <JerseyGlyph tone="navy" compact />
              <div className="absolute inset-3 rounded-xl border border-dashed border-[#1a83ec]/65" />
            </div>
            <div className="w-14 space-y-2 rounded-xl bg-white/8 p-2">
              <div className="h-2 rounded bg-cyan-300/70" />
              <div className="h-2 rounded bg-amber-300/70" />
              <div className="h-2 rounded bg-white/35" />
            </div>
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'showcase') {
    return (
      <HeroShell>
        <JerseyGlyph tone="blue" compact />
        <FlowArrow />
        <div className="relative rounded-2xl border border-[#b8d8f8] bg-[radial-gradient(circle_at_50%_35%,#38bdf8,#0f3f7f_52%,#07182f)] p-4 shadow-[0_0_30px_rgba(35,163,255,.25)]">
          <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-amber-300/55 blur-lg" />
          <JerseyGlyph tone="navy" compact />
        </div>
      </HeroShell>
    );
  }

  if (kind === 'frontscan') {
    return (
      <HeroShell>
        <div className="relative">
          <JerseyGlyph tone="navy" />
          <div className="absolute -inset-4 rounded-2xl border border-dashed border-[#0c88f2]/70" />
        </div>
        <div className="w-[42%] rounded-2xl border border-[#b9d8f8] bg-[#0b2d59] p-3 text-[9px] font-bold text-cyan-100 shadow-xl">
          <div className="mb-2 flex items-center gap-1.5 text-xs">
            <Search className="h-3.5 w-3.5" /> Front Scan
          </div>
          {['Panel edges', 'Typography', 'Color areas', 'Artwork'].map((item) => (
            <div key={item} className="mt-1.5 flex justify-between gap-2">
              <span className="text-white/55">{item}</span>
              <span aria-hidden="true">···</span>
            </div>
          ))}
        </div>
      </HeroShell>
    );
  }

  if (kind === 'batchforge') {
    return (
      <HeroShell>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <FileBadge label="TXT" tone="blue" />
            <FileBadge label="PDF" tone="red" />
            <FileBadge label="XLS" tone="green" />
          </div>
          <div className="text-lg font-black text-[#d6a126]">↓</div>
          <div className="flex gap-2">
            <JerseyGlyph tone="gold" tiny />
            <JerseyGlyph tone="blue" tiny />
            <JerseyGlyph tone="navy" tiny />
            <JerseyGlyph tone="red" tiny />
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'ordersheet') {
    return (
      <HeroShell>
        <div className="w-[88%] overflow-hidden rounded-2xl border border-[#b7d7f6] bg-white shadow-[0_15px_28px_rgba(26,82,142,.12)]">
          <div className="flex items-center gap-2 bg-[#0c70d9] px-3 py-2 text-[10px] font-black text-white">
            <FileText className="h-3.5 w-3.5" /> PRODUCTION SHEET
          </div>
          <div className="grid grid-cols-5 border-t border-[#d8e8f7] text-center text-[8px] font-bold text-[#31577f]">
            {['Jersey', 'Size', 'Name', 'No.', 'Qty'].map((h) => (
              <div key={h} className="border-r border-[#e4eef7] px-1 py-2 last:border-0">{h}</div>
            ))}
            {Array.from({ length: 15 }, (_, index) => (
              <div key={index} className="jerseyos-sheet-cell border-r border-t border-[#edf3f9] px-1 py-2 last:border-r-0">
                <span style={{ width: `${35 + ((index * 17) % 46)}%` }} />
              </div>
            ))}
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'assetforge') {
    const tiles: ReactNode[] = [
      <Sparkles key="s" className="h-6 w-6" />,
      <FileImage key="f" className="h-6 w-6" />,
      <SquarePen key="p" className="h-6 w-6" />,
      <span key="23" className="text-xl font-black">23</span>,
      <Layers3 key="l" className="h-6 w-6" />,
      <span key="a" className="text-xl font-black">A</span>,
    ];
    return (
      <HeroShell>
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((node, i) => (
            <div key={i} className="grid h-16 w-16 place-items-center rounded-2xl border border-[#c8dff5] bg-white text-[#0c70d9] shadow-[0_9px_20px_rgba(24,89,156,.08)]">
              {node}
            </div>
          ))}
        </div>
      </HeroShell>
    );
  }

  if (kind === 'designvault') {
    return (
      <HeroShell>
        <div className="w-[90%] rounded-[22px] border border-[#c7def5] bg-white p-3 shadow-[0_16px_30px_rgba(24,89,156,.09)]">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#0a5eb6]">
            <FolderOpen className="h-4 w-4" /> Design Vault
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(['blue', 'gold', 'navy', 'red', 'blue', 'navy', 'gold', 'red', 'blue', 'navy'] as JerseyTone[]).map((tone, index) => (
              <div key={index} className="rounded-xl border border-[#e0ecf8] bg-[#f7fbff] p-1.5">
                <JerseyGlyph tone={tone} tiny />
              </div>
            ))}
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'exportpack') {
    return (
      <HeroShell>
        <JerseyGlyph tone="navy" />
        <FlowArrow />
        <div className="grid grid-cols-3 gap-2">
          <FileBadge label="SVG" tone="gold" />
          <FileBadge label="AI" tone="gold" />
          <FileBadge label="EPS" tone="blue" />
          <FileBadge label="PDF" tone="red" />
          <FileBadge label="PNG" tone="blue" />
          <FileBadge label="…" tone="navy" />
        </div>
      </HeroShell>
    );
  }

  if (kind === 'rescuex') {
    return (
      <HeroShell>
        <div className="relative opacity-70">
          <JerseyGlyph tone="navy" />
          <div className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-500 text-xs font-black text-white shadow-lg">!</div>
        </div>
        <FlowArrow />
        <div className="grid h-16 w-16 place-items-center rounded-[18px] border border-[#7ecaff] bg-[#0a67d2] text-white shadow-[0_0_28px_rgba(30,164,255,.28)]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <FlowArrow />
        <div className="flex gap-2">
          <FileBadge label="SVG" tone="gold" />
          <FileBadge label="AI" tone="blue" />
        </div>
      </HeroShell>
    );
  }

  if (kind === 'tracedesk') {
    return (
      <HeroShell>
        <div className="relative w-[86%] rounded-2xl border border-[#bdd9f4] bg-white p-4 shadow-[0_16px_30px_rgba(24,89,156,.10)]">
          <div className="flex items-center justify-between gap-3">
            <JerseyGlyph tone="navy" compact />
            <div className="relative h-24 flex-1">
              <svg viewBox="0 0 180 100" className="h-full w-full" aria-hidden="true">
                <path d="M12 80 C40 12, 88 96, 166 20" fill="none" stroke="#1677e8" strokeWidth="4" />
                {[12, 58, 108, 166].map((x, i) => (
                  <circle key={x} cx={x} cy={[80,44,61,20][i]} r="6" fill="#ffffff" stroke="#d6a126" strokeWidth="3" />
                ))}
              </svg>
              <SquarePen className="absolute right-0 top-0 h-5 w-5 text-[#0c70d9]" />
            </div>
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'colordesk') {
    return (
      <HeroShell>
        <div className="flex items-center gap-4 rounded-2xl border border-[#bdd9f4] bg-white p-4 shadow-[0_16px_30px_rgba(24,89,156,.10)]">
          <JerseyGlyph tone="blue" />
          <div className="grid grid-cols-2 gap-2">
            {['#0c8ef2', '#d8a328', '#0a2e63', '#c82e44', '#22c55e', '#a855f7'].map((color) => (
              <span key={color} className="h-9 w-9 rounded-xl border border-white shadow-md" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </HeroShell>
    );
  }

  if (kind === 'cutprep') {
    return (
      <HeroShell>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#bdd9f4] bg-white p-4 shadow-[0_16px_30px_rgba(24,89,156,.10)]">
          {['Front', 'Back', 'Sleeve', 'Sleeve', 'Collar', 'Trim'].map((label, index) => (
            <div key={label + index} className="flex h-16 min-w-16 items-center justify-center rounded-xl border-2 border-dashed border-[#2a8bea] bg-[#f5faff] px-2 text-center text-[9px] font-black text-[#245e98]">
              {label}
            </div>
          ))}
        </div>
      </HeroShell>
    );
  }

  return (
    <HeroShell>
      <div className="flex gap-2">
        <FileBadge label="PSD" tone="blue" />
        <FileBadge label="PNG" tone="navy" />
      </div>
      <div className="grid h-14 w-14 place-items-center rounded-full border border-[#c5ddf4] bg-white text-[#0d75db] shadow-[0_9px_20px_rgba(24,89,156,.11)]">
        <FileCog className="h-6 w-6" />
      </div>
      <div className="flex gap-2">
        <FileBadge label="AI" tone="gold" />
        <FileBadge label="SVG" tone="blue" />
        <FileBadge label="PDF" tone="red" />
      </div>
    </HeroShell>
  );
}

function HeroShell({ children }: { children: ReactNode }) {
  return (
    <div className="jerseyos-hero-shell relative flex h-full w-full items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,208,82,.20),transparent_28%),radial-gradient(circle_at_50%_68%,rgba(40,169,255,.18),transparent_45%),linear-gradient(145deg,#ffffff,#eef8ff)] p-4">
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(28,126,222,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(28,126,222,.055)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="absolute left-6 top-5 h-16 w-16 rounded-full border border-[#e9c86b]/35" />
      <div className="relative z-10 flex max-h-full max-w-full items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}

type JerseyTone = 'blue' | 'gold' | 'navy' | 'red';

function JerseyGlyph({
  tone,
  compact = false,
  tiny = false,
}: {
  tone: JerseyTone;
  compact?: boolean;
  tiny?: boolean;
}) {
  const size = tiny ? 'h-12 w-10' : compact ? 'h-20 w-16' : 'h-24 w-20';
  const colors: Record<JerseyTone, [string, string]> = {
    blue: ['#126b58', '#83efc2'],
    gold: ['#176f55', '#b4f777'],
    navy: ['#0b3431', '#20b588'],
    red: ['#155d64', '#70e8d1'],
  };
  const pair = colors[tone];
  const gradientId = 'jersey-' + tone + '-' + useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 100 120" className={size + ' jerseyos-jersey-glyph'} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={pair[0]} />
          <stop offset="1" stopColor={pair[1]} />
        </linearGradient>
      </defs>
      <path
        d="M30 12 42 7h16l12 5 20 10-10 22-10-6v70H30V38l-10 6L10 22l20-10Z"
        fill={'url(#' + gradientId + ')'}
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path d="M41 9c2 8 16 8 18 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 50h32" stroke="rgba(255,255,255,.55)" strokeWidth="3" strokeLinecap="round" />
      <text x="50" y="78" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">23</text>
    </svg>
  );
}

function FlowArrow() {
  return <ArrowRight className="jerseyos-flow-arrow h-5 w-5 shrink-0 text-[#d6a126]" />;
}

function PanelTile({ label }: { label: string }) {
  return (
    <div className="jerseyos-panel-tile flex h-14 min-w-16 items-center justify-center rounded-xl border border-[#bddaf5] bg-white px-2 text-center text-[9px] font-black text-[#1a5ea0] shadow-[0_7px_15px_rgba(25,91,155,.08)]">
      {label}
    </div>
  );
}

function FileBadge({
  label,
  tone,
}: {
  label: string;
  tone: 'blue' | 'gold' | 'red' | 'green' | 'navy';
}) {
  const classes = {
    blue: 'border-sky-300 bg-sky-500 text-white',
    gold: 'border-amber-300 bg-amber-400 text-white',
    red: 'border-red-300 bg-red-500 text-white',
    green: 'border-emerald-300 bg-emerald-500 text-white',
    navy: 'border-[#274b7c] bg-[#173964] text-white',
  };
  return (
    <div className={'jerseyos-file-badge grid h-12 min-w-11 place-items-center rounded-xl border px-2 text-[9px] font-black shadow-[0_8px_16px_rgba(22,70,122,.10)] ' + classes[tone]}>
      {label}
    </div>
  );
}

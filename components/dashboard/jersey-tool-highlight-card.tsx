'use client';

import type { ComponentType, ReactNode, MouseEvent } from 'react';
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
      className="jerseyos-tool-card group relative mx-auto flex aspect-[480/610] w-full max-w-[480px] flex-col overflow-hidden rounded-[30px] border border-[#dce9f7] bg-[linear-gradient(165deg,#ffffff_0%,#fbfdff_54%,#eef7ff_100%)] p-3.5 text-[#0a2858] shadow-[0_22px_55px_rgba(18,74,133,.13),0_2px_10px_rgba(15,43,83,.06)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-2 hover:border-[#b9d8f8] hover:shadow-[0_34px_74px_rgba(18,74,133,.19),0_4px_16px_rgba(15,43,83,.08)]"
      style={{ animationDelay: String(-index * 0.31) + 's' }}
      aria-label={'Open ' + tool.title}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-[radial-gradient(circle,rgba(246,190,55,.17),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-10 top-32 h-28 w-28 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative min-h-0 flex-[1.42] overflow-hidden rounded-[22px] border border-white/90 bg-[linear-gradient(145deg,#fefefe,#eef8ff)] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_12px_28px_rgba(28,91,158,.11)]">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.025]">
          <ToolHeroVisual kind={tool.visual} />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-[#d7e9fb]/75" />
      </div>

      <div className="relative flex shrink-0 items-start gap-3 px-1 pt-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d7e9fb] bg-white text-[#0f72e6] shadow-[0_6px_16px_rgba(28,91,158,.08)]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[clamp(1rem,1.3vw,1.18rem)] font-black tracking-[-0.025em] text-[#0a2858]">
            {tool.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[clamp(.72rem,.9vw,.82rem)] font-medium leading-[1.38] text-[#5e7190]">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="relative mt-3 flex shrink-0 items-center justify-between rounded-xl border border-[#c9e0f7] bg-[linear-gradient(90deg,#eff8ff,#ffffff)] px-3.5 py-2.5 text-[clamp(.72rem,.9vw,.82rem)] font-black text-[#0b68cf] shadow-[0_8px_18px_rgba(26,108,202,.08)]">
        <span>Use The Power</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>

      <div className="relative mt-2.5 shrink-0 rounded-[17px] border border-[#d8e8f7] bg-[linear-gradient(145deg,#ffffff,#f5faff)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.95)]">
        <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#234c82]">
          Highlight Workflow
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-1.5 overflow-hidden">
          {tool.workflow.map((step, stepIndex) => (
            <div key={step + '-' + stepIndex} className="contents">
              <span className="min-w-0 flex-1 truncate rounded-lg border border-[#e4eef8] bg-white px-2 py-1.5 text-center text-[10px] font-bold text-[#284f7d]">
                {step}
              </span>
              {stepIndex < tool.workflow.length - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#d49c24]" />
              ) : null}
            </div>
          ))}
        </div>
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
          {['Width', 'Height', 'Thickness', 'Typography', 'Layers'].map((item) => (
            <div key={item} className="mt-1.5 flex justify-between gap-2">
              <span className="text-white/55">{item}</span>
              <span>Detected</span>
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
            {[
              ['23', 'M', 'JOHN', '23', '10'],
              ['07', 'L', 'SMITH', '7', '8'],
              ['11', 'XL', 'DAVIS', '11', '12'],
            ].flatMap((row, r) =>
              row.map((cell, c) => (
                <div key={String(r) + '-' + String(c)} className="border-r border-t border-[#edf3f9] px-1 py-2 last:border-r-0">{cell}</div>
              )),
            )}
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
    <div className="relative flex h-full w-full items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,208,82,.20),transparent_28%),radial-gradient(circle_at_50%_68%,rgba(40,169,255,.18),transparent_45%),linear-gradient(145deg,#ffffff,#eef8ff)] p-4">
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
    blue: ['#0c8ef2', '#dff5ff'],
    gold: ['#d8a328', '#fff1b8'],
    navy: ['#0a2e63', '#1e80d8'],
    red: ['#c82e44', '#ff8a9a'],
  };
  const pair = colors[tone];
  const gradientId = 'jersey-' + tone;

  return (
    <svg viewBox="0 0 100 120" className={size} aria-hidden="true">
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
  return <ArrowRight className="h-5 w-5 shrink-0 text-[#d6a126]" />;
}

function PanelTile({ label }: { label: string }) {
  return (
    <div className="flex h-14 min-w-16 items-center justify-center rounded-xl border border-[#bddaf5] bg-white px-2 text-center text-[9px] font-black text-[#1a5ea0] shadow-[0_7px_15px_rgba(25,91,155,.08)]">
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
    <div className={'grid h-12 min-w-11 place-items-center rounded-xl border px-2 text-[9px] font-black shadow-[0_8px_16px_rgba(22,70,122,.10)] ' + classes[tone]}>
      {label}
    </div>
  );
}

import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import {
  Bell,
  Bot,
  ChevronDown,
  CircleHelp,
  FolderOpen,
  Globe,
  Home,
  Image as ImageIcon,
  Layers3,
  Menu,
  MoonStar,
  PencilRuler,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Zap,
  ArrowRight,
  FileCog,
  PackageOpen,
  Crown,
  SunMedium,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
};

type ToolItem = {
  title: string;
  href: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  panel: string;
  art: ReactNode;
};

const primaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home, active: true },
  { label: 'New Project', href: '/new-project', icon: Plus },
  { label: 'Image to Vector', href: '/image-to-vector', icon: ImageIcon },
  { label: 'Oneclick Creation', href: '/oneclick-creation', icon: Sparkles },
  { label: 'File Converter', href: '/file-converter', icon: FileCog },
  { label: 'Edit Existing File', href: '/edit-existing-file', icon: SquarePen },
];

const secondaryNav: NavItem[] = [
  { label: 'My Projects', href: '/projects', icon: FolderOpen },
  { label: 'Mockup Generator', href: '/mockup-generator', icon: PackageOpen },
  { label: 'Design Elements', href: '/design-elements', icon: Layers3 },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },
];

const tools: ToolItem[] = [
  {
    title: 'Image To Vector',
    href: '/image-to-vector',
    description: 'Upload a jersey image and convert it into a cleaner, production-ready vector workflow.',
    icon: Bot,
    accent: 'from-violet-500/70 via-indigo-500/60 to-blue-500/50',
    panel: 'border-violet-400/40',
    art: <PanelBlueprintArt />,
  },
  {
    title: 'Oneclick Creation',
    href: '/oneclick-creation',
    description: 'Auto-detect panels, prep layouts, and move faster from source image to editable output.',
    icon: Zap,
    accent: 'from-amber-500/70 via-orange-500/60 to-red-500/40',
    panel: 'border-amber-400/40',
    art: <JerseyDuoArt tone="warm" />,
  },
  {
    title: 'File Converter',
    href: '/file-converter',
    description: 'Move between SVG, PNG, JPG, PDF, and EPS so your files are ready for production or preview.',
    icon: FileCog,
    accent: 'from-emerald-500/70 via-green-500/60 to-cyan-500/50',
    panel: 'border-emerald-400/40',
    art: <FormatTilesArt />,
  },
  {
    title: 'Edit Existing File',
    href: '/edit-existing-file',
    description: 'Refine an existing jersey design, adjust artwork, and prepare the next export pass.',
    icon: PencilRuler,
    accent: 'from-fuchsia-500/70 via-pink-500/60 to-rose-500/40',
    panel: 'border-fuchsia-400/40',
    art: <EditStudioArt />,
  },
  {
    title: 'Fallback Backup',
    href: '/backup',
    description: 'Keep a recovery layer for key project files so you can safely restore and continue working.',
    icon: ShieldCheck,
    accent: 'from-sky-500/70 via-blue-500/60 to-cyan-500/40',
    panel: 'border-sky-400/40',
    art: <BackupCloudArt />,
  },
];

export function DashboardShell() {
  return (
    <main className="min-h-screen bg-[#030b18] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,78,171,0.35),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_22%),linear-gradient(180deg,rgba(7,16,36,1),rgba(3,11,24,1))]" />
        <div className="relative mx-auto flex min-h-screen max-w-[1720px] gap-6 px-4 py-4 sm:px-5 lg:px-6">
          <aside className="hidden w-[290px] shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(3,9,20,0.98),rgba(3,8,17,0.92))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] xl:block">
            <BrandCard />

            <nav className="mt-8 space-y-2">
              {primaryNav.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </nav>

            <div className="my-6 h-px bg-white/10" />

            <nav className="space-y-2">
              {secondaryNav.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </nav>

            <div className="mt-8 rounded-[22px] border border-amber-400/35 bg-[linear-gradient(180deg,rgba(126,74,7,0.30),rgba(84,52,12,0.18))] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-semibold">Upgrade to Pro</p>
                  <p className="mt-1 text-sm leading-6 text-white/70">
                    Unlock premium tools, advanced exports, and more powerful AI-driven workflows.
                  </p>
                </div>
              </div>
              <Link
                href="/upgrade"
                className="mt-4 inline-flex w-full items-center justify-between rounded-2xl border border-amber-300/30 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <section className="min-w-0 flex-1 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,11,23,0.86),rgba(2,7,16,0.88))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-5 lg:p-6">
            <TopBar />
            <HeroBanner />
            <ToolSection />
            <RecentProjectsSection />
          </section>
        </div>
      </div>
    </main>
  );
}

function BrandCard() {
  return (
    <div className="flex flex-col items-center rounded-[26px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(44,132,255,0.18),transparent_45%),linear-gradient(180deg,rgba(8,17,35,0.95),rgba(2,8,18,0.95))] px-5 py-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-[24px] border border-white/10 bg-white/[0.03] shadow-[inset_0_0_30px_rgba(37,99,235,0.18)]">
        <div className="relative text-[2.6rem] font-black tracking-tight">
          <span className="text-white">M</span>
          <span className="-ml-1 text-[#1e90ff]">J</span>
        </div>
      </div>
      <h1 className="mt-5 text-[2.2rem] font-black leading-none tracking-[0.06em]">MY JERSEY</h1>
      <p className="mt-1 text-lg font-semibold tracking-[0.46em] text-[#1e90ff]">STUDIO</p>
    </div>
  );
}

function SidebarItem({ label, href, icon: Icon, active }: NavItem) {
  return (
    <Link
      href={href}
      className={[
        'group flex items-center gap-4 rounded-[18px] px-4 py-3 text-[1.05rem] transition',
        active
          ? 'border border-sky-400/35 bg-[linear-gradient(90deg,rgba(16,94,194,0.62),rgba(8,33,64,0.40))] text-white shadow-[inset_0_0_0_1px_rgba(147,197,253,0.08)]'
          : 'border border-transparent text-white/86 hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
      ].join(' ')}
    >
      <span
        className={[
          'grid h-11 w-11 place-items-center rounded-2xl border transition',
          active
            ? 'border-white/10 bg-white/10 text-white'
            : 'border-white/8 bg-white/[0.03] text-white/75 group-hover:border-white/12 group-hover:text-white',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 xl:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative min-w-0 flex-1 lg:w-[560px] lg:flex-none">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
          <input
            type="text"
            placeholder="Search tools, projects, templates..."
            className="h-14 w-full rounded-[22px] border border-white/10 bg-white/[0.04] pl-12 pr-4 text-[1rem] text-white outline-none ring-0 placeholder:text-white/35"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="inline-flex rounded-[20px] border border-white/10 bg-white/[0.04] p-1.5">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white/75 transition hover:bg-white/[0.06] hover:text-white">
            <MoonStar className="h-5 w-5" />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f7bff] text-white shadow-[0_8px_20px_rgba(15,123,255,0.35)]">
            <SunMedium className="h-5 w-5" />
          </button>
        </div>

        <button className="inline-flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white">
          <Globe className="h-5 w-5 text-white/75" />
          English
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>

        <button className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80">
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-[#061325]" />
        </button>

        <button className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#18467f,#0d89ff)] text-base font-semibold text-white shadow-[inset_0_0_18px_rgba(255,255,255,0.16)]">
            TA
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-semibold">The Artist</p>
            <p className="text-sm text-white/60">Workspace</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-white/50 sm:block" />
        </button>
      </div>
    </header>
  );
}

function HeroBanner() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(4,12,28,0.95),rgba(8,20,47,0.90))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.30)] lg:p-9">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.24),transparent_24%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.18),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.18),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.24))]" />

      <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
        <div className="max-w-[720px]">
          <p className="text-xl italic tracking-wide text-white/85 md:text-2xl">Welcome To</p>
          <h2 className="mt-2 text-5xl font-black uppercase leading-[0.88] tracking-[0.03em] text-white sm:text-6xl lg:text-7xl">
            My Jersey
            <span className="mt-2 block bg-[linear-gradient(90deg,#d4e7ff,#46a0ff,#68b6ff)] bg-clip-text text-transparent">
              Studio
            </span>
          </h2>
          <div className="mt-5 h-1.5 w-32 rounded-full bg-[linear-gradient(90deg,#12c2ff,#1d4ed8)]" />
          <p className="mt-6 max-w-[620px] text-lg leading-8 text-white/80 sm:text-xl">
            Turn any jersey into a production-ready design flow — upload, vectorize, customize, preview, and export from one unified workspace.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-white/65">
            <span>Upload</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span>Vectorize</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span>Customize</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span>Preview</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span>Download</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/new-project"
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(90deg,#0e76ff,#29a7ff)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(14,118,255,0.32)] transition hover:translate-y-[-1px]"
            >
              <Plus className="h-5 w-5" />
              New Project
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute right-0 top-0 hidden text-right text-2xl italic text-white/85 lg:block">
            <p>Design</p>
            <p>Your Passion</p>
          </div>
          <div className="relative flex min-h-[310px] items-end justify-center gap-3 sm:gap-4 lg:min-h-[360px] xl:justify-end">
            <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.24),transparent_35%)] blur-2xl" />
            <div className="relative translate-y-2 sm:translate-y-4"><HeroJerseyRed /></div>
            <div className="relative z-10"><HeroJerseyBlue /></div>
            <div className="relative translate-y-1 sm:translate-y-4"><HeroJerseyPurple /></div>
            <div className="relative hidden translate-y-3 md:block"><HeroJerseyGold /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolSection() {
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-bold tracking-tight">Tools</h3>
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300">
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className={[
                'group relative overflow-hidden rounded-[26px] border bg-[linear-gradient(180deg,rgba(6,15,31,0.96),rgba(6,13,24,0.96))] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(0,0,0,0.28)]',
                tool.panel,
              ].join(' ')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-85`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.10] shadow-[inset_0_0_20px_rgba(255,255,255,0.10)]">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-[92px] shrink-0">{tool.art}</div>
                </div>
                <h4 className="mt-5 text-[1.85rem] font-bold leading-tight tracking-tight text-white">
                  {tool.title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/85">{tool.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/95">
                  Open tool
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.12] transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function RecentProjectsSection() {
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-bold tracking-tight">Recent Projects</h3>
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300">
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="col-span-full rounded-[26px] border border-dashed border-white/12 bg-white/[0.02] p-6 xl:col-span-3">
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-6 py-10 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_65%),rgba(255,255,255,0.03)] text-sky-300">
              <FolderOpen className="h-9 w-9" />
            </div>
            <h4 className="mt-5 text-2xl font-bold">No recent projects yet</h4>
            <p className="mt-3 max-w-[620px] text-base leading-7 text-white/65">
              Start your first project, import an existing jersey file, or run an image-to-vector flow. Your saved and recent designs will appear here automatically.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/new-project"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#0e76ff,#29a7ff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(14,118,255,0.28)]"
              >
                <Plus className="h-4 w-4" />
                Create New Project
              </Link>
              <Link
                href="/image-to-vector"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/85"
              >
                <ImageIcon className="h-4 w-4" />
                Import Jersey Image
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/new-project"
          className="group rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,17,32,0.96),rgba(5,11,22,0.96))] p-5 transition hover:-translate-y-1 hover:border-sky-400/40"
        >
          <div className="flex h-full min-h-[250px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/14 bg-white/[0.02] text-center">
            <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/12 bg-white/[0.03]">
              <Plus className="h-10 w-10 text-white/80" />
            </span>
            <h4 className="mt-4 text-2xl font-semibold">New Project</h4>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-white/60">
              Launch a fresh jersey workflow from upload to vector and export.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}

function PanelBlueprintArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="104" height="104" rx="22" fill="rgba(0,0,0,0.16)" stroke="rgba(255,255,255,0.12)" />
      <path d="M44 24L36 32L24 36V96H96V36L84 32L76 24H44Z" fill="rgba(35,112,255,0.18)" stroke="#D8E9FF" strokeWidth="2.4" />
      <path d="M36 32L46 44M84 32L74 44M60 24V96" stroke="#8ED0FF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="60" r="4" fill="#D8E9FF" />
    </svg>
  );
}

function JerseyDuoArt({ tone }: { tone: 'warm' | 'cool' }) {
  const left = tone === 'warm' ? '#DC2626' : '#2563EB';
  const right = tone === 'warm' ? '#111827' : '#0F172A';
  const accent = tone === 'warm' ? '#FDBA74' : '#A5F3FC';

  return (
    <svg viewBox="0 0 150 120" className="h-[92px] w-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47 20L39 28L25 33V102H73V33L59 28L51 20H47Z" fill={left} opacity="0.96" />
      <path d="M54 20L63 28L76 33V102H125V33L111 28L103 20H54Z" fill={right} opacity="0.96" />
      <path d="M34 53H64M89 53H117" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M42 20H56M94 20H109" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
    </svg>
  );
}

function FormatTilesArt() {
  const tiles = [
    { x: 0, y: 0, label: 'SVG' },
    { x: 38, y: 0, label: 'PNG' },
    { x: 76, y: 0, label: 'JPG' },
    { x: 19, y: 38, label: 'PDF' },
    { x: 57, y: 38, label: 'EPS' },
  ];

  return (
    <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {tiles.map((tile, idx) => (
        <g key={idx} transform={`translate(${tile.x + 10} ${tile.y + 16})`}>
          <rect width="30" height="30" rx="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" />
          <text x="15" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
            {tile.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function EditStudioArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="100" height="70" rx="14" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.16)" />
      <rect x="18" y="30" width="40" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="18" y="46" width="56" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="18" y="60" width="34" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
      <path d="M82 35L71 46V77H102V35H82Z" fill="#171f39" stroke="#F9A8D4" strokeWidth="2" />
      <path d="M71 46L82 35" stroke="#F9A8D4" strokeWidth="2" />
      <path d="M83 56L92 47L100 55" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="91" cy="66" r="8" fill="#EC4899" opacity="0.85" />
    </svg>
  );
}

function BackupCloudArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M41 87H81C94 87 103 79 103 67C103 56 96 48 85 47C81 34 72 27 60 27C48 27 39 34 35 46C23 47 14 55 14 67C14 79 23 87 37 87H41Z" fill="rgba(255,255,255,0.12)" stroke="#D6F0FF" strokeWidth="2.5" />
      <path d="M60 75V53" stroke="#D6F0FF" strokeWidth="3" strokeLinecap="round" />
      <path d="M51 61L60 52L69 61" stroke="#D6F0FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 78L82 84L95 71" stroke="#8FE0FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroJerseyRed() {
  return <HeroJersey colorA="#D61F3D" colorB="#F97316" number="07" side="left" />;
}

function HeroJerseyBlue() {
  return <HeroJersey colorA="#ffffff" colorB="#6EC1FF" number="10" centerStripe />;
}

function HeroJerseyPurple() {
  return <HeroJersey colorA="#3B1A75" colorB="#7C3AED" number="18" side="right" />;
}

function HeroJerseyGold() {
  return <HeroJersey colorA="#F5D90A" colorB="#1A8F5C" number="11" side="right" />;
}

function HeroJersey({
  colorA,
  colorB,
  number,
  centerStripe,
  side,
}: {
  colorA: string;
  colorB: string;
  number: string;
  centerStripe?: boolean;
  side?: 'left' | 'right';
}) {
  return (
    <svg viewBox="0 0 230 320" className="h-[230px] w-[150px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] sm:h-[300px] sm:w-[190px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M74 22L54 44L28 52V294H202V52L176 44L156 22H74Z" fill={colorA} stroke="#081120" strokeWidth="5" />
      <path d="M74 22L90 47H140L156 22" fill="#0A1428" stroke="#081120" strokeWidth="5" />
      <path d="M90 47H140" stroke="#A5C7FF" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
      <path d="M54 44L86 65M176 44L144 65" stroke="#E4EFFD" strokeOpacity="0.8" strokeWidth="6" strokeLinecap="round" />
      {centerStripe ? (
        <>
          <rect x="75" y="48" width="26" height="246" fill={colorB} opacity="0.95" />
          <rect x="129" y="48" width="26" height="246" fill={colorB} opacity="0.95" />
        </>
      ) : side === 'left' ? (
        <>
          <rect x="44" y="58" width="26" height="226" fill={colorB} opacity="0.95" />
          <rect x="95" y="58" width="18" height="226" fill="#ffffff" opacity="0.85" />
        </>
      ) : (
        <>
          <rect x="160" y="58" width="26" height="226" fill={colorB} opacity="0.95" />
          <rect x="118" y="58" width="18" height="226" fill="#ffffff" opacity="0.85" />
        </>
      )}
      <path d="M65 80H84" stroke="#D9E8FF" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <circle cx="157" cy="84" r="14" fill="#F6D54A" opacity="0.92" />
      <path d="M157 72L160 80H168L161.5 85L164 93L157 88L150 93L152.5 85L146 80H154L157 72Z" fill="#0E316A" />
      <text x="115" y="170" textAnchor="middle" fontSize="58" fontWeight="800" fill="#0A1428">
        {number}
      </text>
      <path d="M75 22H155" stroke="#D9E8FF" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

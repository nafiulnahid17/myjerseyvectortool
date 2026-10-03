'use client';

import type { MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CircleHelp,
  Coins,
  FileCog,
  FileImage,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Layers3,
  Moon,
  PackageOpen,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Sun,
} from 'lucide-react';
import { useStudioSession } from '@/components/auth/studio-session';
import { JerseyOSControlNav } from '@/components/navigation/jerseyos-control-nav';
import { JerseyToolHighlightCard, type ToolCardModel } from '@/components/dashboard/jersey-tool-highlight-card';

type ToolCategory = 'AI Powered Tools' | 'Elements Tools' | 'Emergency Tools';

type Tool = ToolCardModel & {
  category: ToolCategory;
};

const categoryOrder: ToolCategory[] = [
  'AI Powered Tools',
  'Elements Tools',
  'Emergency Tools',
];

const tools: Tool[] = [
  {
    title: 'AutoPilot',
    href: '/oneclick-creation',
    description: 'One-click AI workflow from upload to editable production output.',
    workflow: ['Input', 'Oneclick', 'Editable SVG / AI File'],
    visual: 'autopilot',
    icon: Sparkles,
    category: 'AI Powered Tools',
  },
  {
    title: 'VectorForge',
    href: '/image-to-vector',
    description: 'Turn jersey inputs into separated production-ready vector panels.',
    workflow: ['Input', 'Vectorize', 'Production Ready'],
    visual: 'vectorforge',
    icon: ImageIcon,
    category: 'AI Powered Tools',
  },
  {
    title: 'VectorLab',
    href: '/edit-existing-file',
    description: 'AI-powered vector editing workspace for jersey artwork.',
    workflow: ['Open', 'Edit', 'AI Assist', 'Export'],
    visual: 'vectorlab',
    icon: SquarePen,
    category: 'AI Powered Tools',
  },
  {
    title: 'Showcase AI',
    href: '/mockup-generator',
    description: 'Transform flat jersey designs into social-ready showcase visuals.',
    workflow: ['Input', 'Generate', 'Social Ready'],
    visual: 'showcase',
    icon: PackageOpen,
    category: 'AI Powered Tools',
  },
  {
    title: 'FrontScan',
    href: '/frontscan',
    description: 'Scan front artwork, typography and measurements with precision.',
    workflow: ['Input', 'Analyze', 'Specs', 'Download'],
    visual: 'frontscan',
    icon: Search,
    category: 'AI Powered Tools',
  },
  {
    title: 'BatchForge',
    href: '/batchforge',
    description: 'Turn order data into multiple production-ready jersey files.',
    workflow: ['Data File', 'Apply Design', 'Bulk Output'],
    visual: 'batchforge',
    icon: Layers3,
    category: 'AI Powered Tools',
  },
  {
    title: 'OrderSheet',
    href: '/ordersheet',
    description: 'Generate organized production sheets with size, name and number data.',
    workflow: ['Order Data', 'Structure', 'Production Sheet'],
    visual: 'ordersheet',
    icon: FileCog,
    category: 'AI Powered Tools',
  },

  {
    title: 'AssetForge',
    href: '/design-elements',
    description: 'Create logos, fonts, patterns and jersey design elements.',
    workflow: ['Prompt', 'Generate', 'Customize', 'Use'],
    visual: 'assetforge',
    icon: Layers3,
    category: 'Elements Tools',
  },
  {
    title: 'DesignVault',
    href: '/templates',
    description: 'Browse and reuse a premium archive of completed jersey designs.',
    workflow: ['Browse', 'Select', 'Reuse'],
    visual: 'designvault',
    icon: FileImage,
    category: 'Elements Tools',
  },
  {
    title: 'ExportPack',
    href: '/exportpack',
    description: 'Export production designs into multiple professional formats.',
    workflow: ['Design', 'Select Formats', 'Export Pack'],
    visual: 'exportpack',
    icon: PackageOpen,
    category: 'Elements Tools',
  },

  {
    title: 'RescueX',
    href: '/backup',
    description: 'Fallback recovery for rebuilding editable production files.',
    workflow: ['Input', 'Fallback Process', 'Editable File'],
    visual: 'rescuex',
    icon: ShieldCheck,
    category: 'Emergency Tools',
  },
  {
    title: 'ConvertX',
    href: '/file-converter',
    description: 'Cleanly convert design file formats for production workflows.',
    workflow: ['Upload', 'Convert', 'Download'],
    visual: 'convertx',
    icon: FileCog,
    category: 'Emergency Tools',
  },
]

export function DashboardShell() {
  const session = useStudioSession();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('mj_dashboard_theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<'dark' | 'light'>).detail;
      if (next === 'dark' || next === 'light') setTheme(next);
    };
    window.addEventListener('jerseyos-theme-change', onThemeChange);
    return () => window.removeEventListener('jerseyos-theme-change', onThemeChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mj_dashboard_theme', theme);
    document.documentElement.dataset.mjTheme = theme;
  }, [theme]);

  const dark = theme === 'dark';
  const groupedTools = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          tools: tools.filter((tool) => tool.category === category),
        }))
        .filter((group) => group.tools.length),
    [],
  );

  function featureClick(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    if (session.canAccessFeatures) return;
    event.preventDefault();
    session.requestAccess(href);
  }

  const pageClass = dark ? 'bg-[#020812] text-white' : 'bg-[#eef4fb] text-[#0a1728]';
  const muted = dark ? 'text-white/55' : 'text-slate-500';

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageClass}`}>
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <JerseyOSControlNav
          dark={dark}
          theme={theme}
          onThemeChange={setTheme}
          onNavigate={featureClick}
        />

        <section className="min-w-0 flex-1">
          <div className="min-h-screen px-3 pb-6 pt-4 sm:px-5 lg:px-6">
            <header className="mb-4 flex min-h-14 items-center justify-start gap-2 pl-14 sm:pl-16">
              <div className="flex flex-wrap items-center justify-start gap-2">
                <div className={`inline-flex rounded-2xl border p-1 ${dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-slate-50'}`}>
                  <button
                    onClick={() => setTheme('light')}
                    className={`grid h-10 w-10 place-items-center rounded-xl transition ${!dark ? 'bg-[#0875ff] text-white shadow-lg' : muted}`}
                    aria-label="Light mode"
                  >
                    <Sun className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`grid h-10 w-10 place-items-center rounded-xl transition ${dark ? 'bg-[#0875ff] text-white shadow-lg' : muted}`}
                    aria-label="Dark mode"
                  >
                    <Moon className="h-5 w-5" />
                  </button>
                </div>

                <div className={`inline-flex h-12 items-center rounded-2xl border p-1 ${
                  dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white'
                }`}>
                  <Globe className={`ml-2 mr-1 h-4 w-4 ${muted}`} />
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`h-9 rounded-xl px-3 text-xs font-bold transition ${
                      language === 'en'
                        ? 'bg-[#0875ff] text-white shadow-lg'
                        : muted
                    }`}
                    aria-label="English"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`h-9 rounded-xl px-3 text-xs font-bold transition ${
                      language === 'bn'
                        ? 'bg-[#0875ff] text-white shadow-lg'
                        : muted
                    }`}
                    aria-label="বাংলা"
                  >
                    বাংলা
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen((open) => !open)}
                    className={`relative grid h-12 w-12 place-items-center rounded-2xl border ${dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white'}`}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  {notificationsOpen ? (
                    <div className={`absolute right-0 top-14 z-30 w-72 rounded-2xl border p-4 shadow-2xl ${dark ? 'border-white/10 bg-[#07111f]' : 'border-slate-200 bg-white'}`}>
                      <div className="font-semibold">Notifications</div>
                      <div className={`mt-2 text-sm ${muted}`}>No notifications yet.</div>
                    </div>
                  ) : null}
                </div>

              </div>
            </header>

            <section
              className="relative mt-5 min-h-[330px] overflow-hidden rounded-[30px] border border-sky-400/15 bg-cover bg-center shadow-[0_24px_80px_rgba(0,0,0,.25)] sm:min-h-[370px]"
              style={{ backgroundImage: "url('/dashboard/hero-stadium.png')" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,8,19,.96)_0%,rgba(2,11,25,.86)_34%,rgba(2,11,25,.30)_64%,rgba(2,11,25,.12)_100%)]" />
              <div className="relative z-10 max-w-[690px] p-7 sm:p-9 lg:p-11">
                <div className="flex flex-wrap items-center gap-5">
                  <img
                    src="/brand/jerseyos-logo.png"
                    alt="JerseyOS"
                    className="h-28 w-28 shrink-0 object-contain sm:h-32 sm:w-32"
                  />
                  <div>
                    <p className="text-xl italic text-white/90">Welcome To</p>
                    <h1 className="mt-1 text-5xl font-black leading-[0.9] tracking-[0.02em] text-white sm:text-6xl lg:text-7xl">
                      JerseyOS
                    </h1>
                  </div>
                </div>
                <div className="mt-5 h-1.5 w-36 rounded-full bg-[linear-gradient(90deg,#d6a42b,#f7df87)]" />
                <p className="mt-5 max-w-[650px] text-base font-semibold leading-7 text-white/88 sm:text-lg">
                  AI-Powered Full Operating System for Jersey Production
                </p>
                <p className="mt-2 text-sm font-medium text-amber-200/80">Owned by My Jersey</p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.17em] text-white/65 sm:text-sm">
                  <span>Upload</span><span className="text-sky-400">â€¢</span>
                  <span>Vectorize</span><span className="text-sky-400">â€¢</span>
                  <span>Customize</span><span className="text-sky-400">â€¢</span>
                  <span>Preview</span><span className="text-sky-400">â€¢</span>
                  <span>Download</span>
                </div>
                <a
                  href="/new-project"
                  onClick={(event) => featureClick(event, '/new-project')}
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(90deg,#0875ff,#1babff)] px-6 py-4 font-bold text-white shadow-[0_18px_35px_rgba(8,117,255,.30)]"
                >
                  <Plus className="h-5 w-5" /> New Project
                </a>
              </div>
            </section>

            <section className="mt-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Tools</h2>
                </div>
                <a href="/tools" onClick={(event) => featureClick(event, '/tools')} className="text-sm font-semibold text-sky-500">View All â†’</a>
              </div>

              <div className="space-y-7">
                {groupedTools.map((group) => (
                  <div key={group.category}>
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-lg font-black">{group.category}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${dark ? 'bg-white/[0.05] text-white/45' : 'bg-slate-100 text-slate-500'}`}>
                        {group.tools.length}
                      </span>
                    </div>
                    <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {group.tools.map((tool, toolIndex) => (
                        <JerseyToolHighlightCard
                          key={tool.href}
                          tool={tool}
                          index={toolIndex}
                          onOpen={featureClick}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black">Recent Projects</h2>
                <a href="/projects" onClick={(event) => featureClick(event, '/projects')} className="text-sm font-semibold text-sky-500">View All â†’</a>
              </div>
              <div className={`rounded-[28px] border border-dashed p-8 text-center ${dark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'}`}>
                <FolderOpen className="mx-auto h-10 w-10 text-sky-500" />
                <h3 className="mt-4 text-xl font-bold">No projects yet</h3>
                <p className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${muted}`}>
                  Your saved projects will appear here after you create or import your first design.
                </p>
                <a
                  href="/new-project"
                  onClick={(event) => featureClick(event, '/new-project')}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0875ff] px-5 py-3 text-sm font-bold text-white"
                >
                  <Plus className="h-4 w-4" /> Create First Project
                </a>
              </div>
            </section>

            <footer className={`mt-7 border-t pt-5 text-center text-xs ${dark ? 'border-white/8 text-white/35' : 'border-slate-200 text-slate-400'}`}>
              Copyright 2027- 2028 @ My Jersey
            </footer>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes jerseyosToolFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .jerseyos-tool-card {
          animation: jerseyosToolFloat 6.4s ease-in-out infinite;
        }
        .jerseyos-tool-card:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .jerseyos-tool-card { animation: none; }
        }
      `}</style>
    </main>
  );
}

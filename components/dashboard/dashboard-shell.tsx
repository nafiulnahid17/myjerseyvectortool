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
    title: 'VectorForge',
    href: '/image-to-vector',
    description: 'Turn jersey inputs into separated production-ready vector panels.',
    workflow: ['Input', 'Vectorize', 'Production Ready'],
    visual: 'vectorforge',
    icon: ImageIcon,
    category: 'AI Powered Tools',
  },
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
    title: 'ConvertX',
    href: '/file-converter',
    description: 'Cleanly convert design file formats for production workflows.',
    workflow: ['Upload', 'Convert', 'Download'],
    visual: 'convertx',
    icon: FileCog,
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
    title: 'TraceDesk',
    href: '/manual-vector-tracing',
    description: 'Manual vector tracing for precise production artwork cleanup.',
    workflow: ['Open', 'Trace', 'Refine', 'Export'],
    visual: 'tracedesk',
    icon: SquarePen,
    category: 'Emergency Tools',
  },
  {
    title: 'ColorDesk',
    href: '/colour-editor',
    description: 'Manual color, fill, stroke and palette control for jersey artwork.',
    workflow: ['Open', 'Edit Colors', 'Review', 'Save'],
    visual: 'colordesk',
    icon: Layers3,
    category: 'Emergency Tools',
  },
  {
    title: 'CutPrep',
    href: '/manual-production-cut-setup',
    description: 'Manual production panel placement, cut lines and layout setup.',
    workflow: ['Open', 'Arrange Panels', 'Set Cuts', 'Prepare'],
    visual: 'cutprep',
    icon: FileImage,
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

            <section className="relative mt-5 overflow-hidden rounded-[30px] border border-sky-400/15 bg-[#031126] shadow-[0_24px_80px_rgba(0,0,0,.28)]">
              <img
                src="/dashboard/hero-jerseyos-suite.webp"
                alt="JerseyOS AI-powered jersey production operating system"
                className="block aspect-[12/5] w-full object-cover object-center"
              />

              <a
                href="/tools"
                onClick={(event) => featureClick(event, '/tools')}
                aria-label="Explore JerseyOS tools and feel the power"
                title="Explore → Feel The Power"
                className="absolute left-[1.2%] top-[68%] h-[11.5%] w-[22.5%] rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/80"
              >
                <span className="sr-only">Explore → Feel The Power</span>
              </a>
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

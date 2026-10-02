'use client';

import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CircleHelp,
  Cloud,
  Coins,
  Crown,
  FileCog,
  FileImage,
  FolderOpen,
  Globe,
  Home,
  Info,
  Image as ImageIcon,
  Layers3,
  Menu,
  Moon,
  PackageOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Sun,
  X,
} from 'lucide-react';
import { useStudioSession } from '@/components/auth/studio-session';
import { JerseyOSControlNav } from '@/components/navigation/jerseyos-control-nav';

type ToolCategory = 'AI Powered Tools' | 'Elements Tools' | 'Emergency Tools';

type Tool = {
  title: string;
  href: string;
  image: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  category: ToolCategory;
};

const categoryOrder: ToolCategory[] = [
  'AI Powered Tools',
  'Elements Tools',
  'Emergency Tools',
];

const tools: Tool[] = [
  { title: 'VectorForge', href: '/image-to-vector', image: '/dashboard/tools/image-to-vector.png', keywords: 'vectorforge image to vector vector image jersey production', icon: ImageIcon, category: 'AI Powered Tools' },
  { title: 'AutoPilot', href: '/oneclick-creation', image: '/dashboard/tools/oneclick-creation.png', keywords: 'autopilot oneclick creation automatic one click layout', icon: Sparkles, category: 'AI Powered Tools' },
  { title: 'VectorLab', href: '/edit-existing-file', image: '/dashboard/tools/edit-existing-file.png', keywords: 'vectorlab edit existing file edit modify customize', icon: SquarePen, category: 'AI Powered Tools' },
  { title: 'Showcase AI', href: '/mockup-generator', image: '/dashboard/tools/mockup-generator.png', keywords: 'showcase ai mockup generator 2d 3d mockup preview', icon: PackageOpen, category: 'AI Powered Tools' },
  { title: 'FrontScan', href: '/frontscan', image: '/dashboard/tools/frontscan.svg', keywords: 'frontscan front ocr typography font analysis artwork', icon: Search, category: 'AI Powered Tools' },
  { title: 'BatchForge', href: '/batchforge', image: '/dashboard/tools/batchforge.svg', keywords: 'batchforge bulk production names numbers quantity list', icon: Layers3, category: 'AI Powered Tools' },
  { title: 'OrderSheet', href: '/ordersheet', image: '/dashboard/tools/ordersheet.svg', keywords: 'ordersheet order sheet generator production list quantity sizes names', icon: FileCog, category: 'AI Powered Tools' },

  { title: 'AssetForge', href: '/design-elements', image: '/dashboard/tools/design-elements.png', keywords: 'assetforge design elements logos fonts shapes patterns', icon: Layers3, category: 'Elements Tools' },
  { title: 'DesignVault', href: '/templates', image: '/dashboard/tools/templates.png', keywords: 'designvault templates ready made jersey templates', icon: FileImage, category: 'Elements Tools' },
  { title: 'ConvertX', href: '/file-converter', image: '/dashboard/tools/file-converter.png', keywords: 'convertx file converter svg png pdf ai eps jpg convert', icon: FileCog, category: 'Elements Tools' },
  { title: 'ExportPack', href: '/exportpack', image: '/dashboard/tools/exportpack.svg', keywords: 'exportpack export system package svg ai eps pdf png production files', icon: PackageOpen, category: 'Elements Tools' },

  { title: 'RescueX', href: '/backup', image: '/dashboard/tools/fallback-backup.png', keywords: 'rescuex fallback setup backup restore cloud recover', icon: ShieldCheck, category: 'Emergency Tools' },
  { title: 'TraceDesk', href: '/manual-vector-tracing', image: '/dashboard/tools/manual-vector-tracing.svg', keywords: 'tracedesk manual vector tracing trace pen bezier paths nodes artwork', icon: SquarePen, category: 'Emergency Tools' },
  { title: 'ColorDesk', href: '/colour-editor', image: '/dashboard/tools/colour-editor.svg', keywords: 'colordesk colour editor color palette recolor fill stroke jersey', icon: Layers3, category: 'Emergency Tools' },
  { title: 'CutPrep', href: '/manual-production-cut-setup', image: '/dashboard/tools/manual-production-cut-setup.svg', keywords: 'cutprep manual production cut setup panels sublimation cut lines layout', icon: FileImage, category: 'Emergency Tools' },
]

const sidebarPrimary = [
  { label: 'Dashboard', href: '/', icon: Home, public: true },
  { label: 'New Project', href: '/new-project', icon: Plus },
  { label: 'VectorForge', href: '/image-to-vector', icon: ImageIcon },
  { label: 'AutoPilot', href: '/oneclick-creation', icon: Sparkles },
  { label: 'VectorLab', href: '/edit-existing-file', icon: SquarePen },
]

const sidebarSecondary = [
  { label: 'Showcase AI', href: '/mockup-generator', icon: PackageOpen },
  { label: 'FrontScan', href: '/frontscan', icon: Search },
  { label: 'BatchForge', href: '/batchforge', icon: Layers3 },
  { label: 'OrderSheet', href: '/ordersheet', icon: FileCog },
  { label: 'AssetForge', href: '/design-elements', icon: Layers3 },
  { label: 'DesignVault', href: '/templates', icon: FileImage },
  { label: 'ConvertX', href: '/file-converter', icon: FileCog },
  { label: 'ExportPack', href: '/exportpack', icon: PackageOpen },
  { label: 'RescueX', href: '/backup', icon: ShieldCheck },
  { label: 'TraceDesk', href: '/manual-vector-tracing', icon: SquarePen },
  { label: 'ColorDesk', href: '/colour-editor', icon: Layers3 },
  { label: 'CutPrep', href: '/manual-production-cut-setup', icon: FileImage },
  { label: 'Topup AI Credits', href: '/topup-ai-credits', icon: Coins },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },
  { label: 'About Us', href: '/about-us', icon: Info },
]

export function DashboardShell() {
  const session = useStudioSession();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                      {group.tools.map((tool) => (
                        <a
                          key={tool.href}
                          href={tool.href}
                          onClick={(event) => featureClick(event, tool.href)}
                          className={`group overflow-hidden rounded-[26px] border transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(0,0,0,.24)] ${
                            dark ? 'border-white/10 bg-[#07111f]' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <img src={tool.image} alt={tool.title} className="aspect-square w-full object-cover" />
                          <div className="border-t border-white/8 px-4 py-3">
                            <div className="font-bold">{tool.title}</div>
                            <div className={`mt-1 text-xs ${muted}`}>{tool.category}</div>
                          </div>
                        </a>
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

      {menuOpen ? (
        <div className="fixed inset-0 z-[90] bg-[#020812]/82 backdrop-blur-xl xl:hidden">
          <div className="h-full max-w-[390px] shadow-[25px_0_80px_rgba(0,0,0,.45)]">
            <JerseyOSControlNav
              dark={dark}
              drawer
              theme={theme}
              onThemeChange={setTheme}
              onClose={() => setMenuOpen(false)}
              onNavigate={featureClick}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Brand({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <img
        src="/brand/jerseyos-logo.png"
        alt="JerseyOS"
        className="h-16 w-16 shrink-0 object-contain"
      />
      <div className="min-w-0">
        <div className="text-xl font-black leading-none tracking-wide">JerseyOS</div>
        <div className={`mt-1 max-w-[165px] text-[9px] font-semibold uppercase leading-4 tracking-[0.08em] ${dark ? 'text-amber-200/70' : 'text-amber-700'}`}>
          AI-Powered Jersey Production OS
        </div>
      </div>
    </div>
  );
}

function NavItem({
  label,
  href,
  icon: Icon,
  active,
  public: isPublic,
  dark,
  onFeatureClick,
}: {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  public?: boolean;
  dark: boolean;
  onFeatureClick: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <a
      href={href}
      onClick={isPublic ? undefined : (event) => onFeatureClick(event, href)}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
        active
          ? 'border-sky-400/35 bg-[linear-gradient(90deg,rgba(8,117,255,.65),rgba(8,62,126,.48))] text-white'
          : dark
            ? 'border-transparent text-white/75 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
            : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
      }`}
    >
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${dark ? 'bg-white/[0.04]' : 'bg-slate-100'}`}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      {label}
    </a>
  );
}

function HamburgerMenu({
  dark,
  displayName,
  displayRole,
  initials,
  authenticated,
  profileReady,
  onClose,
  onFeatureClick,
  onLogin,
  onCompleteProfile,
  onLogout,
}: {
  dark: boolean;
  displayName: string;
  displayRole: string;
  initials: string;
  authenticated: boolean;
  profileReady: boolean;
  onClose: () => void;
  onFeatureClick: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
  onLogin: () => void;
  onCompleteProfile: () => void;
  onLogout: () => void;
}) {
  const panel = dark ? 'border-white/12 bg-[#05111f]/96 text-white' : 'border-slate-200 bg-white/96 text-slate-950';
  const muted = dark ? 'text-white/55' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#020812]/86 p-3 backdrop-blur-xl sm:p-5 lg:p-7">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/dashboard/hero-stadium.png')" }}
      />
      <div className="relative mx-auto max-w-[1450px]">
        <div className="mb-4 flex items-center justify-between">
          <Brand dark />
          <button onClick={onClose} className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30 text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.8fr]">
          <section className={`rounded-[28px] border p-5 shadow-[0_30px_100px_rgba(0,0,0,.32)] ${panel}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Menu</h2>
              <Menu className="h-5 w-5 text-sky-400" />
            </div>
            <div className="space-y-1.5">
              <a href="/" className="flex items-center gap-3 rounded-2xl bg-[#0875ff] px-4 py-3 font-semibold text-white">
                <Home className="h-5 w-5" /> Home
              </a>
              {[
                ['Tools', '/tools', Layers3],
                ['My Library', '/projects', ImageIcon],
                ['File Manager', '/projects', FolderOpen],
                ['Cloud Storage', '/backup', Cloud],
                ['Credit Balance', '/credit-balance', Coins],
                ['Topup AI Credits', '/topup-ai-credits', Plus],
                ['Help & Support', '/help-support', CircleHelp],
                ['About Us', '/about-us', Info],
              ].map(([label, href, Icon]) => {
                const TypedIcon = Icon as ComponentType<{ className?: string }>;
                return (
                  <a
                    key={String(label)}
                    href={String(href)}
                    onClick={(event) => onFeatureClick(event, String(href))}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-sky-500/10 ${muted}`}
                  >
                    <TypedIcon className="h-5 w-5" />
                    <span className="flex-1">{String(label)}</span>
                    <span>â€º</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className={`rounded-[28px] border p-5 shadow-[0_30px_100px_rgba(0,0,0,.32)] ${panel}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Tools</h2>
              <span className="text-sm text-sky-400">Studio</span>
            </div>
            <div className="space-y-5">
              {categoryOrder.map((category) => (
                <div key={category}>
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-sky-400">
                    {category}
                  </div>
                  <div className="space-y-2">
                    {tools.filter((tool) => tool.category === category).map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <a
                          key={tool.href}
                          href={tool.href}
                          onClick={(event) => onFeatureClick(event, tool.href)}
                          className={`flex items-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                            dark ? 'border-white/8 bg-white/[0.035] hover:border-sky-400/25' : 'border-slate-200 bg-slate-50 hover:border-sky-300'
                          }`}
                        >
                          <img src={tool.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold">{tool.title}</div>
                            <div className={`mt-1 text-xs ${muted}`}>Open {category}</div>
                          </div>
                          <Icon className="h-5 w-5 text-sky-400" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`h-fit rounded-[28px] border p-5 shadow-[0_30px_100px_rgba(0,0,0,.32)] ${panel}`}>
            <div className="flex items-center gap-4 rounded-2xl border border-sky-400/15 bg-sky-500/[0.06] p-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#164d90,#0b8dff)] text-xl font-bold text-white">{initials}</span>
              <div className="min-w-0">
                <div className="truncate text-xl font-bold">{displayName}</div>
                <div className={`mt-1 truncate text-sm ${muted}`}>{displayRole}</div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {authenticated ? (
                <>
                  {!profileReady ? (
                    <button onClick={onCompleteProfile} className="flex w-full items-center gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-left font-semibold text-sky-300">
                      <UserRound className="h-5 w-5" /> Complete Profile
                    </button>
                  ) : (
                    <a href="/settings" onClick={(event) => onFeatureClick(event, '/settings')} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                      <UserRound className="h-5 w-5" /> My Profile
                    </a>
                  )}
                  <a href="/projects" onClick={(event) => onFeatureClick(event, '/projects')} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <FolderOpen className="h-5 w-5" /> My Projects
                  </a>
                  <a href="/backup" onClick={(event) => onFeatureClick(event, '/backup')} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <Cloud className="h-5 w-5" /> Cloud / Backup
                  </a>
                  <button onClick={onLogout} className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-left font-semibold text-red-300">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <button onClick={onLogin} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0875ff] px-4 py-3 font-bold text-white">
                  <LogIn className="h-5 w-5" /> Login
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


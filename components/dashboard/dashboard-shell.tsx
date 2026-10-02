'use client';

import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  ChevronDown,
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
  LogIn,
  LogOut,
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
  UserRound,
  X,
} from 'lucide-react';
import { useStudioSession } from '@/components/auth/studio-session';

type Tool = {
  title: string;
  href: string;
  image: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
};

const tools: Tool[] = [
  { title: 'Image to Vector', href: '/image-to-vector', image: '/dashboard/tools/image-to-vector.png', keywords: 'vector image jersey production', icon: ImageIcon },
  { title: 'Oneclick Creation', href: '/oneclick-creation', image: '/dashboard/tools/oneclick-creation.png', keywords: 'automatic one click layout', icon: Sparkles },
  { title: 'File Converter', href: '/file-converter', image: '/dashboard/tools/file-converter.png', keywords: 'svg png pdf ai eps jpg convert', icon: FileCog },
  { title: 'Edit Existing File', href: '/edit-existing-file', image: '/dashboard/tools/edit-existing-file.png', keywords: 'edit modify customize', icon: SquarePen },
  { title: 'Fallback Backup', href: '/backup', image: '/dashboard/tools/fallback-backup.png', keywords: 'backup restore cloud recover', icon: ShieldCheck },
  { title: 'Mockup Generator', href: '/mockup-generator', image: '/dashboard/tools/mockup-generator.png', keywords: '2d 3d mockup preview', icon: PackageOpen },
  { title: 'Templates', href: '/templates', image: '/dashboard/tools/templates.png', keywords: 'ready made jersey templates', icon: FileImage },
  { title: 'Design Elements', href: '/design-elements', image: '/dashboard/tools/design-elements.png', keywords: 'logos fonts shapes patterns', icon: Layers3 },
  { title: 'FrontScan', href: '/frontscan', image: '/dashboard/tools/frontscan.svg', keywords: 'front scan ocr typography font analysis artwork', icon: Search },
  { title: 'BatchForge', href: '/batchforge', image: '/dashboard/tools/batchforge.svg', keywords: 'batch bulk production names numbers quantity list', icon: Layers3 },
  { title: 'ExportPack', href: '/exportpack', image: '/dashboard/tools/exportpack.svg', keywords: 'export package svg ai eps pdf png production files', icon: PackageOpen },
  { title: 'OrderSheet', href: '/ordersheet', image: '/dashboard/tools/ordersheet.svg', keywords: 'order sheet production list quantity sizes names', icon: FileCog },
  { title: 'Manual Vector Tracing', href: '/manual-vector-tracing', image: '/dashboard/tools/manual-vector-tracing.svg', keywords: 'manual vector trace pen bezier paths nodes artwork', icon: SquarePen },
  { title: 'Colour Editor', href: '/colour-editor', image: '/dashboard/tools/colour-editor.svg', keywords: 'colour color palette recolor fill stroke jersey', icon: Layers3 },
  { title: 'Manual Production / Cut Setup', href: '/manual-production-cut-setup', image: '/dashboard/tools/manual-production-cut-setup.svg', keywords: 'manual production cut setup panels sublimation cut lines layout', icon: FileImage },
];

const sidebarPrimary = [
  { label: 'Dashboard', href: '/', icon: Home, public: true },
  { label: 'New Project', href: '/new-project', icon: Plus },
  { label: 'Image to Vector', href: '/image-to-vector', icon: ImageIcon },
  { label: 'Oneclick Creation', href: '/oneclick-creation', icon: Sparkles },
  { label: 'File Converter', href: '/file-converter', icon: FileCog },
  { label: 'Edit Existing File', href: '/edit-existing-file', icon: SquarePen },
];

const sidebarSecondary = [
  { label: 'Mockup Generator', href: '/mockup-generator', icon: PackageOpen },
  { label: 'Design Elements', href: '/design-elements', icon: Layers3 },
  { label: 'FrontScan', href: '/frontscan', icon: Search },
  { label: 'BatchForge', href: '/batchforge', icon: Layers3 },
  { label: 'ExportPack', href: '/exportpack', icon: PackageOpen },
  { label: 'OrderSheet', href: '/ordersheet', icon: FileCog },
  { label: 'Manual Vector Tracing', href: '/manual-vector-tracing', icon: SquarePen },
  { label: 'Colour Editor', href: '/colour-editor', icon: Layers3 },
  { label: 'Manual Production / Cut Setup', href: '/manual-production-cut-setup', icon: FileImage },
  { label: 'Topup AI Credits', href: '/topup-ai-credits', icon: Coins },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },
  { label: 'About Us', href: '/about-us', icon: Info },
];

export function DashboardShell() {
  const session = useStudioSession();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('mj_dashboard_theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mj_dashboard_theme', theme);
    document.documentElement.dataset.mjTheme = theme;
  }, [theme]);

  const dark = theme === 'dark';
  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((tool) => `${tool.title} ${tool.keywords}`.toLowerCase().includes(q));
  }, [query]);

  const displayName = session.profile?.fullName || (session.authenticated ? 'masteradmin' : 'Guest');
  const displayRole = session.profile?.role || (session.authenticated ? 'Profile setup' : 'Not signed in');
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'MJ';

  function featureClick(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    if (session.canAccessFeatures) return;
    event.preventDefault();
    session.requestAccess(href);
  }

  const pageClass = dark ? 'bg-[#020812] text-white' : 'bg-[#eef4fb] text-[#0a1728]';
  const shellClass = dark ? 'border-white/10 bg-[#030b17]/96' : 'border-slate-200 bg-white/94';
  const sideClass = dark ? 'border-white/10 bg-[linear-gradient(180deg,#030a13,#020711)]' : 'border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f5f8fc)]';
  const muted = dark ? 'text-white/55' : 'text-slate-500';

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageClass}`}>
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <aside className={`hidden w-[286px] shrink-0 border-r p-5 xl:block ${sideClass}`}>
          <Brand dark={dark} />
          <nav className="mt-7 space-y-1.5">
            {sidebarPrimary.map((item) => (
              <NavItem key={item.label} {...item} active={item.href === '/'} dark={dark} onFeatureClick={featureClick} />
            ))}
          </nav>
          <div className={`my-5 h-px ${dark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <nav className="space-y-1.5">
            {sidebarSecondary.map((item) => (
              <NavItem key={item.label} {...item} dark={dark} onFeatureClick={featureClick} />
            ))}
          </nav>

          <a
            href="/upgrade"
            onClick={(event) => featureClick(event, '/upgrade')}
            className={`mt-7 block rounded-[22px] border p-4 transition hover:-translate-y-0.5 ${
              dark
                ? 'border-amber-400/30 bg-[linear-gradient(180deg,rgba(110,67,4,.30),rgba(65,41,4,.18))]'
                : 'border-amber-300 bg-amber-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-6 w-6 text-amber-400" />
              <div>
                <div className="font-bold">Upgrade to Pro</div>
                <div className={`mt-1 text-sm leading-5 ${muted}`}>Premium export and workflow options.</div>
              </div>
            </div>
          </a>
        </aside>

        <section className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">
          <div className={`min-h-[calc(100vh-24px)] rounded-[30px] border p-4 shadow-[0_28px_100px_rgba(0,0,0,.16)] sm:p-5 lg:p-6 ${shellClass}`}>
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  onClick={() => setMenuOpen(true)}
                  className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl border transition hover:-translate-y-0.5 ${
                    dark ? 'border-sky-400/25 bg-[#07172b] text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-600'
                  }`}
                  aria-label="Open hamburger menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="relative w-full max-w-[580px]">
                  <Search className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${muted}`} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search tools, projects, templates..."
                    className={`h-13 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none transition focus:border-sky-400/50 ${
                      dark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/35' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
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

                <div className="relative">
                  <button
                    onClick={() => setLanguageOpen((open) => !open)}
                    className={`inline-flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold ${
                      dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Globe className="h-4 w-4" /> English <ChevronDown className="h-4 w-4" />
                  </button>
                  {languageOpen ? (
                    <div className={`absolute right-0 top-14 z-30 w-44 rounded-2xl border p-2 shadow-2xl ${dark ? 'border-white/10 bg-[#07111f]' : 'border-slate-200 bg-white'}`}>
                      <button onClick={() => setLanguageOpen(false)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-sky-500/10">English</button>
                      <button onClick={() => setLanguageOpen(false)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-sky-500/10">à¦¬à¦¾à¦‚à¦²à¦¾</button>
                    </div>
                  ) : null}
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

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((open) => !open)}
                    className={`flex h-12 items-center gap-3 rounded-2xl border px-2.5 pr-3 ${
                      dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#164d90,#0b8dff)] text-sm font-bold text-white">{initials}</span>
                    <span className="hidden text-left sm:block">
                      <span className="block max-w-[145px] truncate text-sm font-semibold">{displayName}</span>
                      <span className={`block max-w-[145px] truncate text-[11px] ${muted}`}>{displayRole}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </button>
                  {profileOpen ? (
                    <div className={`absolute right-0 top-14 z-30 w-64 rounded-2xl border p-2 shadow-2xl ${dark ? 'border-white/10 bg-[#07111f]' : 'border-slate-200 bg-white'}`}>
                      {session.authenticated ? (
                        <>
                          {!session.profile ? (
                            <button onClick={() => session.openProfile()} className="w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sky-500/10">
                              Complete profile
                            </button>
                          ) : null}
                          <button onClick={() => void session.logout()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10">
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </>
                      ) : (
                        <button onClick={() => session.openLogin()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sky-500/10">
                          <LogIn className="h-4 w-4" /> Login
                        </button>
                      )}
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
                <p className="text-xl italic text-white/90">Welcome To</p>
                <h1 className="mt-1 text-5xl font-black uppercase leading-[0.9] tracking-[0.03em] text-white sm:text-6xl lg:text-7xl">
                  My Jersey
                  <span className="mt-2 block bg-[linear-gradient(90deg,#e8f3ff,#2f91ff,#53c4ff)] bg-clip-text text-transparent">Studio</span>
                </h1>
                <div className="mt-5 h-1.5 w-36 rounded-full bg-[linear-gradient(90deg,#1ec8ff,#1977ff)]" />
                <p className="mt-5 max-w-[610px] text-base leading-7 text-white/82 sm:text-lg">
                  Turn any jersey into a production-ready design â€” upload, vectorize, customize, preview, and download.
                </p>
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
                  {query ? <p className={`mt-1 text-sm ${muted}`}>{filteredTools.length} matching tool{filteredTools.length === 1 ? '' : 's'}</p> : null}
                </div>
                <a href="/tools" onClick={(event) => featureClick(event, '/tools')} className="text-sm font-semibold text-sky-500">View All â†’</a>
              </div>

              {filteredTools.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                  {filteredTools.map((tool) => (
                    <a
                      key={tool.href}
                      href={tool.href}
                      onClick={(event) => featureClick(event, tool.href)}
                      className={`group overflow-hidden rounded-[26px] border transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(0,0,0,.24)] ${
                        dark ? 'border-white/10 bg-[#07111f]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <img src={tool.image} alt={tool.title} className="aspect-square w-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className={`rounded-[24px] border border-dashed p-9 text-center ${dark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'}`}>
                  <Search className="mx-auto h-8 w-8 text-sky-500" />
                  <div className="mt-3 font-semibold">No matching tools</div>
                  <button onClick={() => setQuery('')} className="mt-2 text-sm text-sky-500">Clear search</button>
                </div>
              )}
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
          </div>
        </section>
      </div>

      {menuOpen ? (
        <HamburgerMenu
          dark={dark}
          displayName={displayName}
          displayRole={displayRole}
          initials={initials}
          authenticated={session.authenticated}
          profileReady={Boolean(session.profile)}
          onClose={() => setMenuOpen(false)}
          onFeatureClick={featureClick}
          onLogin={() => {
            setMenuOpen(false);
            session.openLogin();
          }}
          onCompleteProfile={() => {
            setMenuOpen(false);
            session.openProfile();
          }}
          onLogout={() => void session.logout()}
        />
      ) : null}
    </main>
  );
}

function Brand({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className={`grid h-14 w-14 place-items-center rounded-2xl border text-2xl font-black ${dark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white'}`}>
        <span>M<span className="text-[#0875ff]">J</span></span>
      </div>
      <div>
        <div className="text-lg font-black leading-none tracking-wide">MY JERSEY</div>
        <div className="mt-1 text-xs font-bold tracking-[0.34em] text-[#0875ff]">STUDIO</div>
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
                ['Templates', '/templates', FileImage],
                ['Design Elements', '/design-elements', Layers3],
                ['FrontScan', '/frontscan', Search],
                ['BatchForge', '/batchforge', Layers3],
                ['ExportPack', '/exportpack', PackageOpen],
                ['OrderSheet', '/ordersheet', FileCog],
                ['Manual Vector Tracing', '/manual-vector-tracing', SquarePen],
                ['Colour Editor', '/colour-editor', Layers3],
                ['Manual Production / Cut Setup', '/manual-production-cut-setup', FileImage],
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
            <div className="space-y-2">
              {tools.map((tool) => {
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
                      <div className={`mt-1 text-xs ${muted}`}>Open studio feature</div>
                    </div>
                    <Icon className="h-5 w-5 text-sky-400" />
                  </a>
                );
              })}
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


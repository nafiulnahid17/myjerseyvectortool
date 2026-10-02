'use client';

import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Coins,
  Crown,
  FolderOpen,
  Home,
  Info,
  Layers3,
  LockKeyhole,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

type Leaf = {
  label: string;
  href?: string;
  descriptor?: boolean;
  theme?: 'light' | 'dark' | 'system';
};

type Group = {
  label: string;
  children: Leaf[];
};

type Node = Leaf | Group;

type Section = {
  id: string;
  no: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  tone: 'normal' | 'credit' | 'premium' | 'ai' | 'support' | 'emergency' | 'health';
  children: Node[];
};

const cc = (value: string) => '/control-center/' + value;

const sections: Section[] = [
  {
    id: 'workspace',
    no: '01',
    title: 'MY WORKSPACE',
    icon: Home,
    tone: 'normal',
    children: [
      { label: 'Overview', href: '/' },
      { label: 'My Profile', href: cc('my-workspace/my-profile') },
      {
        label: 'Billing',
        children: [
          { label: 'Payment Cards', href: cc('my-workspace/billing/payment-cards') },
          { label: 'Current Balance', href: '/credit-balance' },
          { label: 'Usage', href: cc('my-workspace/billing/usage') },
          { label: 'Credit History', href: cc('my-workspace/billing/credit-history') },
          { label: 'Invoices', href: cc('my-workspace/billing/invoices') },
        ],
      },
      {
        label: 'Approved Users',
        children: [
          { label: 'User List', href: cc('my-workspace/approved-users/user-list') },
          { label: 'Add User', href: cc('my-workspace/approved-users/add-user') },
          { label: 'Permissions', href: cc('my-workspace/approved-users/permissions') },
        ],
      },
    ],
  },
  {
    id: 'projects',
    no: '02',
    title: 'PROJECTS',
    icon: FolderOpen,
    tone: 'normal',
    children: [
      { label: 'New Project', href: '/new-project' },
      { label: 'Drafts', href: cc('projects/drafts') },
      { label: 'Existing Projects', href: '/projects' },
      { label: 'Recent Projects', href: '/projects' },
      { label: 'Archived', href: cc('projects/archived') },
    ],
  },
  {
    id: 'credits',
    no: '03',
    title: 'TOP UP CREDITS',
    icon: Coins,
    tone: 'credit',
    children: [
      { label: 'Add Credits', href: '/topup-ai-credits' },
      { label: 'Current Credits', href: '/credit-balance' },
      { label: 'Studio Engine Credits', href: cc('credits/studio-engine') },
      { label: 'Agent Credits', href: cc('credits/agent') },
      { label: 'Fallback Credits', href: cc('credits/fallback') },
    ],
  },
  {
    id: 'plans',
    no: '04',
    title: 'CHOOSE PLAN',
    icon: Crown,
    tone: 'premium',
    children: [
      { label: 'Pro', href: cc('plans/pro') },
      { label: 'Max', href: cc('plans/max') },
      { label: 'Monthly', href: cc('plans/monthly') },
      { label: 'Yearly', href: cc('plans/yearly') },
      { label: 'Compare Plans', href: '/upgrade' },
    ],
  },
  {
    id: 'ai-tools',
    no: '05',
    title: 'AI POWERED TOOLS',
    icon: Sparkles,
    tone: 'ai',
    children: [
      { label: 'VectorForge', href: '/image-to-vector' },
      { label: 'AutoPilot', href: '/oneclick-creation' },
      { label: 'VectorLab', href: '/edit-existing-file' },
      { label: 'Showcase AI', href: '/mockup-generator' },
      { label: 'FrontScan', href: '/frontscan' },
      { label: 'BatchForge', href: '/batchforge' },
      { label: 'OrderSheet', href: '/ordersheet' },
    ],
  },
  {
    id: 'elements',
    no: '06',
    title: 'ELEMENTS TOOLS',
    icon: Layers3,
    tone: 'support',
    children: [
      { label: 'AssetForge', href: '/design-elements' },
      { label: 'DesignVault', href: '/templates' },
      { label: 'ExportPack', href: '/exportpack' },
    ],
  },
  {
    id: 'emergency',
    no: '07',
    title: 'EMERGENCY TOOLS',
    icon: ShieldCheck,
    tone: 'emergency',
    children: [
      { label: 'RescueX', href: '/backup' },
      { label: 'ConvertX', href: '/file-converter' },
    ],
  },
  {
    id: 'health',
    no: '08',
    title: 'SYSTEM HEALTH',
    icon: Search,
    tone: 'health',
    children: [
      {
        label: 'Server Health',
        children: [
          { label: 'Service / Tool', descriptor: true },
          { label: 'Status', descriptor: true },
          { label: 'Response Time', descriptor: true },
          { label: 'Result', descriptor: true },
        ],
      },
      {
        label: 'AI Agent Health',
        children: [
          { label: 'Agent / Tool', descriptor: true },
          { label: 'Status', descriptor: true },
          { label: 'Provider', descriptor: true },
          { label: 'Result', descriptor: true },
        ],
      },
      {
        label: 'Studio Health',
        children: [
          { label: 'Tool', descriptor: true },
          { label: 'Status', descriptor: true },
          { label: 'Last Test', descriptor: true },
          { label: 'Result', descriptor: true },
        ],
      },
    ],
  },
  {
    id: 'settings',
    no: '09',
    title: 'SETTINGS',
    icon: Settings,
    tone: 'normal',
    children: [
      {
        label: 'Appearance',
        children: [
          { label: 'Light Theme', theme: 'light', href: cc('settings/appearance/light') },
          { label: 'Dark Theme', theme: 'dark', href: cc('settings/appearance/dark') },
          { label: 'System Theme', theme: 'system', href: cc('settings/appearance/system') },
        ],
      },
      { label: 'Language', href: cc('settings/language') },
      { label: 'Notifications', href: cc('settings/notifications') },
      { label: 'Auto Save', href: cc('settings/auto-save') },
      { label: 'Default Canvas', href: cc('settings/default-canvas') },
      { label: 'Default Export Format', href: cc('settings/default-export-format') },
      { label: 'Measurement Units', href: cc('settings/measurement-units') },
      { label: 'Download Preferences', href: cc('settings/download-preferences') },
      { label: 'Privacy & Security', href: cc('settings/privacy-security') },
    ],
  },
  {
    id: 'upgrade',
    no: '10',
    title: 'UPGRADE CENTER',
    icon: Plus,
    tone: 'premium',
    children: [
      { label: 'Request Upgrade', href: cc('upgrade-center/request-upgrade') },
      { label: 'Creation Model', children: [{ label: 'Upgrade Creation Model', href: cc('upgrade-center/creation-model') }] },
      { label: 'Generation Models', children: [{ label: 'Upgrade Generation Model', href: cc('upgrade-center/generation-model') }] },
      { label: 'Generation Speed', children: [{ label: 'Upgrade Speed', href: cc('upgrade-center/generation-speed') }] },
      { label: 'Output Quality', children: [{ label: 'Upgrade Quality', href: cc('upgrade-center/output-quality') }] },
      { label: 'Custom Upgrade Request', href: cc('upgrade-center/custom-request') },
    ],
  },
  {
    id: 'support',
    no: '11',
    title: 'HELP & SUPPORT',
    icon: CircleHelp,
    tone: 'support',
    children: [
      { label: 'Help Center', href: '/help-support' },
      { label: 'Getting Started', href: cc('support/getting-started') },
      { label: 'Tool Guides', href: cc('support/tool-guides') },
      { label: 'Report a Problem', href: cc('support/report-problem') },
      { label: 'Request a Feature', href: cc('support/request-feature') },
      { label: 'Contact Support', href: cc('support/contact') },
      { label: 'Emergency Support', href: cc('support/emergency') },
    ],
  },
  {
    id: 'about',
    no: '12',
    title: 'ABOUT',
    icon: Info,
    tone: 'normal',
    children: [
      { label: 'About JerseyOS', href: '/about-us' },
      { label: 'Studio Version', href: cc('about/studio-version') },
      { label: "What's New", href: cc('about/whats-new') },
      { label: 'Release Notes', href: cc('about/release-notes') },
      { label: 'System Information', href: cc('about/system-information') },
      { label: 'Terms of Service', href: cc('about/terms') },
      { label: 'Privacy Policy', href: cc('about/privacy') },
      { label: 'Licenses', href: cc('about/licenses') },
    ],
  },
];

function isGroup(node: Node): node is Group {
  return 'children' in node;
}

function join(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function tone(t: Section['tone'], dark: boolean) {
  if (t === 'credit') return dark ? 'border-amber-400/25 bg-amber-400/[0.07] text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-800';
  if (t === 'premium') return dark ? 'border-violet-400/20 bg-violet-400/[0.06] text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-800';
  if (t === 'ai') return dark ? 'border-sky-400/28 bg-sky-500/[0.09] text-sky-100' : 'border-sky-300 bg-sky-50 text-sky-800';
  if (t === 'emergency') return dark ? 'border-orange-400/20 bg-orange-400/[0.06] text-orange-200' : 'border-orange-200 bg-orange-50 text-orange-800';
  if (t === 'health') return dark ? 'border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (t === 'support') return dark ? 'border-cyan-400/16 bg-cyan-400/[0.04] text-cyan-100' : 'border-cyan-200 bg-cyan-50 text-cyan-800';
  return dark ? 'border-white/8 bg-white/[0.025] text-white/80' : 'border-slate-200 bg-white text-slate-700';
}

export function JerseyOSControlNav({
  dark,
  drawer = false,
  onClose,
  onNavigate,
  theme,
  onThemeChange,
}: {
  dark: boolean;
  drawer?: boolean;
  onClose?: () => void;
  onNavigate?: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['workspace', 'ai-tools']));
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const [path, setPath] = useState('/');

  useEffect(() => {
    setPath(window.location.pathname || '/');
    if (!drawer) setCollapsed(window.localStorage.getItem('jerseyos_sidebar_collapsed') === '1');
  }, [drawer]);

  useEffect(() => {
    if (!drawer) window.localStorage.setItem('jerseyos_sidebar_collapsed', collapsed ? '1' : '0');
  }, [collapsed, drawer]);

  useEffect(() => {
    sections.forEach((section) => {
      let sectionMatches = false;

      section.children.forEach((node) => {
        if (isGroup(node)) {
          const childMatches = node.children.some((child) =>
            Boolean(child.href && (path === child.href || (child.href !== '/' && path.startsWith(child.href + '/')))),
          );

          if (childMatches) {
            sectionMatches = true;
            setOpenGroups((current) => new Set(current).add(section.id + ':' + node.label));
          }
        } else if (node.href && (path === node.href || (node.href !== '/' && path.startsWith(node.href + '/')))) {
          sectionMatches = true;
        }
      });

      if (sectionMatches) {
        setOpenSections((current) => new Set(current).add(section.id));
      }
    });
  }, [path]);

  const mini = !drawer && collapsed;
  const shell = drawer
    ? join('h-full w-full', dark ? 'bg-[#030914] text-white' : 'bg-white text-slate-950')
    : join(
        'sticky top-0 hidden h-screen shrink-0 border-r transition-[width] duration-300 xl:flex xl:flex-col',
        mini ? 'w-[88px]' : 'w-[316px]',
        dark
          ? 'border-white/10 bg-[linear-gradient(180deg,#030a13,#020711)] text-white'
          : 'border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f5f8fc)] text-slate-950',
      );

  function toggleSection(id: string) {
    if (mini) {
      setCollapsed(false);
      setOpenSections((current) => new Set(current).add(id));
      return;
    }
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGroup(id: string) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clickLeaf(event: ReactMouseEvent<HTMLAnchorElement>, leaf: Leaf) {
    if (leaf.theme && onThemeChange) {
      event.preventDefault();
      if (leaf.theme === 'system') {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
        onThemeChange(prefersDark ? 'dark' : 'light');
      } else {
        onThemeChange(leaf.theme);
      }
    } else if (leaf.href && onNavigate) {
      onNavigate(event, leaf.href);
    }
    if (drawer) onClose?.();
  }

  function leaf(leafItem: Leaf, key: string, nested = false) {
    if (leafItem.descriptor) {
      return (
        <div key={key} className={join('flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px]', dark ? 'text-white/34' : 'text-slate-400')}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
          <span>{leafItem.label}</span>
        </div>
      );
    }

    const href = leafItem.href || '#';
    const active = Boolean(leafItem.href && (path === leafItem.href || (leafItem.href !== '/' && path.startsWith(leafItem.href + '/'))));
    const themeActive = (leafItem.theme === 'light' && theme === 'light') || (leafItem.theme === 'dark' && theme === 'dark');

    return (
      <a
        key={key}
        href={href}
        title={leafItem.label}
        onClick={(event) => clickLeaf(event, leafItem)}
        className={join(
          'flex items-center gap-2.5 rounded-xl border py-2 text-[13px] transition',
          nested ? 'pl-8 pr-3' : 'px-3',
          active || themeActive
            ? dark ? 'border-sky-400/25 bg-sky-500/12 text-white' : 'border-sky-300 bg-sky-50 text-sky-900'
            : dark ? 'border-transparent text-white/58 hover:border-white/8 hover:bg-white/[0.035] hover:text-white' : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
        )}
      >
        <ChevronRight className={join('h-3.5 w-3.5 shrink-0', active ? 'text-sky-400' : 'opacity-45')} />
        <span className="min-w-0 flex-1 truncate">{leafItem.label}</span>
      </a>
    );
  }

  return (
    <aside className={shell}>
      <div className={join('sticky top-0 z-20 border-b px-3 py-3 backdrop-blur-xl', dark ? 'border-white/8 bg-[#030a13]/95' : 'border-slate-200 bg-white/95')}>
        <div className={join('flex items-center', mini ? 'justify-center' : 'justify-between gap-2')}>
          <a href="/" className={join('flex min-w-0 items-center', mini ? '' : 'gap-3')}>
            <img src="/brand/jerseyos-logo.png" alt="JerseyOS" className={join(mini ? 'h-12 w-12' : 'h-14 w-14', 'shrink-0 object-contain')} />
            {!mini ? (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-lg font-black leading-none">JerseyOS <span>🇧🇩</span></div>
                <div className={join('mt-1 max-w-[185px] text-[9px] font-semibold uppercase leading-4 tracking-[0.08em]', dark ? 'text-amber-200/65' : 'text-amber-700')}>
                  AI-Powered Full Operating System for Jersey Production
                </div>
              </div>
            ) : null}
          </a>

          {drawer ? (
            <button type="button" onClick={onClose} className={join('grid h-10 w-10 place-items-center rounded-xl border', dark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50')} aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
          ) : !mini ? (
            <button type="button" onClick={() => setCollapsed(true)} className={join('grid h-9 w-9 place-items-center rounded-xl border', dark ? 'border-white/10 bg-white/[0.03] text-white/60' : 'border-slate-200 bg-slate-50 text-slate-500')} title="Collapse sidebar" aria-label="Collapse sidebar">
              <PanelLeftClose className="h-4.5 w-4.5" />
            </button>
          ) : null}
        </div>

        {mini ? (
          <button type="button" onClick={() => setCollapsed(false)} className={join('mx-auto mt-2 grid h-9 w-9 place-items-center rounded-xl border', dark ? 'border-white/10 bg-white/[0.03] text-white/60' : 'border-slate-200 bg-slate-50 text-slate-500')} title="Expand sidebar" aria-label="Expand sidebar">
            <PanelLeftOpen className="h-4.5 w-4.5" />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const open = openSections.has(section.id);
            return (
              <section key={section.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  title={mini ? section.no + '. ' + section.title : undefined}
                  className={join('flex w-full items-center rounded-2xl border transition', tone(section.tone, dark), mini ? 'h-12 justify-center' : 'gap-3 px-3 py-2.5')}
                >
                  <span className={join('grid shrink-0 place-items-center rounded-xl', mini ? 'h-9 w-9' : 'h-8 w-8', dark ? 'bg-white/[0.045]' : 'bg-white/70')}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {!mini ? (
                    <>
                      <span className="w-7 shrink-0 text-[10px] font-black tracking-[0.12em] opacity-55">{section.no}.</span>
                      <span className="min-w-0 flex-1 truncate text-left text-[11px] font-black tracking-[0.08em]">{section.title}</span>
                      <ChevronDown className={join('h-4 w-4 shrink-0 transition-transform duration-200', open ? 'rotate-180' : '')} />
                    </>
                  ) : null}
                </button>

                {!mini ? (
                  <div className={join('grid transition-[grid-template-rows,opacity] duration-200', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                    <div className="overflow-hidden">
                      <div className={join('ml-4 mt-1.5 space-y-1 border-l pl-2.5', dark ? 'border-white/8' : 'border-slate-200')}>
                        {section.children.map((node, index) => {
                          const key = section.id + '-' + String(index);
                          if (!isGroup(node)) return leaf(node, key);

                          const groupKey = section.id + ':' + node.label;
                          const groupOpen = openGroups.has(groupKey);
                          return (
                            <div key={groupKey}>
                              <button
                                type="button"
                                onClick={() => toggleGroup(groupKey)}
                                className={join('flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition', dark ? 'text-white/68 hover:bg-white/[0.035] hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950')}
                              >
                                <ChevronRight className={join('h-3.5 w-3.5 transition-transform', groupOpen ? 'rotate-90' : '')} />
                                <span className="min-w-0 flex-1 truncate">{node.label}</span>
                              </button>
                              <div className={join('grid transition-[grid-template-rows,opacity] duration-200', groupOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                                <div className="overflow-hidden">
                                  <div className="space-y-0.5 pb-1">
                                    {node.children.map((child, childIndex) => leaf(child, groupKey + '-' + String(childIndex), true))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })}
        </nav>
      </div>

      <div className={join('sticky bottom-0 z-20 border-t p-3 backdrop-blur-xl', dark ? 'border-white/8 bg-[#020711]/96' : 'border-slate-200 bg-white/96')}>
        {mini ? (
          <div title="It's a Product of Multiverse X — Don't Try to Replicate Any Tool or Design — Contact Developer for Your Version." className={join('mx-auto grid h-11 w-11 place-items-center rounded-xl border', dark ? 'border-red-400/20 bg-red-500/8 text-red-300' : 'border-red-200 bg-red-50 text-red-600')}>
            <LockKeyhole className="h-5 w-5" />
          </div>
        ) : (
          <div className={join('overflow-hidden rounded-2xl border', dark ? 'border-amber-400/20 bg-[linear-gradient(180deg,rgba(110,67,4,.18),rgba(90,16,16,.12))]' : 'border-amber-300 bg-amber-50')}>
            <div className="h-1 bg-[linear-gradient(90deg,#d6a42b,#f8df84,#d94848)]" />
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs font-black"><ShieldCheck className="h-4 w-4 text-amber-400" /><span>Multiverse X</span></div>
              <p className={join('mt-2 text-[10px] font-semibold leading-4', dark ? 'text-white/58' : 'text-slate-600')}>It's a Product of Multiverse X</p>
              <p className="mt-1 text-[10px] font-black leading-4 text-red-400">Don't Try to Replicate Any Tool or Design</p>
              <p className={join('mt-1 text-[10px] leading-4', dark ? 'text-white/40' : 'text-slate-500')}>Contact Developer for Your Version</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

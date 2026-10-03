'use client';

import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Coins,
  Crown,
  FolderKanban,
  FolderOpen,
  Grid2X2,
  Info,
  LockKeyhole,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
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
  children: Node[];
};

const cc = (value: string) => '/control-center/' + value;

const sections: Section[] = [
  {
    id: 'workspace',
    no: '01',
    title: 'MY WORKSPACE',
    icon: FolderOpen,
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
    icon: FolderKanban,
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
    icon: Grid2X2,
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
    children: [
      { label: 'RescueX', href: '/backup' },
      { label: 'ConvertX', href: '/file-converter' },
    ],
  },
  {
    id: 'health',
    no: '08',
    title: 'SYSTEM HEALTH',
    icon: Activity,
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
    icon: Rocket,
    children: [
      { label: 'Request Upgrade', href: cc('upgrade-center/request-upgrade') },
      {
        label: 'Creation Model',
        children: [
          { label: 'Upgrade Creation Model', href: cc('upgrade-center/creation-model') },
        ],
      },
      {
        label: 'Generation Models',
        children: [
          { label: 'Upgrade Generation Model', href: cc('upgrade-center/generation-model') },
        ],
      },
      {
        label: 'Generation Speed',
        children: [
          { label: 'Upgrade Speed', href: cc('upgrade-center/generation-speed') },
        ],
      },
      {
        label: 'Output Quality',
        children: [
          { label: 'Upgrade Quality', href: cc('upgrade-center/output-quality') },
        ],
      },
      { label: 'Custom Upgrade Request', href: cc('upgrade-center/custom-request') },
    ],
  },
  {
    id: 'support',
    no: '11',
    title: 'HELP & SUPPORT',
    icon: CircleHelp,
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

function hrefIsActive(path: string, href?: string) {
  if (!href) return false;
  if (href === '/') return path === '/';
  return path === href || path.startsWith(href + '/');
}

function sectionIsActive(section: Section, path: string) {
  return section.children.some((node) => {
    if (isGroup(node)) return node.children.some((child) => hrefIsActive(path, child.href));
    return hrefIsActive(path, node.href);
  });
}

export function JerseyOSControlNav({
  dark: _dark,
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
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['workspace']));
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const [path, setPath] = useState('/');

  useEffect(() => {
    setPath(window.location.pathname || '/');
    if (!drawer) {
      setCollapsed(window.localStorage.getItem('jerseyos_sidebar_collapsed') === '1');
    }
  }, [drawer]);

  useEffect(() => {
    if (!drawer) {
      window.localStorage.setItem('jerseyos_sidebar_collapsed', collapsed ? '1' : '0');
    }
  }, [collapsed, drawer]);

  const activeSectionId = useMemo(
    () => sections.find((section) => sectionIsActive(section, path))?.id,
    [path],
  );

  useEffect(() => {
    if (!activeSectionId) return;

    setOpenSections((current) => {
      if (current.has(activeSectionId)) return current;
      const next = new Set(current);
      next.add(activeSectionId);
      return next;
    });

    const section = sections.find((item) => item.id === activeSectionId);
    if (!section) return;

    section.children.forEach((node) => {
      if (!isGroup(node)) return;
      const groupHasActiveChild = node.children.some((child) => hrefIsActive(path, child.href));
      if (!groupHasActiveChild) return;

      setOpenGroups((current) => {
        const key = section.id + ':' + node.label;
        if (current.has(key)) return current;
        const next = new Set(current);
        next.add(key);
        return next;
      });
    });
  }, [activeSectionId, path]);

  const mini = !drawer && collapsed;
  const shell = drawer
    ? 'h-full w-full bg-white text-[#111318]'
    : join(
        'sticky top-0 hidden h-screen shrink-0 border-r border-black/[0.06] bg-white text-[#111318] shadow-[6px_0_24px_rgba(15,23,42,.045)] transition-[width] duration-300 xl:flex xl:flex-col',
        mini ? 'w-[78px]' : 'w-[300px]',
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

  function renderLeaf(leaf: Leaf, key: string, nested = false) {
    if (leaf.descriptor) {
      return (
        <div
          key={key}
          className={join(
            'relative flex min-h-8 items-center pl-7 pr-2 text-[12px] font-medium text-[#9aa0aa]',
            nested && 'pl-9',
          )}
        >
          <span className="absolute left-[13px] top-1/2 h-px w-2 -translate-y-1/2 bg-[#d8dce2]" />
          {leaf.label}
        </div>
      );
    }

    const active = hrefIsActive(path, leaf.href);
    const themeActive =
      (leaf.theme === 'light' && theme === 'light') ||
      (leaf.theme === 'dark' && theme === 'dark');

    return (
      <a
        key={key}
        href={leaf.href || '#'}
        title={leaf.label}
        onClick={(event) => clickLeaf(event, leaf)}
        className={join(
          'group relative flex min-h-[38px] items-center rounded-[11px] px-3 text-[14px] font-medium transition-all duration-200',
          nested ? 'ml-3 pl-6 pr-2' : 'ml-1 pl-4 pr-2',
          active || themeActive
            ? 'bg-[#f7efd9] text-[#171717] shadow-[inset_0_0_0_1px_rgba(192,147,46,.12)]'
            : 'text-[#4f5560] hover:bg-[#f6f7f8] hover:text-[#171717]',
        )}
      >
        <span
          className={join(
            'mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition',
            active || themeActive ? 'bg-[#b88a2f]' : 'bg-[#c8ccd2] group-hover:bg-[#9aa0a8]',
          )}
        />
        <span className="min-w-0 flex-1 truncate">{leaf.label}</span>
      </a>
    );
  }

  return (
    <aside className={shell}>
      <div className="sticky top-0 z-20 border-b border-black/[0.055] bg-white/96 px-3 py-3 backdrop-blur-xl">
        <div className={join('flex items-center', mini ? 'justify-center' : 'justify-between gap-2')}>
          <a href="/" className={join('flex min-w-0 items-center', mini ? '' : 'gap-3')}>
            <img
              src="/brand/jerseyos-logo.png"
              alt="JerseyOS"
              className={join('shrink-0 object-contain', mini ? 'h-11 w-11' : 'h-12 w-12')}
            />

            {!mini ? (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[18px] font-semibold tracking-[-0.02em] text-[#111318]">
                  JerseyOS <span className="text-[15px]">🇧🇩</span>
                </div>
                <div className="mt-1 max-w-[184px] text-[9px] font-medium uppercase leading-4 tracking-[0.12em] text-[#a1a5ad]">
                  AI-Powered Jersey Production OS
                </div>
              </div>
            ) : null}
          </a>

          {drawer ? (
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.07] bg-[#fafafa] text-[#1b1d21] transition hover:bg-[#f2f2f2]"
              aria-label="Close navigation"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          ) : !mini ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.07] bg-[#fafafa] text-[#555b64] transition hover:bg-[#f2f2f2] hover:text-[#111318]"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
          ) : null}
        </div>

        {mini ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 grid h-8 w-8 place-items-center rounded-lg text-[#666c74] transition hover:bg-[#f2f3f4] hover:text-[#111318]"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </button>
        ) : null}
      </div>

      <div className="jerseyos-minimal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <nav className="space-y-2.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const open = openSections.has(section.id);
            const activeSection = section.id === activeSectionId;

            return (
              <section key={section.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  title={mini ? section.no + '. ' + section.title : undefined}
                  className={join(
                    'group flex w-full items-center transition-all duration-200',
                    mini
                      ? 'h-[46px] justify-center rounded-[12px]'
                      : 'min-h-[44px] rounded-[12px] px-2.5',
                    activeSection
                      ? 'bg-[#faf4e3] text-[#171717]'
                      : 'text-[#272b31] hover:bg-[#f7f7f7]',
                  )}
                >
                  <span
                    className={join(
                      'grid shrink-0 place-items-center rounded-[10px] transition',
                      mini ? 'h-10 w-10' : 'h-9 w-9',
                      activeSection ? 'bg-[#f2e7c9] text-[#9c7122]' : 'text-[#15171a]',
                    )}
                  >
                    <Icon className="h-[19px] w-[19px]" strokeWidth={1.7} />
                  </span>

                  {!mini ? (
                    <>
                      <div className="ml-2 min-w-0 flex-1 text-left">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a3a7ae]">
                          {section.no}. {section.title}
                        </div>
                      </div>
                      {open ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#777d86]" strokeWidth={1.6} />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#777d86]" strokeWidth={1.6} />
                      )}
                    </>
                  ) : null}
                </button>

                {!mini ? (
                  <div
                    className={join(
                      'grid transition-[grid-template-rows,opacity] duration-250 ease-out',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="relative ml-[30px] mt-1.5 space-y-0.5 border-l border-[#dfe2e6] pl-2.5">
                        {section.children.map((node, index) => {
                          const key = section.id + '-' + String(index);

                          if (!isGroup(node)) return renderLeaf(node, key);

                          const groupKey = section.id + ':' + node.label;
                          const groupOpen = openGroups.has(groupKey);

                          return (
                            <div key={groupKey}>
                              <button
                                type="button"
                                onClick={() => toggleGroup(groupKey)}
                                className="flex min-h-[38px] w-full items-center rounded-[10px] px-3 text-left text-[14px] font-medium text-[#4f5560] transition hover:bg-[#f6f7f8] hover:text-[#171717]"
                              >
                                {groupOpen ? (
                                  <ChevronDown className="mr-2 h-3.5 w-3.5 shrink-0 text-[#8a9098]" strokeWidth={1.6} />
                                ) : (
                                  <ChevronRight className="mr-2 h-3.5 w-3.5 shrink-0 text-[#8a9098]" strokeWidth={1.6} />
                                )}
                                <span className="min-w-0 flex-1 truncate">{node.label}</span>
                              </button>

                              <div
                                className={join(
                                  'grid transition-[grid-template-rows,opacity] duration-200',
                                  groupOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                                )}
                              >
                                <div className="overflow-hidden">
                                  <div className="relative ml-4 border-l border-[#e1e4e8] py-0.5">
                                    {node.children.map((child, childIndex) =>
                                      renderLeaf(
                                        child,
                                        groupKey + '-' + String(childIndex),
                                        true,
                                      ),
                                    )}
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

      <div className="sticky bottom-0 z-20 border-t border-black/[0.055] bg-white/96 px-3 py-3 backdrop-blur-xl">
        {mini ? (
          <div
            title="Multiverse X • Protected JerseyOS Product"
            className="mx-auto grid h-10 w-10 place-items-center rounded-[11px] border border-black/[0.07] bg-[#fafafa] text-[#44484f]"
          >
            <LockKeyhole className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </div>
        ) : (
          <div className="rounded-[12px] border border-black/[0.06] bg-[#fafafa] px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#34373d]">
              <LockKeyhole className="h-3.5 w-3.5 text-[#9b742c]" strokeWidth={1.7} />
              <span>Multiverse X</span>
            </div>
            <p className="mt-1 text-[10px] leading-4 text-[#8b9097]">
              Protected JerseyOS product
            </p>
          </div>
        )}
      </div>

      <style>{`
        .jerseyos-minimal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d9dde2 transparent;
        }
        .jerseyos-minimal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .jerseyos-minimal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .jerseyos-minimal-scroll::-webkit-scrollbar-thumb {
          background: #d9dde2;
          border-radius: 999px;
        }
        .jerseyos-minimal-scroll::-webkit-scrollbar-thumb:hover {
          background: #c7ccd2;
        }
      `}</style>
    </aside>
  );
}

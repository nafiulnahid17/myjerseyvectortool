'use client';

import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { JerseyOSControlNav } from '@/components/navigation/jerseyos-control-nav';
import { useStudioSession } from '@/components/auth/studio-session';

export function GlobalJerseyOSNavigation() {
  const session = useStudioSession();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [path, setPath] = useState('/');

  useEffect(() => {
    setPath(window.location.pathname || '/');
    const saved = window.localStorage.getItem('mj_dashboard_theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.dataset.mjTheme = saved;
    } else {
      setTheme('light');
      document.documentElement.dataset.mjTheme = 'light';
    }
  }, []);

  function changeTheme(next: 'dark' | 'light') {
    setTheme(next);
    window.localStorage.setItem('mj_dashboard_theme', next);
    document.documentElement.dataset.mjTheme = next;
    window.dispatchEvent(new CustomEvent('jerseyos-theme-change', { detail: next }));
  }

  function navigate(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    if (href === '/' || session.canAccessFeatures) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    setOpen(false);
    session.requestAccess(href);
  }

  const dark = theme === 'dark';
  const hasNativeDesktopSidebar =
    path === '/' ||
    path === '/image-to-vector' ||
    path.startsWith('/control-center');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open JerseyOS menu"
        title="Open JerseyOS menu"
        className={
          'fixed left-3 top-3 z-[86] inline-flex h-11 items-center gap-2 rounded-xl border border-black/[0.08] bg-white/95 px-3 text-[#17191d] shadow-[0_10px_28px_rgba(15,23,42,.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#fafafa] sm:left-4 sm:top-4 ' +
          (hasNativeDesktopSidebar ? 'xl:hidden ' : '')
        }
      >
        <Menu className="h-5 w-5" />
        <span className="hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">Menu</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[95] bg-black/25 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="JerseyOS navigation"
        >
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative h-full w-[min(92vw,320px)] shadow-[22px_0_55px_rgba(15,23,42,.16)]">
            <JerseyOSControlNav
              dark={dark}
              drawer
              theme={theme}
              onThemeChange={changeTheme}
              onNavigate={navigate}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

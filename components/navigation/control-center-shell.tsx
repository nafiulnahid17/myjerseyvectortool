'use client';

import { Menu } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { JerseyOSControlNav } from '@/components/navigation/jerseyos-control-nav';

export function ControlCenterShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('mj_dashboard_theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mj_dashboard_theme', theme);
    document.documentElement.dataset.mjTheme = theme;
  }, [theme]);

  const dark = theme === 'dark';

  return (
    <main className={dark ? 'min-h-screen bg-[#020812] text-white' : 'min-h-screen bg-[#eef4fb] text-[#0a1728]'}>
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <JerseyOSControlNav dark={dark} theme={theme} onThemeChange={setTheme} />

        <section className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">
          {children}
        </section>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[90] bg-[#020812]/82 backdrop-blur-xl xl:hidden">
          <div className="h-full max-w-[390px] shadow-[25px_0_80px_rgba(0,0,0,.45)]">
            <JerseyOSControlNav
              dark={dark}
              drawer
              theme={theme}
              onThemeChange={setTheme}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

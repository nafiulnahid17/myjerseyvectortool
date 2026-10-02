'use client';

import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, UserRound, X } from 'lucide-react';

export type StudioProfile = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: string;
};

type SessionContextValue = {
  authenticated: boolean;
  checking: boolean;
  profile: StudioProfile | null;
  canAccessFeatures: boolean;
  requestAccess: (href: string) => void;
  openLogin: (href?: string) => void;
  openProfile: (href?: string) => void;
  logout: () => Promise<void>;
};

const StudioSessionContext = createContext<SessionContextValue | null>(null);

const PROFILE_KEY = 'mj_studio_profile_v1';

export function StudioSessionProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<StudioProfile | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState('');
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname || '/');

    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as StudioProfile;
        if (saved?.fullName && saved?.email) setProfile(saved);
      }
    } catch {}

    fetch('/api/studio-auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  const protectedRoute = useMemo(
    () =>
      currentPath !== '/' &&
      currentPath !== '/route-check' &&
      !currentPath.startsWith('/api/') &&
      !currentPath.startsWith('/_next/'),
    [currentPath],
  );

  useEffect(() => {
    if (checking || !protectedRoute) return;
    if (!authenticated) {
      setPendingHref(currentPath);
      setLoginOpen(true);
      return;
    }
    if (!profile) {
      setPendingHref(currentPath);
      setProfileOpen(true);
    }
  }, [authenticated, checking, currentPath, profile, protectedRoute]);

  function openLogin(href = '') {
    if (href) setPendingHref(href);
    setLoginOpen(true);
  }

  function openProfile(href = '') {
    if (href) setPendingHref(href);
    setProfileOpen(true);
  }

  function requestAccess(href: string) {
    setPendingHref(href);
    if (!authenticated) {
      setLoginOpen(true);
      return;
    }
    if (!profile) {
      setProfileOpen(true);
      return;
    }
    window.location.assign(href);
  }

  async function logout() {
    try {
      await fetch('/api/studio-auth/logout', { method: 'POST' });
    } catch {}
    setAuthenticated(false);
    setLoginOpen(false);
    setProfileOpen(false);
    window.location.assign('/');
  }

  function finishLogin() {
    setAuthenticated(true);
    setLoginOpen(false);
    if (!profile) {
      setProfileOpen(true);
      return;
    }
    if (pendingHref && pendingHref !== currentPath) window.location.assign(pendingHref);
  }

  function finishProfile(next: StudioProfile) {
    setProfile(next);
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {}
    setProfileOpen(false);
    if (pendingHref) window.location.assign(pendingHref);
  }

  function closeLogin() {
    setLoginOpen(false);
    if (protectedRoute && !authenticated) window.location.assign('/');
  }

  function closeProfile() {
    setProfileOpen(false);
    if (protectedRoute && !profile) window.location.assign('/');
  }

  const value: SessionContextValue = {
    authenticated,
    checking,
    profile,
    canAccessFeatures: authenticated && Boolean(profile),
    requestAccess,
    openLogin,
    openProfile,
    logout,
  };

  return (
    <StudioSessionContext.Provider value={value}>
      {children}

      {checking && protectedRoute ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#020812]/95 text-white backdrop-blur-md">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <LoaderCircle className="h-5 w-5 animate-spin text-sky-400" />
            Checking studio session…
          </div>
        </div>
      ) : null}

      {loginOpen ? <LoginModal onClose={closeLogin} onSuccess={finishLogin} /> : null}
      {profileOpen && authenticated ? (
        <ProfileModal
          initial={profile}
          onClose={closeProfile}
          onComplete={finishProfile}
        />
      ) : null}
    </StudioSessionContext.Provider>
  );
}

export function useStudioSession() {
  const value = useContext(StudioSessionContext);
  if (!value) throw new Error('useStudioSession must be used inside StudioSessionProvider.');
  return value;
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/studio-auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || 'Invalid username or password.');
      onSuccess();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020812]/82 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-sky-400/20 bg-[linear-gradient(180deg,#071426,#030a14)] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,.65)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,129,255,.22),transparent_30%)]" />
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0875ff,#22b0ff)] shadow-[0_12px_30px_rgba(8,117,255,.3)]">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">My Jersey Studio</p>
          <h2 className="mt-2 text-3xl font-black">Sign in to continue</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Studio tools are protected. Sign in before opening a feature.</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-white/60">Username</span>
              <input
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-400/50"
                placeholder="Enter username"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-white/60">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-400/50"
                placeholder="Enter password"
              />
            </label>

            {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <button
              type="submit"
              disabled={submitting || !username.trim() || !password}
              className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#0875ff,#18a5ff)] px-5 font-bold text-white shadow-[0_15px_35px_rgba(8,117,255,.28)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-5 w-5" />}
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({
  initial,
  onClose,
  onComplete,
}: {
  initial: StudioProfile | null;
  onClose: () => void;
  onComplete: (profile: StudioProfile) => void;
}) {
  const [form, setForm] = useState<StudioProfile>(
    initial || { fullName: '', email: '', phone: '', country: '', role: '' },
  );
  const [error, setError] = useState('');

  function update(key: keyof StudioProfile, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.email.trim() || !form.country.trim() || !form.role.trim()) {
      setError('Complete all required profile fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    onComplete({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      role: form.role.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center overflow-y-auto bg-[#020812]/86 p-4 backdrop-blur-xl">
      <div className="relative my-6 w-full max-w-2xl overflow-hidden rounded-[30px] border border-sky-400/20 bg-[linear-gradient(180deg,#071426,#030a14)] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,.65)] sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0875ff,#22b0ff)]">
            <UserRound className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">First-time setup</p>
            <h2 className="mt-1 text-3xl font-black">Complete your profile</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">This profile is saved in this browser until the full account backend is connected.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
          <ProfileField label="Full name *" value={form.fullName} onChange={(v) => update('fullName', v)} placeholder="Your full name" />
          <ProfileField label="Email *" value={form.email} onChange={(v) => update('email', v)} placeholder="name@example.com" type="email" />
          <ProfileField label="Phone" value={form.phone} onChange={(v) => update('phone', v)} placeholder="Phone number" />
          <ProfileField label="Country *" value={form.country} onChange={(v) => update('country', v)} placeholder="Country" />
          <div className="sm:col-span-2">
            <ProfileField label="Role / Profession *" value={form.role} onChange={(v) => update('role', v)} placeholder="Designer, production manager, owner…" />
          </div>

          {error ? <div className="sm:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

          <button type="submit" className="sm:col-span-2 inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#0875ff,#18a5ff)] px-5 font-bold shadow-[0_15px_35px_rgba(8,117,255,.28)]">
            <CheckCircle2 className="h-5 w-5" />
            Save Profile & Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-white/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-400/50"
      />
    </label>
  );
}

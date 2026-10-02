import { ArrowLeft, CircleHelp, Coins, Construction, FileCog, ShieldCheck, UserRound } from 'lucide-react';
import { ControlCenterShell } from '@/components/navigation/control-center-shell';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ControlCenterPage({ params }: PageProps) {
  const resolved = await params;
  const slug = resolved.slug || [];
  const title = titleFromSlug(slug);
  const root = slug[0] || 'overview';

  return (
    <ControlCenterShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            JerseyOS Dashboard
          </a>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/70">
            JerseyOS 🇧🇩 Control Center
          </div>
        </div>

        {root === 'system-health' ? (
          <SystemHealth />
        ) : (
          <section className="mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#07111f,#040b16)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sky-300">
                {iconFor(root)}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">JerseyOS Control Center</p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
                  {descriptionFor(root)}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-[24px] border border-white/8 bg-white/[0.025] p-5">
              <div className="flex items-start gap-3">
                <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="font-bold">Integration-ready state</p>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    {emptyStateFor(root)}
                  </p>
                </div>
              </div>
            </div>

            {root === 'my-workspace' && slug.includes('approved-users') ? (
              <div className="mt-4 rounded-[24px] border border-white/8 bg-black/15 p-5">
                <p className="font-bold">Approved Users</p>
                <p className="mt-2 text-sm text-white/45">No data available.</p>
              </div>
            ) : null}

            {root === 'credits' || (root === 'my-workspace' && slug.includes('billing')) ? (
              <div className="mt-4 rounded-[24px] border border-white/8 bg-black/15 p-5">
                <p className="font-bold">Billing / Credit Data</p>
                <p className="mt-2 text-sm text-white/45">Not connected yet.</p>
              </div>
            ) : null}

            {root === 'upgrade-center' ? (
              <div className="mt-4 rounded-[24px] border border-violet-400/15 bg-violet-500/[0.04] p-5">
                <p className="font-bold text-violet-100">Upgrade Request Workflow</p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  This destination is prepared for a future real submission backend. No request has been created or stored.
                </p>
              </div>
            ) : null}
          </section>
        )}

        <footer className="mt-6 border-t border-white/8 py-5 text-center text-xs text-white/30">
          It's a Product of Multiverse X · Don't Try to Replicate Any Tool or Design · Contact Developer for Your Version
        </footer>
      </div>
    </ControlCenterShell>
  );
}

function SystemHealth() {
  return (
    <section className="mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#07111f,#040b16)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:p-8">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">08. System Health</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">System Health</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
            Health values are shown only when connected to real monitoring endpoints. No uptime, latency, provider status, or test result is fabricated.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-3">
        <HealthTable
          title="Server Health"
          columns={['Service / Tool', 'Status', 'Response Time', 'Result']}
        />
        <HealthTable
          title="AI Agent Health"
          columns={['Agent / Tool', 'Status', 'Provider', 'Result']}
        />
        <HealthTable
          title="Studio Health"
          columns={['Tool', 'Status', 'Last Test', 'Result']}
        />
      </div>
    </section>
  );
}

function HealthTable({ title, columns }: { title: string; columns: string[] }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/8 bg-black/15">
      <div className="border-b border-white/8 px-5 py-4">
        <h2 className="font-black">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/8 text-xs sm:grid-cols-4 xl:grid-cols-2">
        {columns.map((column) => (
          <div key={column} className="bg-[#07111f] px-3 py-3 font-semibold text-white/55">
            {column}
          </div>
        ))}
      </div>
      <div className="p-5">
        <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center">
          <p className="font-semibold text-white/65">Status Unavailable</p>
          <p className="mt-1 text-xs leading-5 text-white/35">Not Connected</p>
        </div>
      </div>
    </div>
  );
}

function titleFromSlug(slug: string[]) {
  if (!slug.length) return 'Overview';
  const last = slug[slug.length - 1];
  return last
    .split('-')
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : '')
    .join(' ')
    .replace('Ai ', 'AI ');
}

function descriptionFor(root: string) {
  if (root === 'my-workspace') return 'Workspace, profile, billing, and approved-user management for this JerseyOS installation.';
  if (root === 'projects') return 'Project organization and lifecycle navigation without changing existing project data.';
  if (root === 'credits') return 'Credit views are connected only to real data sources when available.';
  if (root === 'plans') return 'Subscription and plan destinations are prepared without inventing pricing or entitlements.';
  if (root === 'settings') return 'JerseyOS preferences and configuration destinations.';
  if (root === 'upgrade-center') return 'Custom capability upgrade requests for this JerseyOS installation.';
  if (root === 'support') return 'Help, guides, reporting, feature requests, and support destinations.';
  if (root === 'about') return 'JerseyOS product, release, system, and legal information.';
  return 'JerseyOS control-center destination.';
}

function emptyStateFor(root: string) {
  if (root === 'credits') return 'No credit values are displayed because this destination is not connected to a live credit source yet.';
  if (root === 'plans') return 'No plan price, billing cycle, or entitlement is displayed unless connected to real subscription data.';
  if (root === 'projects') return 'No project records are fabricated. Existing project functionality remains unchanged on its current routes.';
  if (root === 'my-workspace') return 'No payment cards, invoices, users, transactions, or account records are fabricated.';
  return 'This destination is ready for its real backend or settings integration. No fake data or simulated actions have been added.';
}

function iconFor(root: string) {
  if (root === 'my-workspace') return <UserRound className="h-7 w-7" />;
  if (root === 'credits') return <Coins className="h-7 w-7" />;
  if (root === 'settings') return <FileCog className="h-7 w-7" />;
  if (root === 'support') return <CircleHelp className="h-7 w-7" />;
  return <ShieldCheck className="h-7 w-7" />;
}

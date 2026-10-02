import {
  ArrowLeft,
  Coins,
  History,
  Plus,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';

export default function CreditBalancePage() {
  return (
    <main className="min-h-screen bg-[#020812] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,153,255,0.18),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(0,217,255,0.09),transparent_22%),linear-gradient(180deg,#020916,#020812)]" />

        <div className="relative mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-sky-400/12 bg-[#06111f]/90 p-4 backdrop-blur-xl">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </a>

            <div className="flex items-center gap-3">
              <img src="/brand/jerseyos-logo.png" alt="JerseyOS" className="h-12 w-12 object-contain" />
              <div className="text-right">
                <div className="text-lg font-black">JerseyOS</div>
                <div className="text-xs text-white/45">Credit Balance</div>
              </div>
            </div>
          </header>

          <section className="mt-5 overflow-hidden rounded-[32px] border border-sky-400/14 bg-[linear-gradient(135deg,rgba(4,20,38,.98),rgba(3,10,22,.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                  <Coins className="h-4 w-4" />
                  AI Credit Center
                </div>

                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  Credit <span className="text-cyan-400">Balance</span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                  View your available AI credit balance separately from the TopUp page.
                  This page is for balance and usage information only.
                </p>

                <div className="mt-7 rounded-[28px] border border-sky-400/16 bg-[linear-gradient(180deg,rgba(7,26,47,.96),rgba(4,14,27,.96))] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white/45">Available AI Credit</div>
                      <div className="mt-2 text-5xl font-black tracking-tight text-white">—</div>
                    </div>

                    <div className="grid h-16 w-16 place-items-center rounded-[22px] border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                      <WalletCards className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-400/18 bg-amber-400/[0.06] px-4 py-3 text-sm leading-6 text-amber-100/75">
                    Live credit balance is not connected to a persistent credit backend yet, so no fake balance is displayed.
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href="/topup-ai-credits"
                      className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#0875ff,#22c8ff)] px-5 py-3 font-bold text-white shadow-[0_14px_30px_rgba(8,117,255,.24)]"
                    >
                      <Plus className="h-4 w-4" />
                      TopUp AI Credits
                    </a>

                    <a
                      href="/"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-semibold text-white/75"
                    >
                      Dashboard
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <InfoCard
                  icon={<Sparkles className="h-5 w-5" />}
                  title="AI Usage"
                  text="Usage information will appear here after the credit ledger is connected."
                />
                <InfoCard
                  icon={<History className="h-5 w-5" />}
                  title="Credit History"
                  text="TopUp and usage history will stay separate from the payment submission page."
                />
                <InfoCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="No Fake Data"
                  text="This page does not invent a balance, transaction, approval, or usage record."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-sky-400/12 bg-[linear-gradient(180deg,rgba(7,23,43,.96),rgba(3,13,26,.96))] p-5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/52">{text}</p>
    </div>
  );
}

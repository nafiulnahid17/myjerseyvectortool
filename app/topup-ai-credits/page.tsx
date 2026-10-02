export default function TopupAiCreditsPage() {
  return (
    <main className="min-h-screen bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/[0.06]"
        >
          ← Dashboard
        </a>

        <section className="mt-8 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(0,174,255,0.18),transparent_26%),linear-gradient(180deg,#071424,#030b16)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">My Jersey Studio</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Topup AI Credits</h1>
            <p className="mt-4 text-base leading-7 text-white/65">
              Add AI generation credits to your workspace for image generation, regeneration, and AI-assisted production tools.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold text-white/55">Current credit balance</p>
              <div className="mt-3 text-3xl font-black">Not connected</div>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Credit balance will appear here after the billing/credit backend is connected.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xl font-bold">Topup system status</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Payment checkout and automatic AI-credit allocation are intentionally not faked. Connect your payment provider and credit ledger when ready.
              </p>
              <button
                type="button"
                disabled
                className="mt-5 rounded-2xl bg-[linear-gradient(90deg,#0875ff,#14a3ff)] px-5 py-3 font-semibold text-white opacity-50"
              >
                Topup integration pending
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

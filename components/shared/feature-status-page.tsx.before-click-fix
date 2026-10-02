import Link from 'next/link';
import { ArrowLeft, ArrowRight, Construction, Home, Sparkles } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function FeatureStatusPage({
  title,
  description,
  primaryHref = '/image-to-vector',
  primaryLabel = 'Open Image to Vector',
}: Props) {
  return (
    <main className="min-h-screen bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 hover:bg-white/[0.06]">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 hover:bg-white/[0.06]">
            All tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,.14),transparent_28%),linear-gradient(180deg,#07111f,#040b16)] p-8 shadow-[0_30px_90px_rgba(0,0,0,.35)] sm:p-10">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sky-300">
            <Construction className="h-8 w-8" />
          </div>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">My Jersey Studio</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">{description}</p>

          <div className="mt-8 rounded-[24px] border border-white/8 bg-white/[0.025] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <div>
                <p className="font-semibold">This route is connected.</p>
                <p className="mt-1 text-sm leading-6 text-white/50">This module has not been filled with fake data or fake functionality. It is ready to be developed as its own update while the Image to Vector workflow remains available now.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#0875ff,#13a0ff)] px-5 py-3.5 font-bold shadow-[0_16px_36px_rgba(8,117,255,.25)]">
              {primaryLabel} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3.5 font-semibold text-white/80">
              <Home className="h-5 w-5" /> Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

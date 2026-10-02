export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/[0.06]"
        >
          ← Dashboard
        </a>

        <section className="mt-8 overflow-hidden rounded-[30px] border border-blue-400/20 bg-[radial-gradient(circle_at_top_left,rgba(41,126,255,0.2),transparent_28%),linear-gradient(180deg,#071424,#030b16)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-400">About Us</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">My Jersey Studio</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
            My Jersey Studio is a jersey-production workspace designed to bring image-to-vector workflows,
            one-click production layouts, file conversion, editing, previews, mockups, and AI-assisted
            customization into one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard title="Create" text="Turn jersey source images into cleaner production-oriented design workflows." />
            <InfoCard title="Customize" text="Adjust names, numbers, colors, logos, patterns, and other jersey details." />
            <InfoCard title="Export" text="Prepare outputs for common design, preview, and production file formats." />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-bold">Product principle</h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              The workspace is being built feature-by-feature. Functions that are not yet connected to a real backend,
              payment provider, or AI service should remain clearly marked rather than showing fake operational data.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}

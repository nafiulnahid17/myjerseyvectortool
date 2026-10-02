import type { ReactNode } from 'react';
import {
  ArrowRight,
  Bot,
  Cloud,
  Code2,
  Download,
  ExternalLink,
  Facebook,
  FileCog,
  Image as ImageIcon,
  Layers3,
  Mail,
  MessageCircle,
  PackageOpen,
  Palette,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

const tools = [
  { title: 'Image to Vector', text: 'Convert jersey images into clean, editable vector-oriented production layouts.', icon: ImageIcon, href: '/image-to-vector' },
  { title: 'One-click Creation', text: 'Generate a complete jersey production layout from a single source image.', icon: Sparkles, href: '/oneclick-creation' },
  { title: 'File Converter', text: 'Convert supported design files between common production and preview formats.', icon: FileCog, href: '/file-converter' },
  { title: 'Edit Existing File', text: 'Modify and customize an existing jersey design inside the production workflow.', icon: Palette, href: '/edit-existing-file' },
  { title: 'Fallback Backup', text: 'Keep recovery-ready project files available for safer production work.', icon: Cloud, href: '/backup' },
  { title: 'Mockup Generator', text: 'Create jersey presentation previews and mockup views for review.', icon: PackageOpen, href: '/mockup-generator' },
  { title: 'AI Assistant', text: 'Use AI-assisted commands for design suggestions and production changes.', icon: Bot, href: '/ai-assistant' },
];

const pipeline = [
  { number: '1', title: 'Upload Input', text: 'Upload a jersey image or reference design.', icon: ImageIcon },
  { number: '2', title: 'Analyze Jersey', text: 'AI analyzes visible patterns, colors, panels and structure.', icon: ScanSearch },
  { number: '3', title: 'Choose Options', text: 'Select pattern, quality, aspect ratio and workflow preferences.', icon: Layers3 },
  { number: '4', title: 'Generate Vector', text: 'AI reconstructs the jersey into a production-ready layout.', icon: WandSparkles },
  { number: '5', title: 'Customize', text: 'Edit colors, logos, names, numbers and other details.', icon: Palette },
  { number: '6', title: 'Preview', text: 'Review the result in available 2D or perspective preview modes.', icon: PackageOpen },
  { number: '7', title: 'Download', text: 'Export using the formats supported by the selected tool.', icon: Download },
];

const stack = [
  { title: 'AI Image Generation Workflow', text: 'AI-assisted jersey reconstruction and controlled image-generation workflows.', icon: Bot },
  { title: 'Pattern-Based Master Command System', text: 'Structured production commands guide panel arrangement and reconstruction rules.', icon: Layers3 },
  { title: 'Production Layout Reconstruction', text: 'Separated jersey components are prepared for production-oriented review.', icon: WandSparkles },
  { title: 'Multi-Format Export Support', text: 'Common image, document and vector-oriented export workflows are supported by tool.', icon: FileCog },
  { title: 'Preview System', text: '2D and perspective-style previews help with final review before download.', icon: PackageOpen },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#020711] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,153,255,0.18),transparent_24%),radial-gradient(circle_at_85%_10%,rgba(0,195,255,0.12),transparent_20%),linear-gradient(180deg,#020a15,#020711)]" />

        <div className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-[#04101f]/88 px-4 py-3 backdrop-blur-xl">
            <a href="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-sky-400/30 bg-[linear-gradient(135deg,#083b76,#0ea5ff)] text-xl font-black">
                MJ
              </div>
              <div className="text-lg font-black tracking-tight">My Jersey <span className="text-sky-400">Studio</span></div>
            </a>

            <nav className="hidden items-center gap-7 text-sm text-white/70 lg:flex">
              <a href="/" className="transition hover:text-white">Home</a>
              <a href="/about-us" className="border-b-2 border-sky-400 pb-2 font-semibold text-sky-300">About Us</a>
              <a href="/tools" className="transition hover:text-white">Tools</a>
              <a href="/projects" className="transition hover:text-white">Gallery</a>
              <a href="/upgrade" className="transition hover:text-white">Pricing</a>
              <a href="/help-support" className="transition hover:text-white">Support</a>
            </nav>

            <div className="flex items-center gap-2">
              <a href="/" className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.07]">Sign In</a>
              <a href="/image-to-vector" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#0989ff,#16c8ff)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,153,255,0.28)]">
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </header>

          <section className="relative mt-4 overflow-hidden rounded-[28px] border border-sky-400/20 bg-[linear-gradient(110deg,rgba(2,12,25,0.98),rgba(4,29,57,0.88))] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.34)] lg:px-8 lg:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(0,173,255,0.24),transparent_24%),linear-gradient(135deg,transparent,rgba(15,101,183,0.12),transparent)]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-300">✦ About Us</p>
                <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                  About
                  <span className="block">My Jersey <span className="text-cyan-400">Studio</span></span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
                  My Jersey Studio is a production-focused jersey design workspace that transforms jersey images into
                  production-oriented layouts. It brings upload, AI-assisted reconstruction, customization, preview and
                  export workflows into one interface for faster design and production review.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/image-to-vector" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#0687ff,#22c8ff)] px-5 py-3 font-bold text-white">
                    Start Designing <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/tools" className="inline-flex items-center gap-2 rounded-xl border border-sky-400/35 bg-sky-400/8 px-5 py-3 font-semibold text-white/85">Explore Tools</a>
                </div>
              </div>

              <HeroStudioArtwork />
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-[28px] border border-cyan-400/35 bg-[linear-gradient(100deg,rgba(2,14,28,0.98),rgba(3,23,45,0.98))] shadow-[0_0_35px_rgba(0,187,255,0.18)]">
            <div className="grid lg:grid-cols-[0.82fr_1.08fr_0.9fr]">
              <div className="relative min-h-[340px] overflow-hidden border-b border-white/8 lg:border-b-0 lg:border-r">
                <img src="/about/developer-the-artist.png" alt="The Artist — Lead Developer" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,9,20,0.1),rgba(0,9,20,0.35)),linear-gradient(180deg,transparent_55%,rgba(0,7,15,0.88))]" />
                <div className="absolute bottom-6 left-6"><div className="text-4xl font-serif italic text-white">The Artist</div></div>
              </div>

              <div className="p-6 lg:p-8">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-400">Lead Developer</p>
                <div className="mt-2 flex items-center gap-2">
                  <h2 className="text-4xl font-black">The Artist</h2>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-400 text-xs font-black text-[#02101c]">✓</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Creator and lead developer of My Jersey Studio, focused on product design, full-stack implementation,
                  AI-assisted design systems and production workflow development.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Tag icon={<Palette className="h-4 w-4" />} text="Product Design" />
                  <Tag icon={<Code2 className="h-4 w-4" />} text="Full Stack Development" />
                  <Tag icon={<Bot className="h-4 w-4" />} text="AI & Design Systems" />
                  <Tag icon={<PackageOpen className="h-4 w-4" />} text="Jersey Production Tools" />
                </div>
              </div>

              <div className="border-t border-white/8 p-6 lg:border-l lg:border-t-0 lg:p-8">
                <div className="rounded-[22px] border border-sky-400/20 bg-sky-500/[0.05] p-5">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-1 h-6 w-6 text-cyan-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Get In Touch</h3>
                      <p className="mt-1 text-sm leading-6 text-white/55">For collaboration, custom solutions or professional inquiries.</p>
                    </div>
                  </div>

                  <a href="https://wa.me/8801303498506" target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#08a7ff,#28dcff)] px-4 py-3.5 font-black text-[#03111c]">
                    Contact Developer <ArrowRight className="h-4 w-4" />
                  </a>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <a href="mailto:nafiulalnahid@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/25 bg-white/[0.03] px-3 py-3 text-sm font-semibold">
                      <Mail className="h-4 w-4 text-cyan-400" /> Email
                    </a>
                    <a href="https://wa.me/8801303498506" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-white/[0.03] px-3 py-3 text-sm font-semibold">
                      <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp
                    </a>
                    <a href="https://www.facebook.com/share/1H4UxPjq4q/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/25 bg-white/[0.03] px-3 py-3 text-sm font-semibold">
                      <Facebook className="h-4 w-4 text-blue-400" /> Facebook
                    </a>
                  </div>

                  <div className="mt-4 space-y-2 text-xs leading-5 text-white/50">
                    <p><span className="text-white/70">WhatsApp:</span> 01303498506</p>
                    <p><span className="text-white/70">Email:</span> nafiulalnahid@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <SectionTitle title="Our Tools & Features" subtitle="A complete suite of tools for jersey production workflows." />
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a key={tool.title} href={tool.href} className="group rounded-[18px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(7,23,43,0.96),rgba(3,13,26,0.96))] p-4 transition hover:-translate-y-1 hover:border-sky-400/35">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/8 text-cyan-400"><Icon className="h-5 w-5" /></div>
                    <h3 className="mt-4 font-bold">{tool.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/55">{tool.text}</p>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="mt-5">
            <SectionTitle title="How It Works — Technical Pipeline" subtitle="A structured workflow that combines AI, pattern systems and production review." />
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {pipeline.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.number} className="rounded-[18px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(7,23,43,0.96),rgba(3,13,26,0.96))] p-4">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#0c87ff,#31d1ff)] font-black text-white">{item.number}</div>
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h3 className="mt-3 font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/55">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-4 grid gap-3 lg:grid-cols-5">
            {stack.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-[18px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(7,23,43,0.96),rgba(3,13,26,0.96))] p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/8 text-cyan-400"><Icon className="h-5 w-5" /></div>
                  <div><h3 className="text-sm font-bold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-white/50">{item.text}</p></div>
                </div>
              );
            })}
          </section>

          <section className="mt-5 rounded-[22px] border border-amber-400/45 bg-[linear-gradient(90deg,rgba(69,42,3,0.75),rgba(29,18,3,0.65))] p-5 shadow-[0_12px_45px_rgba(245,158,11,0.12)]">
            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.25fr]">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-1 h-7 w-7 shrink-0 text-amber-300" />
                <div>
                  <h3 className="font-black text-amber-100">Important Notice & License Information</h3>
                  <p className="mt-1 text-xs leading-5 text-amber-100/65">Please review the following information carefully before using My Jersey Studio.</p>
                </div>
              </div>

              <Notice text="This is a production-based model and is currently available only for My Jersey." />
              <Notice text="To create your own customized system, contact the developer." />
              <Notice text="If unusual behavior or suspicious IP traces are detected, your license may be cancelled." />
              <Notice text="Review all outputs carefully before final production. Verify designs, measurements and details for your specific production needs." />
            </div>
          </section>

          <footer className="mt-5 flex flex-col gap-3 border-t border-white/8 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>My Jersey Studio • Production Workspace</span>
            <a href="https://www.facebook.com/share/1H4UxPjq4q/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-400">
              Developer Facebook <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3"><span className="h-1 w-8 rounded-full bg-cyan-400" /><h2 className="text-2xl font-black">{title}</h2></div>
      <p className="text-xs text-white/42">{subtitle}</p>
    </div>
  );
}

function Tag({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/5 px-3 py-2 text-xs font-semibold text-white/75"><span className="text-cyan-400">{icon}</span>{text}</div>;
}

function Notice({ text }: { text: string }) {
  return <div className="border-amber-300/15 lg:border-l lg:pl-4"><p className="text-xs leading-5 text-amber-100/75">{text}</p></div>;
}

function HeroStudioArtwork() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[24px] border border-sky-400/15 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.18),transparent_34%),linear-gradient(135deg,#07182d,#04101f)] p-5">
      <div className="absolute -right-10 top-4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-4">
        <div className="flex justify-center">
          <svg viewBox="0 0 250 310" className="h-[260px] w-[220px] drop-shadow-[0_25px_35px_rgba(0,153,255,0.30)]" fill="none">
            <path d="M72 28L52 49L28 59V288H222V59L198 49L178 28H72Z" fill="#071c34" stroke="#0ea5ff" strokeWidth="4"/>
            <path d="M72 28L92 52H158L178 28" fill="#03101f" stroke="#0ea5ff" strokeWidth="4"/>
            <path d="M61 72L98 116L112 72L127 115L143 72L191 128" stroke="#0b8cff" strokeWidth="8" opacity=".7"/>
            <path d="M46 148L88 108L113 155L144 111L204 171" stroke="#22d3ee" strokeWidth="5" opacity=".7"/>
            <path d="M50 229L96 181L125 226L152 180L201 234" stroke="#0ea5ff" strokeWidth="5" opacity=".65"/>
            <text x="125" y="168" textAnchor="middle" fill="white" fontSize="36" fontWeight="800">MJ</text>
            <text x="125" y="196" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700">MY JERSEY</text>
            <text x="125" y="214" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">STUDIO</text>
          </svg>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-sky-400/20 bg-white/[0.03] p-3">
            <svg viewBox="0 0 220 130" className="h-[120px] w-full">
              <rect x="10" y="10" width="200" height="110" rx="16" fill="#061323" stroke="#0ea5ff" strokeOpacity=".4"/>
              <path d="M65 28L52 41L38 46V105H102V46L88 41L75 28H65Z" fill="#0c2748" stroke="#4ac9ff" strokeWidth="2"/>
              <path d="M142 28L129 41L115 46V105H179V46L165 41L152 28H142Z" fill="#08182c" stroke="#755dff" strokeWidth="2"/>
              <path d="M49 70H91M126 70H168" stroke="#22d3ee" strokeWidth="3"/>
            </svg>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['#0ea5ff','#2563eb','#64748b','#020617'].map((color) => <div key={color} className="h-12 rounded-xl border border-white/10" style={{ backgroundColor: color }} />)}
          </div>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 text-center text-xs font-bold text-cyan-200">Image → Vector • Production Ready</div>
        </div>
      </div>
    </div>
  );
}

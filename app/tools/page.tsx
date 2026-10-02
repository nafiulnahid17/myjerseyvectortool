import { ArrowLeft, ArrowRight, FileCog, Image as ImageIcon, Layers3, PackageOpen, Search, ShieldCheck, Sparkles, SquarePen } from 'lucide-react';

const tools = [
  { title: 'Image to Vector', href: '/image-to-vector', description: 'Upload a jersey, choose a production pattern, generate, customize, preview, and export.', icon: ImageIcon, active: true },
  { title: 'Oneclick Creation', href: '/oneclick-creation', description: 'Planned automated production workflow.', icon: Sparkles, active: false },
  { title: 'File Converter', href: '/file-converter', description: 'Planned production file conversion workspace.', icon: FileCog, active: false },
  { title: 'Edit Existing File', href: '/edit-existing-file', description: 'Planned editor for existing jersey artwork.', icon: SquarePen, active: false },
  { title: 'Fallback Backup', href: '/backup', description: 'Planned project backup and recovery workspace.', icon: ShieldCheck, active: false },
  { title: 'Mockup Generator', href: '/mockup-generator', description: 'Planned jersey presentation and mockup workspace.', icon: PackageOpen, active: false },
  { title: 'FrontScan', href: '/frontscan', description: 'OCR-powered front artwork scan for text, typography, placement, and production details.', icon: Search, active: false },
  { title: 'BatchForge', href: '/batchforge', description: 'Batch production workspace for names, numbers, quantities, sizes, and repeated jersey outputs.', icon: Layers3, active: false },
  { title: 'ExportPack', href: '/exportpack', description: 'Prepare production-ready export bundles across editable and delivery formats.', icon: PackageOpen, active: false },
  { title: 'OrderSheet', href: '/ordersheet', description: 'Build structured production order sheets from customer and batch requirements.', icon: FileCog, active: false },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 hover:bg-white/[0.06]">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </a>
        <p className="mt-9 text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">My Jersey Studio</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Tools</h1>
        <p className="mt-4 max-w-2xl text-white/55">Only implemented features are marked active. Planned tools open a connected status page instead of a broken route or fake interface.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a key={tool.title} href={tool.href} className="group rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#07111f,#040b16)] p-5 transition hover:-translate-y-1 hover:border-sky-400/30">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300"><Icon className="h-6 w-6" /></span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tool.active ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/[0.03] text-white/45'}`}>{tool.active ? 'Available' : 'Planned'}</span>
                </div>
                <h2 className="mt-5 text-2xl font-bold">{tool.title}</h2>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/52">{tool.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}


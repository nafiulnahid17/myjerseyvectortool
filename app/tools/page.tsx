import {
  ArrowLeft,
  ArrowRight,
  FileCog,
  FileImage,
  Image as ImageIcon,
  Layers3,
  PackageOpen,
  Search,
  ShieldCheck,
  Sparkles,
  SquarePen,
} from 'lucide-react';

type ToolCategory = 'AI Powered Tools' | 'Elements Tools' | 'Emergency Tools';

const categoryOrder: ToolCategory[] = [
  'AI Powered Tools',
  'Elements Tools',
  'Emergency Tools',
];

const tools = [
  { category: 'AI Powered Tools' as const, title: 'VectorForge', href: '/image-to-vector', description: 'Upload a jersey, generate the production vector, customize, preview, and export.', icon: ImageIcon, active: true },
  { category: 'AI Powered Tools' as const, title: 'AutoPilot', href: '/oneclick-creation', description: 'Automated one-click jersey production workflow.', icon: Sparkles, active: false },
  { category: 'AI Powered Tools' as const, title: 'VectorLab', href: '/edit-existing-file', description: 'Edit and customize an existing jersey artwork or production file.', icon: SquarePen, active: false },
  { category: 'AI Powered Tools' as const, title: 'Showcase AI', href: '/mockup-generator', description: 'Create presentation-ready jersey mockups and previews.', icon: PackageOpen, active: false },
  { category: 'AI Powered Tools' as const, title: 'FrontScan', href: '/frontscan', description: 'OCR-powered front artwork scan for typography, placement, and production details.', icon: Search, active: false },
  { category: 'AI Powered Tools' as const, title: 'BatchForge', href: '/batchforge', description: 'Batch production workspace for names, numbers, quantities, sizes, and repeated outputs.', icon: Layers3, active: false },
  { category: 'AI Powered Tools' as const, title: 'OrderSheet', href: '/ordersheet', description: 'Build structured production order sheets from real customer and batch requirements.', icon: FileCog, active: false },

  { category: 'Elements Tools' as const, title: 'AssetForge', href: '/design-elements', description: 'Manage logos, fonts, graphics, trims, collars, patterns, and reusable design assets.', icon: Layers3, active: false },
  { category: 'Elements Tools' as const, title: 'DesignVault', href: '/templates', description: 'Production templates and uploaded pattern library.', icon: FileImage, active: false },
  { category: 'Elements Tools' as const, title: 'ConvertX', href: '/file-converter', description: 'Convert production files across supported raster, document, and editable vector formats.', icon: FileCog, active: false },
  { category: 'Elements Tools' as const, title: 'ExportPack', href: '/exportpack', description: 'Prepare production-ready export bundles across editable and delivery formats.', icon: PackageOpen, active: false },

  { category: 'Emergency Tools' as const, title: 'RescueX', href: '/backup', description: 'Fallback setup, recovery, and emergency backup workspace.', icon: ShieldCheck, active: false },
  { category: 'Emergency Tools' as const, title: 'TraceDesk', href: '/manual-vector-tracing', description: 'Manual vector tracing for precision path cleanup and artwork reconstruction.', icon: SquarePen, active: false },
  { category: 'Emergency Tools' as const, title: 'ColorDesk', href: '/colour-editor', description: 'Manual fill, stroke, palette, recolor, and print-colour controls.', icon: Layers3, active: false },
  { category: 'Emergency Tools' as const, title: 'CutPrep', href: '/manual-production-cut-setup', description: 'Manual production panel placement, cut-line setup, spacing, and sublimation layout controls.', icon: FileImage, active: false },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </a>

        <p className="mt-9 text-sm font-semibold uppercase tracking-[0.24em] text-sky-400">
          My Jersey Studio
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Tools</h1>
        <p className="mt-4 max-w-3xl text-white/55">
          Production tools are organized into AI Powered Tools, Elements Tools, and Emergency Tools. Existing routes and workflows are preserved.
        </p>

        <div className="mt-9 space-y-10">
          {categoryOrder.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category);

            return (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-black">{category}</h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-white/45">
                    {categoryTools.length}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <a
                        key={tool.title}
                        href={tool.href}
                        className="group rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#07111f,#040b16)] p-5 transition hover:-translate-y-1 hover:border-sky-400/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sky-300">
                            <Icon className="h-6 w-6" />
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              tool.active
                                ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                                : 'border-white/10 bg-white/[0.03] text-white/45'
                            }`}
                          >
                            {tool.active ? 'Available' : 'Planned'}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-bold">{tool.title}</h3>
                        <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/52">
                          {tool.description}
                        </p>

                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                          Open
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

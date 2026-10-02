$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "My Jersey Studio - Click / Routing Recovery" -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan

$root = Get-Location

function Patch-Links([string]$relativePath) {
    $path = Join-Path $root $relativePath
    if (-not (Test-Path $path)) {
        Write-Host "SKIP: $relativePath not found" -ForegroundColor Yellow
        return
    }

    $backup = "$path.before-click-fix"
    if (-not (Test-Path $backup)) {
        Copy-Item $path $backup
    }

    $content = Get-Content -LiteralPath $path -Raw

    # Vinext/Workers deployments have occasionally left Next client navigation
    # unusable while the rendered page itself remains visible. Use native anchors
    # for all page-to-page navigation so navigation works even without hydration.
    $content = $content -replace "(?m)^import Link from 'next/link';\r?\n", ""
    $content = $content.Replace("<Link", "<a")
    $content = $content.Replace("</Link>", "</a>")

    # Decorative overlays must never intercept pointer input.
    $content = $content.Replace(
        'className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-85`}',
        'className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-85`}'
    )
    $content = $content.Replace(
        'className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]"',
        'className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]"'
    )

    Set-Content -LiteralPath $path -Value $content -Encoding UTF8
    Write-Host "PATCHED: $relativePath" -ForegroundColor Green
}

Patch-Links "components\dashboard\dashboard-shell.tsx"
Patch-Links "components\image-vector\image-to-vector-studio.tsx"
Patch-Links "app\tools\page.tsx"
Patch-Links "components\shared\feature-status-page.tsx"

# Ensure the two core routes are real pages, not a server redirect that can be
# unreliable across framework adapters.
$newProject = Join-Path $root "app\new-project\page.tsx"
@"
import { ImageToVectorStudio } from '@/components/image-vector/image-to-vector-studio';

export default function NewProjectPage() {
  return <ImageToVectorStudio />;
}
"@ | Set-Content -LiteralPath $newProject -Encoding UTF8
Write-Host "PATCHED: app\new-project\page.tsx" -ForegroundColor Green

# Add an ultra-simple route that lets the user confirm deployment/routing
# without depending on React client hydration.
$checkDir = Join-Path $root "app\route-check"
New-Item -ItemType Directory -Force -Path $checkDir | Out-Null
$checkPage = Join-Path $checkDir "page.tsx"
@"
export default function RouteCheckPage() {
  return (
    <main style={{minHeight:'100vh',background:'#020812',color:'white',padding:'40px',fontFamily:'Arial, sans-serif'}}>
      <div style={{maxWidth:'760px',margin:'0 auto',border:'1px solid #1e3a5f',borderRadius:'24px',padding:'28px',background:'#07111f'}}>
        <div style={{fontSize:'13px',letterSpacing:'0.18em',color:'#38bdf8',fontWeight:700}}>MY JERSEY STUDIO</div>
        <h1 style={{fontSize:'34px',margin:'10px 0'}}>Routing is active</h1>
        <p style={{color:'#a9b7ca',lineHeight:1.7}}>If you can see this page, the deployed Worker is serving application routes correctly.</p>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'24px'}}>
          <a href="/" style={{padding:'12px 18px',borderRadius:'14px',background:'#172033',color:'white',textDecoration:'none'}}>Dashboard</a>
          <a href="/image-to-vector" style={{padding:'12px 18px',borderRadius:'14px',background:'#0875ff',color:'white',textDecoration:'none'}}>Open Image to Vector</a>
          <a href="/new-project" style={{padding:'12px 18px',borderRadius:'14px',background:'#0b8bff',color:'white',textDecoration:'none'}}>New Project</a>
        </div>
      </div>
    </main>
  );
}
"@ | Set-Content -LiteralPath $checkPage -Encoding UTF8
Write-Host "ADDED: app\route-check\page.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "Patch applied." -ForegroundColor Cyan
Write-Host "Next run: pnpm run build:cloudflare" -ForegroundColor White

$ErrorActionPreference = "Stop"

$root = Get-Location
$target = Join-Path $root "components\dashboard\dashboard-shell.tsx"

if (-not (Test-Path $target)) {
  Write-Host "ERROR: components\dashboard\dashboard-shell.tsx not found." -ForegroundColor Red
  exit 1
}

$content = Get-Content -LiteralPath $target -Raw

if ($content -notmatch "\bCoins,") {
  $content = $content.Replace("  Cloud,`r`n  Crown,", "  Cloud,`r`n  Coins,`r`n  Crown,")
  $content = $content.Replace("  Cloud,`n  Crown,", "  Cloud,`n  Coins,`n  Crown,")
}

if ($content -notmatch "\bInfo,") {
  $content = $content.Replace("  Home,`r`n  Image as ImageIcon,", "  Home,`r`n  Info,`r`n  Image as ImageIcon,")
  $content = $content.Replace("  Home,`n  Image as ImageIcon,", "  Home,`n  Info,`n  Image as ImageIcon,")
}

$secondaryNeedleWindows = "  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },`r`n  { label: 'Settings', href: '/settings', icon: Settings },`r`n  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },"
$secondaryReplacementWindows = "  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },`r`n  { label: 'Topup AI Credits', href: '/topup-ai-credits', icon: Coins },`r`n  { label: 'Settings', href: '/settings', icon: Settings },`r`n  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },`r`n  { label: 'About Us', href: '/about-us', icon: Info },"

$secondaryNeedleUnix = "  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },`n  { label: 'Settings', href: '/settings', icon: Settings },`n  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },"
$secondaryReplacementUnix = "  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },`n  { label: 'Topup AI Credits', href: '/topup-ai-credits', icon: Coins },`n  { label: 'Settings', href: '/settings', icon: Settings },`n  { label: 'Help & Support', href: '/help-support', icon: CircleHelp },`n  { label: 'About Us', href: '/about-us', icon: Info },"

if ($content -notmatch "Topup AI Credits") {
  if ($content.Contains($secondaryNeedleWindows)) {
    $content = $content.Replace($secondaryNeedleWindows, $secondaryReplacementWindows)
  } elseif ($content.Contains($secondaryNeedleUnix)) {
    $content = $content.Replace($secondaryNeedleUnix, $secondaryReplacementUnix)
  } else {
    Write-Host "WARNING: sidebar secondary block was not matched." -ForegroundColor Yellow
  }
}

$hamburgerNeedleWindows = "                ['Pricing', '/upgrade', Crown],`r`n                ['Help & Support', '/help-support', CircleHelp],`r`n                ['Settings', '/settings', Settings],"
$hamburgerReplacementWindows = "                ['Pricing', '/upgrade', Crown],`r`n                ['Topup AI Credits', '/topup-ai-credits', Coins],`r`n                ['Help & Support', '/help-support', CircleHelp],`r`n                ['About Us', '/about-us', Info],`r`n                ['Settings', '/settings', Settings],"

$hamburgerNeedleUnix = "                ['Pricing', '/upgrade', Crown],`n                ['Help & Support', '/help-support', CircleHelp],`n                ['Settings', '/settings', Settings],"
$hamburgerReplacementUnix = "                ['Pricing', '/upgrade', Crown],`n                ['Topup AI Credits', '/topup-ai-credits', Coins],`n                ['Help & Support', '/help-support', CircleHelp],`n                ['About Us', '/about-us', Info],`n                ['Settings', '/settings', Settings],"

if ($content -notmatch "\['Topup AI Credits', '/topup-ai-credits'") {
  if ($content.Contains($hamburgerNeedleWindows)) {
    $content = $content.Replace($hamburgerNeedleWindows, $hamburgerReplacementWindows)
  } elseif ($content.Contains($hamburgerNeedleUnix)) {
    $content = $content.Replace($hamburgerNeedleUnix, $hamburgerReplacementUnix)
  } else {
    Write-Host "WARNING: hamburger menu block was not matched." -ForegroundColor Yellow
  }
}

Set-Content -LiteralPath $target -Value $content -Encoding UTF8

Write-Host ""
Write-Host "Menu update applied:" -ForegroundColor Cyan
Write-Host "  + Topup AI Credits" -ForegroundColor Green
Write-Host "  + About Us" -ForegroundColor Green
Write-Host ""

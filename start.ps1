$ErrorActionPreference = 'Stop'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js 20 or newer is required. Install it from https://nodejs.org/ and reopen PowerShell.'
}
$versionText = (& node --version).Trim().TrimStart('v')
$major = [int]($versionText.Split('.')[0])
if ($major -lt 20) { Write-Error "Node.js 20 or newer is required. Found $versionText." }
if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env from .env.example. Add provider keys to enable live integrations.' -ForegroundColor Yellow
}
Write-Host 'Starting Darshan''s Astrology World at http://127.0.0.1:4173' -ForegroundColor Cyan
npm start

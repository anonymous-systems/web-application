<#
.SYNOPSIS
    Starts the development servers for the project.

.DESCRIPTION
    This script initializes the development environment by starting the necessary servers.
    It is intended to be run in a PowerShell environment with pnpm installed in the project directory.

.NOTES
    Author: Aaron Jones
    Version: 1.0.2
    Last Updated: 2025-08-09
    Compatibility: PowerShell 5.1 and later.
#>
Write-Host "🚀 Initializing development environment..." -ForegroundColor Cyan
Write-Host "------------------------------"

Write-Host "Killing Firebase emulator ports... `n" -ForegroundColor Yellow
.\killPorts.ps1

Write-Host "Starting development servers... `n" -ForegroundColor Green
pnpm run dev:seed

Write-Host "------------------------------"
Write-Host "Script execution complete." -ForegroundColor Green
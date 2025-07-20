<#
.SYNOPSIS
    Starts the development servers for the project.

.DESCRIPTION
    This script initializes the development environment by starting the necessary servers.
    It is intended to be run in a PowerShell environment with pnpm installed in the project directory.

.NOTES
    Author: Aaron Jones
    Version: 1.0.0
    Last Updated: 2025-07-19
    Compatibility: PowerShell 5.1 and later.
#>
Write-Host "🚀 Initializing development environment..." -ForegroundColor Cyan
Write-Host "------------------------------"

pnpm dev

Write-Host "------------------------------"
Write-Host "Script execution complete." -ForegroundColor Green
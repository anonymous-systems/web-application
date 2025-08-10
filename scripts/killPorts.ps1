<#
.SYNOPSIS
    Finds and terminates processes running on the standard specifiec ports.

.DESCRIPTION
    This script identifies and forcibly stops any processes that are using the specified ports.
    It provides detailed output about the processes being terminated. It is recommended to run
    this script with Administrator privileges to ensure it can terminate all required processes.

.NOTES
    Author: Aaron Jones
    Version: 1.5
    Last Updated: 2025-07-19
    Compatibility: PowerShell 5.1 and later.
#>

#Requires -RunAsAdministrator

# Define the list of default ports used by Firebase Emulators
$firebasePorts = @{
    "Auth"         = 9099;
    "Functions"    = 5001;
    "Firestore"    = 8080;
    "Database"     = 9000;
    "Hosting"      = 5000;
    "Pub/Sub"      = 8085;
    "Storage"      = 9199;
    "Emulator Hub" = 4400;
    "UI"           = 4000;
}

$additionalPorts = @{
    "Frontend"     = 3000;
    "Admin"        = 3001;
}

Write-Host "🔍 Searching for processes on ports..." -ForegroundColor Cyan

# Get all TCp connections on the specified ports
$portsToScan = $firebasePorts.Values + $additionalPorts.Values
$connections = Get-NetTCPConnection -LocalPort $portsToScan -State Listen -ErrorAction SilentlyContinue

if ($null -eq $connections) {
    Write-Host "✅ No running processes found on the standard ports." -ForegroundColor Green
} else {
    # Get a unique list of process IDs to avoid trying to kill the same process multiple times
    $processIds = $connections.OwningProcess | Select-Object -Unique

    # Add if coleance for singular and plural
    Write-Host "Found $($processIds.Count) process(es) to terminate." -ForegroundColor Yellow
    
    foreach ($procId in $processIds) {
        try {
            Write-Host "Found PID => $procId"
            $process = Get-Process -Id $procId -ErrorAction Stop

            # Find which port(s) this specfic process is using from our list
            $portInfo = @()
            $connectionsForPid = $connection | Where-Object { $_.OwningProcess -eq $procId }
            Write-Host "Found $($connectionsForPid.Count) connections for pid ($procId)"

            foreach ($connection in $connectionsForPid) {
                $port = $connection.LocalPort
                $serviceEntry = $firebasePorts.GetEnumerator() | Where-Object { $_.Value -eq $port } | Select-Object -First 1
        
                if ($serviceEntry) {
                    $portInfo += "$($serviceEntry.Key) ($port)"
                } else {
                    $portInfo += "$port"
                }

            }

            $usedPorts = $portInfo -join ', '

            Write-Host "------------------------------"
            Write-Host "🔥 Terminating process..."
            Write-Host "   - Name: $($process.ProcessName)"
            Write-Host "   - PID: $procId"
            Write-Host "   - Listening on Port(s): $usedPorts"

            Stop-Process -Id $procId -Force -PassThru | ForEach-Object {
                Write-Host "✅ Successfully terminated '$_.ProcessName' (PID: $procId)." -ForegroundColor Green
            }
        } catch {
            Write-Warning "⚠️ Cound not stop process with PID $procId. It may have already been closed."
            Write-Warning "    Error details: $($_.Exception.Message)"
        }
    }
}

Write-Host "------------------------------"
Write-Host "Script execution complete."
$ports = @(
    9099,
    5000,
    5001,
    8080,
    9000,
    8085,
    9199,
    4000,
    4001
)

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $process.Id -Force
        }
    }
}
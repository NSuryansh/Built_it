# Load environment variables from .env file
Get-Content "backup.env" | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]*)\s*=\s*(.*)\s*$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Use the env vars
$env:PGHOST = $env:DATABASE_HOST
$env:PGDATABASE = $env:DATABASE_NAME
$env:PGUSER = $env:DATABASE_USER
$env:PGPASSWORD = $env:DATABASE_PASSWORD
$env:PGPORT = $env:DATABASE_PORT

$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$DEST = "C:\Kartikey\built-it\Built_it\backend\backups"
$localFile = "$DEST\$TIMESTAMP.sql"

if (-not (Test-Path $DEST)) {
    New-Item -Path $DEST -ItemType Directory
}

pg_dump --file=$localFile

Write-Output "Backup completed: $localFile"

$rclonePath = "C:\Users\Kartikey Raghav\Downloads\rclone-v1.69.2-windows-amd64\rclone-v1.69.2-windows-amd64\rclone.exe"
$remotePath = "bucket:/Built-it Backups"

& $rclonePath copy $localFile $remotePath

Write-Output "Upload to Google Drive completed."

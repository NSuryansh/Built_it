# Set variables

$PGHOST=$env:DATABASE_HOST
$PGDATABASE='neondb'
$PGUSER='neondb_owner'
$PGPASSWORD=$env:DATABASE_PASSWORD
$env:PGPASSWORD = $PGPASSWORD  # Export env var for pg_dump

$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$DEST = "C:\Kartikey\built-it\Built_it\backend\neon-backups\backups"
$localFile = "$DEST\$TIMESTAMP.sql"

# Create directory if not exists
if (-not (Test-Path $DEST)) {
    New-Item -Path $DEST -ItemType Directory
}

# Run pg_dump (ensure pg_dump is in PATH or use full path)
pg_dump --username=$PGUSER `
        --host=$PGHOST `
        --port=5432 `
        --dbname=$PGDATABASE `
        --file=$localFile

Write-Output "Backup completed: $localFile"

# Upload using rclone
$rclonePath = "C:\Users\Kartikey Raghav\Downloads\rclone-v1.69.2-windows-amd64\rclone-v1.69.2-windows-amd64\rclone.exe"
$remotePath = "bucket:/MyBackups"

& $rclonePath copy $localFile $remotePath

Write-Output "Upload to Google Drive completed."

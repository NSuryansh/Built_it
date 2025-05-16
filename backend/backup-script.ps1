$PGHOST="ep-bold-bar-a8i49grg-pooler.eastus2.azure.neon.tech"
$PGDATABASE='neondb'
$PGUSER='neondb_owner'
$PGPASSWORD="npg_1ojmXkcEFw5I"

$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$DEST = "C:\Kartikey\built-it\Built_it\backend\backups"
$localFile = "$DEST\$TIMESTAMP.sql"

if (-not (Test-Path $DEST)) {
    New-Item -Path $DEST -ItemType Directory
}

pg_dump --username=$PGUSER `
        --host=$PGHOST `
        --port=5432 `
        --dbname=$PGDATABASE `
        --file=$localFile

Write-Output "Backup completed: $localFile"

$rclonePath = "C:\Users\Kartikey Raghav\Downloads\rclone-v1.69.2-windows-amd64\rclone-v1.69.2-windows-amd64\rclone.exe"
$remotePath = "bucket:/MyBackups"

& $rclonePath copy $localFile $remotePath

Write-Output "Upload to Google Drive completed."

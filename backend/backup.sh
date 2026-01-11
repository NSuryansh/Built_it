#!/usr/bin/env bash
set -e

# Load environment variables from backup.env
if [ -f "backup.env" ]; then
  export $(grep -v '^[[:space:]]*#' backup.env | xargs)
else
  echo "backup.env file not found!"
  exit 1
fi

# Use the env vars
export PGHOST="$DATABASE_HOST"
export PGDATABASE="$DATABASE_NAME"
export PGUSER="$DATABASE_USER"
export PGPASSWORD="$DATABASE_PASSWORD"
export PGPORT="$DATABASE_PORT"

# Timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Backup destination
DEST="/home/kartikey/Kartikey/Web Dev/Built_it/backend/backups"
LOCAL_FILE="$DEST/$TIMESTAMP.sql"

# Create backup directory if it does not exist
mkdir -p "$DEST"

# Run pg_dump
pg_dump --file="$LOCAL_FILE"

echo "Backup completed: $LOCAL_FILE"

# Rclone paths (Linux)
RCLONE_PATH="/usr/bin/rclone"
REMOTE_PATH="bucket:/Built-it Backups"

# Upload backup
"$RCLONE_PATH" copy "$LOCAL_FILE" "$REMOTE_PATH"

echo "Upload to Google Drive completed."

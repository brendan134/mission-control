# Backup & Restore

## Purpose
Create backups of workspace files, cron jobs, and configurations.
Restore from a backup archive.

## When to Use
- Before major system changes
- To protect against data loss on the VPS
- To move configuration to a new machine

## Commands

### Backup Workspace
```bash
# Navigate to the workspace root
cd /data/.openclaw/workspace

# Create a timestamped archive
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
tar -czvf backup_$TIMESTAMP.tar.gz .
echo "Backup created: backup_$TIMESTAMP.tar.gz"

# Optionally, also backup cron jobs
# (Requires access to cron config, which may vary based on VPS setup)
# Example: crontab -l > cron_backup_$TIMESTAMP.txt
```

### Restore Workspace
```bash
# IMPORTANT: This will overwrite existing files! Be careful.
# Upload your backup archive (e.g., backup_YYYY-MM-DD_HH-MM-SS.tar.gz) to the VPS.
# Navigate to the desired restoration directory (e.g., /data/.openclaw/workspace)
# untar -xzvf your_backup_archive.tar.gz
```

### Backup Cron Jobs (Example - requires adjustment)
```bash
# This is a simplified example. Actual cron setup varies by host.
# On Linux, crontab -l can list current jobs.
# To save them:
crontab -l > ~/cron_jobs_backup_$(date +"%Y-%m-%d_%H-%M-%S").txt
echo "Cron jobs backed up to ~/cron_jobs_backup_YYYY-MM-DD_HH-MM-SS.txt"
```

### Notes
- Ensure you have sufficient disk space for backups.
- Store backup archives securely, ideally off-site or in cloud storage.
- Regularly test the restore process to ensure backups are valid.

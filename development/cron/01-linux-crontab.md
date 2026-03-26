# 1) Linux user crontab (classic)

Best for: scripts on a VPS, Raspberry Pi, or WSL while the machine is running.

## Install cron (Debian / Ubuntu)

```bash
sudo apt update && sudo apt install -y cron
sudo systemctl enable --now cron
```

Check: `systemctl status cron`

## Edit jobs

```bash
crontab -e
```

## Format: five time fields plus command

```
minute hour day-of-month month day-of-week command
```

Example lines:

```cron
# Daily at 03:15
15 3 * * * /home/you/scripts/backup.sh

# Every 15 minutes
*/15 * * * * /home/you/scripts/poll.sh

# Mondays 09:00
0 9 * * 1 /home/you/scripts/report.sh
```

Use absolute paths. Optional header:

```cron
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
```

## Log output

```cron
15 3 * * * /home/you/scripts/backup.sh >> /home/you/logs/backup.log 2>&1
```

## Quick test (every minute)

```cron
* * * * * date >> /tmp/cron-test.log 2>&1
```

List jobs: `crontab -l`

## WSL

Cron only runs while WSL is running. For schedules when your PC is off, use GitHub Actions or a VPS.

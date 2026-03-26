# 6) Troubleshooting

## Crontab job never runs

1. `crontab -l` — is the line there?  
2. Use **full paths** to binaries and scripts.  
3. Check `PATH` — set `PATH=` at top of crontab.  
4. Redirect output: `>> /tmp/job.log 2>&1` and read the log.  
5. On Ubuntu, check `grep CRON /var/log/syslog` (may need sudo).

## GitHub Action did not run

1. Workflow file under `.github/workflows/` and **default branch** has the YAML.  
2. `on: schedule` uses **UTC**.  
3. Actions enabled: **Settings → Actions**.  
4. Forks: scheduled workflows are often **disabled** until enabled in the fork’s settings.

## Node scheduler “stops”

The process exited — use **PM2**, **systemd**, or Docker with **restart policy**, or move the schedule to **cron** / **GitHub Actions**.

## Permission denied

Scripts must be executable: `chmod +x script.sh`. For systemd, check `User=` and file ownership.

## Timezone confusion

- **cron** on Linux: usually **server local time** (see `timedatectl`).  
- **GitHub Actions**: **UTC** only in `schedule`.  
- **Node**: `Date` uses server timezone unless you use UTC libraries.

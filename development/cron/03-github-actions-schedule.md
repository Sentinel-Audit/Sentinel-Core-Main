# 3) GitHub Actions scheduled workflows

Best for: tasks tied to a GitHub repo without a server.

Official docs:  
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule

## Limits

- Schedules use **UTC**  
- Runs can be **delayed** under load  
- Free tier has **minute and storage limits**

## Setup

1. Create `.github/workflows/` in the repo  
2. Add a YAML file (see `examples/github-actions-schedule.yml`)  
3. Commit and push  
4. Open **Actions** tab to see runs

## Cron syntax in YAML (UTC)

```yaml
on:
  schedule:
    - cron: '15 3 * * *'    # 03:15 UTC daily
    - cron: '0 */6 * * *'   # every 6 hours
```

Put secrets in **Settings → Secrets and variables → Actions**, not in the file.

## Forks

Scheduled workflows may be **disabled** on forks until you enable them in the fork settings.

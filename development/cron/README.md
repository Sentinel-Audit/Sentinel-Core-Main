# Cron-style jobs — examples and setup

This folder collects simple ways to run tasks on a schedule: Linux cron, GitHub Actions schedule, Node schedulers, systemd timers, Docker.

**New here?** Start with **[QUICK-START.md](QUICK-START.md)** (four paths, minimal steps).

## Guides

- **01-linux-crontab.md** — User crontab on Linux or WSL  
- **02-systemd-timers.md** — systemd `.timer` plus `.service`  
- **03-github-actions-schedule.md** — Scheduled workflows on GitHub  
- **04-node-javascript-schedulers.md** — `node-cron`, `node-schedule`, BullMQ pointers  
- **05-docker-and-kubernetes.md** — Docker cron patterns, Kubernetes CronJob  
- **06-troubleshooting.md** — Common failures  

## Example files

- `examples/crontab.sample` — paste into `crontab -e`  
- `examples/github-actions-schedule.yml` — drop under `.github/workflows/`  
- `examples/node-schedule.mjs` — Node examples  
- `examples/systemd/` — sample unit files  

## Pick a stack

- **Own Linux server** — start with 01 or 02  
- **No server, GitHub only** — 03  
- **Node server always on** — 04  
- **Containers** — 05  

## References

- GitHub Actions schedule: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule  
- node-cron: https://github.com/node-cron/node-cron  
- node-schedule: https://github.com/node-schedule/node-schedule  
- BullMQ: https://github.com/taskforcesh/bullmq  
- systemd.timer: https://www.freedesktop.org/software/systemd/man/systemd.timer.html  

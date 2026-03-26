# Quick start (pick one path)

## A) I have a Linux server and a shell script

1. Make the script executable: `chmod +x /path/to/script.sh`  
2. Run `crontab -e`  
3. Add one line from `examples/crontab.sample` (uncomment and fix paths)  
4. Save. Wait for the next run or use a `* * * * *` test line, then remove it  

Read **01-linux-crontab.md** for details.

## B) I only have GitHub (no server)

1. In your repo, create `.github/workflows/`  
2. Copy `examples/github-actions-schedule.yml` there (rename if you like)  
3. Push to GitHub  
4. Open **Actions** → confirm the workflow exists → **Run workflow** or wait for the cron time (UTC)  

Read **03-github-actions-schedule.md** for UTC and limits.

## C) I run a Node app 24/7

1. `npm install node-cron` (or `node-schedule`)  
2. Import and schedule in your server entry file (see **04-node-javascript-schedulers.md**)  
3. Keep the process alive with **PM2**, **systemd**, or Docker  

## D) I need systemd (Linux server, not crontab)

1. Copy `examples/systemd/example-job.service` and `example-job.timer` to `/etc/systemd/system/` (adjust names)  
2. Run `sudo systemctl daemon-reload`  
3. `sudo systemctl enable --now example-job.timer`  
4. `sudo systemctl list-timers`  

Read **02-systemd-timers.md**.

## Something broke

Open **06-troubleshooting.md**.

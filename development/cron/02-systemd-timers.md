# 2) systemd timers (Linux)

Best for: servers using systemd; logging and `systemctl` control.

## Concepts

- **`.service`** = what to run  
- **`.timer`** = when (schedule)

## Files (system)

Place under `/etc/systemd/system/` (requires sudo).

**my-job.service**

```ini
[Unit]
Description=My scheduled task
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/my-script.sh
User=deploy
```

**my-job.timer**

```ini
[Unit]
Description=Run my-job daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## Commands

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now my-job.timer
sudo systemctl list-timers --all
sudo journalctl -u my-job.service -n 50 --no-pager
```

See `examples/systemd/` for copies.  
Docs: https://www.freedesktop.org/software/systemd/man/systemd.timer.html

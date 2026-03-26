# 5) Docker & Kubernetes

## Docker: cron inside a container

Common pattern: **supervisord** or a **sidecar** that runs `cron`, or use **host crontab** that runs `docker compose run ...`.

Minimal Dockerfile idea (Debian base):

```dockerfile
RUN apt-get update && apt-get install -y cron
COPY crontab /etc/cron.d/app-cron
RUN chmod 0644 /etc/cron.d/app-cron && crontab /etc/cron.d/app-cron
CMD ["cron", "-f"]
```

Often simpler: **do not** run cron in the app container; run **one** scheduler container or use **host** `cron` / **systemd** to `docker run` on a schedule.

## Kubernetes: CronJob

Native resource for scheduled pods:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: example
spec:
  schedule: "0 3 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: job
              image: your-image:tag
              command: ["/bin/sh", "-c", "date"]
          restartPolicy: OnFailure
```

Docs: https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/

## Helm

Many charts expose `cronjob` or use **Helm hooks**; search your chart’s docs for `CronJob`.

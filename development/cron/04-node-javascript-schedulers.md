# 4) Node.js in-process schedulers

Best for: a **running** Node process (API, bot). If the process exits, schedules stop.

## node-cron (cron strings)

https://github.com/node-cron/node-cron

```bash
npm install node-cron
```

```js
import cron from 'node-cron';

cron.schedule('*/10 * * * *', () => {
  console.log('Every 10 minutes');
});
```

## node-schedule

https://github.com/node-schedule/node-schedule

```bash
npm install node-schedule
```

```js
import schedule from 'node-schedule';

schedule.scheduleJob({ hour: 3, minute: 15 }, () => {
  console.log('Daily at 03:15 local server time');
});
```

## setInterval (simple)

```js
setInterval(() => { doWork(); }, 60 * 60 * 1000); // hourly
```

## Production at scale

- **BullMQ** (Redis, repeat jobs): https://github.com/taskforcesh/bullmq  
- **Agenda** (Mongo): https://github.com/agenda/agenda  

See `examples/node-schedule.mjs`.

/**
 * Node 18+ ESM examples. Run: node examples/node-schedule.mjs
 * Install: npm install node-cron node-schedule
 */

// --- node-cron (cron syntax) ---
// import cron from 'node-cron';
// cron.schedule('*/2 * * * *', () => {
//   console.log('[node-cron] tick', new Date().toISOString());
// });

// --- node-schedule (object style) ---
// import schedule from 'node-schedule';
// schedule.scheduleJob({ second: 0 }, () => {
//   console.log('[node-schedule] every minute at :00', new Date().toISOString());
// });

// --- no deps: one-off interval ---
const id = setInterval(() => {
  console.log('[setInterval] tick', new Date().toISOString());
}, 5000);
setTimeout(() => clearInterval(id), 15000);

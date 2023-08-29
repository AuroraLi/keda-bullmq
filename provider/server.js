

import express from 'express';
import { dataSchedule } from './queue.js';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/', async (req, res) => {
	const job = await dataSchedule(Math.random()*100, Math.random(), 5000);
	res.json({jobId: job.id,});
	return;
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
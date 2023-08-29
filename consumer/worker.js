import { Worker } from 'bullmq';
import { REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.js';

const redisConfiguration = {
    connection: {
      host: REDIS_QUEUE_HOST,
      port: REDIS_QUEUE_PORT,
    }
  }
  

async function addNoise(job) {
  await new Promise(r => setTimeout(r, 20000));
  const { data, noise } = job.data;
  console.log(`adding ${noise} to ${data}.`);
  await job.updateData({realworlddata: data + noise}) ;
}

const worker = new Worker('dataSchedule', addNoise, redisConfiguration);

console.log("Worker started!");

worker.on('completed', job => {
  console.info(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});
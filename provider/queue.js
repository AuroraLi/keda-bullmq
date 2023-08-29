
import { Queue, Job } from 'bullmq';
import { REDIS_QUEUE_HOST, REDIS_QUEUE_PORT } from './config.js';

// Add your own configuration here
const redisConfiguration = {
  connection: {
    host: REDIS_QUEUE_HOST,
    port: REDIS_QUEUE_PORT,
  }
}

// const DEFAULT_REMOVE_CONFIG = {
// 	removeOnComplete: {
// 		age: 3600,
// 	},
// 	removeOnFail: {
// 		age: 24 * 3600,
// 	},
// };



const myQueue = new Queue('dataSchedule', redisConfiguration);

export async function dataSchedule(data, noise, delay) {
  return await myQueue.add('data', { data, noise },{
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 1000, // keep up to 1000 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // keep up to 24 hours
    },
    delay: delay },);
}

// emailSchedule("foo@bar.com", "Hello World!", 5000); // The email will be available for consumption after 5 seconds. 
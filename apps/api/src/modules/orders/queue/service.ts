import { Queue } from 'bullmq';
import { OrderEmailJobProps, QueueStats } from './types';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

export const emailQueue = new Queue('order-emails', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export class OrderQueueService {
  static async addOrderConfirmationJob(data: OrderEmailJobProps) {
    try {
      const job = await emailQueue.add('send-order-confirmation', data, {
        delay: 10000, 
        priority: 1,
      });
      
      console.log(`📧 Order email job added: ${job.id} for order: ${data.orderNumber}`);
      return job;
    } catch (error) {
      console.error('❌ Failed to add order email job:', error);
      throw error;
    }
  }

  static async getQueueStats(): Promise<QueueStats> {
    const waiting = await emailQueue.getWaiting();
    const active = await emailQueue.getActive();
    const completed = await emailQueue.getCompleted();
    const failed = await emailQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  static async retryFailedJobs() {
    const failedJobs = await emailQueue.getFailed();
    let retryCount = 0;

    for (const job of failedJobs) {
      try {
        await job.retry();
        retryCount++;
      } catch (error) {
        console.error(`Failed to retry job ${job.id}:`, error);
      }
    }

    console.log(`🔄 Retried ${retryCount} failed jobs`);
    return retryCount;
  }
}
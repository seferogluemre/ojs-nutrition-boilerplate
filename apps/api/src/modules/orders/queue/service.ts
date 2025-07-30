import { Queue } from 'bullmq';
import { OrderEmailJobProps, QueueStats } from './types';

// Redis bağlantı ayarları
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Email queue tanımı
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
  // Sipariş email job'ı ekle
  static async addOrderConfirmationJob(data: OrderEmailJobProps) {
    try {
      const job = await emailQueue.add('send-order-confirmation', data, {
        delay: 10000, // 10 saniye sonra gönder
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

  // Başarısız job'ları yeniden dene
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
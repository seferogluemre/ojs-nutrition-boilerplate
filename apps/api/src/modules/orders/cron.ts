import cron from '@elysiajs/cron';
import { OrderQueueService } from './queue/service';

export const queueMaintenanceCron = cron({
  name: 'queue-maintenance',
  pattern: '*/5 * * * *',
  run: async () => {
    try {
      console.log('🔧 Running queue maintenance...');
      
      const stats = await OrderQueueService.getQueueStats();
      console.log('📊 Queue Stats:', stats);
      
      if (stats.failed > 0) {
        console.log(`🔄 Found ${stats.failed} failed jobs, retrying...`);
        const retriedCount = await OrderQueueService.retryFailedJobs();
        console.log(`✅ Retried ${retriedCount} jobs successfully`);
      }
      
      if (stats.waiting > 100) {
        console.warn('⚠️ Queue is getting full! Waiting jobs:', stats.waiting);
      }
      
    } catch (error) {
      console.error('❌ Queue maintenance error:', error);
    }
  },
});

export const dailyCleanupCron = cron({
  name: 'daily-cleanup',
  pattern: '0 2 * * *',
  run: async () => {
    try {
      console.log('🧹 Running daily queue cleanup...');
      const stats = await OrderQueueService.getQueueStats();
      console.log('📊 After cleanup - Queue Stats:', stats);
    } catch (error) {
      console.error('❌ Daily cleanup error:', error);
    }
  },
});

console.log('⏰ Orders CRON jobs initialized');
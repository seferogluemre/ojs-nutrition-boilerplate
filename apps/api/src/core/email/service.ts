import { DeliveryEmailQueueService } from './queue/worker';
import { DeliverySuccessEmailJobProps, QRDeliveryEmailJobProps } from './types';

class EmailService {
     async sendQRDeliveryNotification(data: QRDeliveryEmailJobProps) {
        return await DeliveryEmailQueueService.addQRDeliveryNotificationJob(data);
    }

     async sendDeliverySuccessNotification(data: DeliverySuccessEmailJobProps) {
        return await DeliveryEmailQueueService.addDeliverySuccessNotificationJob(data);
    }

     async getQueueStats() {
        return await DeliveryEmailQueueService.getQueueStats();
    }

     async clearQueue() {
        return await DeliveryEmailQueueService.clearQueue();
    }
}

export const emailService = new EmailService();

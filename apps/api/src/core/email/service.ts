import { DeliveryEmailQueueService } from './queue/worker';
import { DeliverySuccessEmailJobProps, QRDeliveryEmailJobProps } from './types';

class EmailService {
    static async sendQRDeliveryNotification(data: QRDeliveryEmailJobProps) {
        return await DeliveryEmailQueueService.addQRDeliveryNotificationJob(data);
    }

    static async sendDeliverySuccessNotification(data: DeliverySuccessEmailJobProps) {
        return await DeliveryEmailQueueService.addDeliverySuccessNotificationJob(data);
    }

    static async getQueueStats() {
        return await DeliveryEmailQueueService.getQueueStats();
    }

    static async clearQueue() {
        return await DeliveryEmailQueueService.clearQueue();
    }
}

export const emailService = new EmailService();

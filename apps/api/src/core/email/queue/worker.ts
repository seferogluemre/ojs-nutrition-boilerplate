import { render } from '@react-email/render';
import { Job, Queue, Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { emailConfig } from '../config';
import { DeliverySuccess } from '../templates/delivery-success';
import { QRDeliveryNotification } from '../templates/qr-delivery-notification';
import { DeliverySuccessEmailJobProps, QRDeliveryEmailJobProps, QueueStats } from '../types';

const redisConnection = {
  host: emailConfig.redis.host,
  port: emailConfig.redis.port,
  password: emailConfig.redis.password,
};

// Email transporter setup
const transporter = nodemailer.createTransport(emailConfig.mailer.transport);

transporter.verify((error, _success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.info('SMTP Server is ready to take messages');
  }
});

export const deliveryEmailQueue = new Queue('delivery-emails', {
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

async function generateQRCodeDataURL(token: string): Promise<string> {
  try {
    const qrData = JSON.stringify({ token });
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 200,
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

async function sendQRDeliveryNotificationEmail(data: QRDeliveryEmailJobProps) {
  try {
    const qrCodeDataURL = await generateQRCodeDataURL(data.qrToken);
    
    const emailData = {
      trackingNumber: data.trackingNumber,
      customerName: data.customerName,
      qrCodeUrl: qrCodeDataURL,
      validationUrl: `${emailConfig.app.url}/validate`,
      orderNumber: data.orderNumber,
      company: {
        name: process.env.APP_NAME || 'OnlyJS Nutrition',
        url: emailConfig.app.url,
        logoUrl: '/public/email/logo.png',
      },
      footer: {
        links: [
          { text: 'Ana Sayfa', url: emailConfig.app.url },
          { text: 'Hakkımızda', url: `${emailConfig.app.url}/about` },
          { text: 'İletişim', url: `${emailConfig.app.url}/contact` },
        ],
        description: `©${new Date().getFullYear()} ${process.env.APP_NAME || 'OnlyJS Nutrition'}, Premium Spor Besın Takviyesi. Tüm hakları saklıdır.`,
        socialLinks: [
          {
            name: 'X',
            url: 'https://x.com',
            logoUrl: '/public/email/socials/x.png',
            alt: 'X',
          },
          {
            name: 'Facebook',
            url: 'https://facebook.com',
            logoUrl: '/public/email/socials/facebook.png',
            alt: 'Facebook',
          },
          {
            name: 'LinkedIn',
            url: 'https://linkedin.com',
            logoUrl: '/public/email/socials/linkedin.png',
            alt: 'LinkedIn',
          },
        ],
      },
    };

    const emailHtml = await render(QRDeliveryNotification(emailData));

    const mailOptions = {
      from: emailConfig.mailer.defaults.from,
      to: data.customerEmail,
      subject: `Siparişiniz Kapınızda! QR Kod ile Doğrulayın - ${data.trackingNumber}`,
      html: emailHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ QR Delivery notification sent to ${data.customerEmail} for tracking: ${data.trackingNumber}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send QR delivery notification for tracking: ${data.trackingNumber}`, error);
    throw error;
  }
}

async function sendDeliverySuccessEmail(data: DeliverySuccessEmailJobProps) {
  try {
    const emailData = {
      trackingNumber: data.trackingNumber,
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      deliveryDate: data.deliveryDate,
      items: data.items,
      company: {
        name: process.env.APP_NAME || 'OnlyJS Nutrition',
        url: emailConfig.app.url,
        logoUrl: '/public/email/logo.png',
      },
      footer: {
        links: [
          { text: 'Ana Sayfa', url: emailConfig.app.url },
          { text: 'Hakkımızda', url: `${emailConfig.app.url}/about` },
          { text: 'İletişim', url: `${emailConfig.app.url}/contact` },
        ],
        description: `©${new Date().getFullYear()} ${process.env.APP_NAME || 'OnlyJS Nutrition'}, Premium Spor Besın Takviyesi. Tüm hakları saklıdır.`,
        socialLinks: [
          {
            name: 'X',
            url: 'https://x.com',
            logoUrl: '/public/email/socials/x.png',
            alt: 'X',
          },
          {
            name: 'Facebook',
            url: 'https://facebook.com',
            logoUrl: '/public/email/socials/facebook.png',
            alt: 'Facebook',
          },
          {
            name: 'LinkedIn',
            url: 'https://linkedin.com',
            logoUrl: '/public/email/socials/linkedin.png',
            alt: 'LinkedIn',
          },
        ],
      },
    };

    const emailHtml = await render(DeliverySuccess(emailData));

    const mailOptions = {
      from: emailConfig.mailer.defaults.from,
      to: data.customerEmail,
      subject: `Teslimat Tamamlandı! 🎉 - ${data.trackingNumber}`,
      html: emailHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Delivery success notification sent to ${data.customerEmail} for tracking: ${data.trackingNumber}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send delivery success notification for tracking: ${data.trackingNumber}`, error);
    throw error;
  }
}

export const deliveryEmailWorker = new Worker(
  'delivery-emails',
  async (job: Job<QRDeliveryEmailJobProps | DeliverySuccessEmailJobProps>) => {
    console.log(`📨 Processing delivery email job: ${job.id} - ${job.name}`);
    
    try {
      switch (job.name) {
        case 'send-qr-delivery-notification':
          await sendQRDeliveryNotificationEmail(job.data as QRDeliveryEmailJobProps);
          break;
        case 'send-delivery-success-notification':
          await sendDeliverySuccessEmail(job.data as DeliverySuccessEmailJobProps);
          break;
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
      
      console.log(`✅ Delivery email sent successfully: ${job.name}`);
    } catch (error) {
      console.error(`❌ Failed to send delivery email: ${job.name}`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

deliveryEmailWorker.on('completed', async (job) => {
  console.log(`📬 Delivery email job ${job.id} completed`);
  await job.remove();
});

deliveryEmailWorker.on('failed', (job, err) => {
  console.error(`📭 Delivery email job ${job?.id} failed:`, err);
});

deliveryEmailWorker.on('error', (err) => {
  console.error('📭 Delivery email worker error:', err);
});

export class DeliveryEmailQueueService {
  static async addQRDeliveryNotificationJob(data: QRDeliveryEmailJobProps) {
    try {
      const job = await deliveryEmailQueue.add('send-qr-delivery-notification', data, {
        delay: 0, // Hemen gönder
        priority: 1, // Yüksek öncelik
      });

      console.log(`📨 QR Delivery notification job added: ${job.id} for tracking: ${data.trackingNumber}`);
      return job;
    } catch (error) {
      console.error('Failed to add QR delivery notification job:', error);
      throw error;
    }
  }

  static async addDeliverySuccessNotificationJob(data: DeliverySuccessEmailJobProps) {
    try {
      const job = await deliveryEmailQueue.add('send-delivery-success-notification', data, {
        delay: 0, // Hemen gönder
        priority: 2, // Normal öncelik
      });

      console.log(`📨 Delivery success notification job added: ${job.id} for tracking: ${data.trackingNumber}`);
      return job;
    } catch (error) {
      console.error('Failed to add delivery success notification job:', error);
      throw error;
    }
  }

  static async getQueueStats(): Promise<QueueStats> {
    try {
      const waiting = await deliveryEmailQueue.getWaiting();
      const active = await deliveryEmailQueue.getActive();
      const completed = await deliveryEmailQueue.getCompleted();
      const failed = await deliveryEmailQueue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      };
    } catch (error) {
      console.error('Failed to get queue stats:', error);
      throw error;
    }
  }

  static async clearQueue() {
    try {
      await deliveryEmailQueue.obliterate({ force: true });
      console.log('📭 Delivery email queue cleared');
    } catch (error) {
      console.error('Failed to clear queue:', error);
      throw error;
    }
  }
}
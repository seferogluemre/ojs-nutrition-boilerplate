import { prisma } from '#core';
import { Job, Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { OrderEmailJobProps } from './types';

// Redis bağlantı ayarları (service.ts ile aynı)
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Worker tanımı
export const orderEmailWorker = new Worker(
  'order-emails',
  async (job: Job<OrderEmailJobProps>) => {
    console.log(`📨 Processing email job: ${job.id} for order: ${job.data.orderNumber}`);
    
    try {
      switch (job.name) {
        case 'send-order-confirmation':
          await sendOrderConfirmationEmail(job.data);
          break;
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
      
      console.log(`✅ Email sent successfully for order: ${job.data.orderNumber}`);
    } catch (error) {
      console.error(`❌ Failed to send email for order: ${job.data.orderNumber}`, error);
      throw error; // BullMQ retry mekanizması için error'ı fırlat
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Aynı anda 5 email işle (yoğunluk kontrolü)
  }
);

async function sendOrderConfirmationEmail(data: OrderEmailJobProps) {
  const order = await prisma.order.findUnique({
    where: { uuid: data.orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    throw new Error(`Order not found: ${data.orderId}`);
  }

  const emailHtml = `
    <h1>Sipariş Onayı</h1>
    <p>Merhaba ${data.userName},</p>
    <p>Sipariş numaranız: <strong>${data.orderNumber}</strong></p>
    <p>Toplam tutar: <strong>${order.subtotal} TL</strong></p>
    <h3>Sipariş Detayları:</h3>
    <ul>
      ${order.items.map(item => 
        `<li>${item.product.name} - ${item.quantity} adet - ${item.totalPrice} TL</li>`
      ).join('')}
    </ul>
    <p>Siparişiniz en kısa sürede hazırlanacaktır.</p>
    <p>Teşekkür ederiz!</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@yoursite.com',
    to: data.userEmail,
    subject: `Sipariş Onayı - ${data.orderNumber}`,
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
}

// Worker event'leri
orderEmailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

orderEmailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

orderEmailWorker.on('error', (err) => {
  console.error('🚨 Worker error:', err);
});

console.log('📧 Order email worker started');
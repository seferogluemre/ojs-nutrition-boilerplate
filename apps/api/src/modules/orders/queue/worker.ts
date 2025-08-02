import prisma from "#core/prisma.ts";
import { render } from '@react-email/render';
import { Job, Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { OrderConfirmation } from '../../../emails/order-confirmation';
import { OrderEmailJobProps } from './types';

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
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, 
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

  const emailData = {
    orderNumber: order.orderNumber,
    userName: data.userName,
    orderDate: new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(order.createdAt)),
    items: order.items.map(item => ({
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    subtotal: order.subtotal,
    shippingAddress: order.shippingAddress ? {
      title: (order.shippingAddress as any).title || 'Teslimat Adresi',
      recipientName: (order.shippingAddress as any).recipientName,
      phone: (order.shippingAddress as any).phone,
      addressLine1: (order.shippingAddress as any).addressLine1,
      addressLine2: (order.shippingAddress as any).addressLine2,
      postalCode: (order.shippingAddress as any).postalCode,
      city: (order.shippingAddress as any).city,
      state: (order.shippingAddress as any).state,
      country: (order.shippingAddress as any).country,
    } : undefined,
    company: {
      name: process.env.APP_NAME || 'DJS NUTRITION',
      url: process.env.APP_URL || 'https://djsnutrition.com',
      logoUrl: '/public/email/logo.png',
    },
    footer: {
      links: [
        { text: 'Ana Sayfa', url: process.env.APP_URL || 'https://djsnutrition.com' },
        { text: 'Hakkımızda', url: (process.env.APP_URL || 'https://djsnutrition.com') + '/about' },
        { text: 'İletişim', url: (process.env.APP_URL || 'https://djsnutrition.com') + '/contact' },
      ],
      description: `©${new Date().getFullYear()} ${process.env.APP_NAME || 'DJS NUTRITION'}, Premium Spor Besın Takviyesi.
      
Tüm hakları saklıdır.`,
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

  const emailHtml = await render(OrderConfirmation(emailData));

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@djsnutrition.com',
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
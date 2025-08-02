export interface OrderEmailJobProps {
  orderId: string;
  userId: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';

export interface OrderEmailTemplateProps {
  orderNumber: string;
  userName: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingAddress?: {
    recipientName: string;
    addressLine1: string;
    city: string;
    country: string;
  };
  company: {
    name: string;
    url: string;
    logoUrl: string;
  };
}


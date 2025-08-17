export interface QRDeliveryEmailJobProps {
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  qrToken: string;
  orderNumber?: string;
}

export interface DeliverySuccessEmailJobProps {
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  deliveryDate: string;
  items?: Array<{
    productName: string;
    quantity: number;
  }>;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}
export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    primary_photo_url: string;
  };
  variant: {
    id: string;
    name: string;
  };
  added_at: string;
}

export interface CartData {
  id: string;
  items: CartItem[];
  summary: {
    total_items: number;
    total_quantity: number;
    subtotal: number;
  };
  updated_at: string;
}

export interface OrderSummaryProps {
  shippingCost: number;
}

export interface PaymentStepProps {
  onPrev: () => void;
  selectedAddress: any;
  shippingCost: number;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export interface ShippingStepProps {
  onNext: () => void;
  onPrev: () => void;
  selectedAddress: any;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
}

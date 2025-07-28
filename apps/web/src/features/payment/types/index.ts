import { Address } from "#/features/account/addresses/address-card";

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

export interface City {
  id: number;
  name: string;
  stateName: string;
  stateCode: string;
  countryCode: string;
  countryName: string;
}

export interface ApiResponse<T> {
  data: T[];
}

export interface AddressFormData {
  title: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  isDefault: boolean;
  cityId: number | null;
}

export interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  cardType: string;
  paymentType: string;
}

export interface OrderData {
  address_id: string;
  payment_type: string;
  card_digits: string;
  card_expiration_date: string;
  card_security_code: string;
  card_type: string;
}

export interface ShippingOption {
  id: number;
  name: string;
  duration: string;
  price: number;
}

// Component Props Interfaces
export interface AddressStepProps {
  onNext: () => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
}

export interface AddressFormProps {
  address?: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

export interface ShippingStepProps {
  onNext: () => void;
  onPrev: () => void;
  selectedAddress: Address | null;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
}

export interface PaymentStepProps {
  onPrev: () => void;
  selectedAddress: Address | null;
  shippingCost: number;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export interface OrderSummaryProps {
  shippingCost: number;
}

export interface StepIndicatorProps {
  currentStep: number;
}

// Re-export Address type for convenience
export type { Address };

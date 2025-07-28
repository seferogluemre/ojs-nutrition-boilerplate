export interface OrderFromAPI {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  itemCount: number;
  createdAt: string;
  firstProduct: {
    name: string;
    primary_photo_url: string;
  } | null;
  productDisplayText: string;
}

export interface OrderDetailAPI {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingAddress: {
    title: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      primary_photo_url: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price: string;
  size: string;
  image: string;
  productId?: string; // For api call
}

export interface OrderSummaryProps {
  order: {
    orderNumber: string;
    status: string;
    deliveryDate: string;
    products: Product[];
  };
}

export interface OrderSidebarProps {
  order: {
    address: {
      name: string;
      fullAddress: string;
    };
    payment: {
      method: string;
      cardNumber: string;
      summary: {
        subtotal: string;
        shipping: string;
        tax: string;
        discount: string;
        total: string;
      };
    };
  };
}

export type GetUserOrdersParams = {
  user_id: string;
};

export type GetOrderDetailParams = {
  user_id: string;
  order_id: string;
};

export type ShippingAddress = {
  title: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

export type CompleteOrderParams = {
  user_id: string;
  address_id?: string; // Optional
  payment_type: string;
  card_digits: string;
  card_expiration_date: string;
  card_security_code: string;
  card_type: string;
}; 
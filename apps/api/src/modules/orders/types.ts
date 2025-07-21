export type GetUserOrdersParams = {
  user_id: string;
};

export type GetOrderDetailParams = {
  user_id: string;
  order_id: string;
};

export type CompleteOrderParams = {
  user_id: string;
  address_id?: string; // Optional
  payment_type: string;
  card_digits: string;
  card_expiration_date: string;
  card_security_code: string;
  card_type: string;
}; 
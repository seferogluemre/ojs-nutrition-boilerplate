export type AddToCartParams = {
  customer_id: string;
  product_id:string;
  product_variant_id:string;
  quantity:number;
};

export type GetCartParams = {
  customer_id: string;
};

export type RemoveFromCartParams = {
  customer_id: string; // number değil string
  item_uuid: string;
};
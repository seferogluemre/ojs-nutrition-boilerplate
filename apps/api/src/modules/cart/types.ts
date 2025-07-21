export type AddToCartParams = {
  customer_id: number;
  product_id:string;
  product_variant_id:string;
  quantity:number;
};

export type GetCartParams = {
  customer_id: string;
};

export type RemoveFromCartParams = {
  customer_id: number;
  item_uuid: string;
};
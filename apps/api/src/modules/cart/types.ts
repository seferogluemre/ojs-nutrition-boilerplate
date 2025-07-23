export interface AddToCartParams {
  user_id: string;  
  product_id: string;
  product_variant_id?: string;
  quantity: number;
}

export interface GetCartParams {
  user_id: string;  
}

export interface RemoveFromCartParams {
  user_id: string;  
  item_uuid: string;
}
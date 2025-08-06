export interface BestSellerProduct {
  id: number;
  name: string;
  short_explanation: string;
  slug: string;
  price_info: {
    total_price: number;
    price_per_servings: number;
  };
  photo_src: string;
  comment_count: number;
  average_star: number;
  rating: number;
  total_price: number;
  image: string;
  discountPercentage: number;
}

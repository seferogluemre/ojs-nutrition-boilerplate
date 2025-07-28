export interface ProductVariant {
  id: string;
  name: string;
  size?: {
    pieces: number;
    total_services: number;
  };
  aroma?: string;
  price?: {
    profit: number | null;
    total_price: number;
    discounted_price: number | null;
    price_per_servings: number;
    discount_percentage: number | null;
  };
  photo_src?: string;
  is_available: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductPhoto {
  id: string;
  url: string;
  isPrimaryPhoto: boolean;
  order: number;
  fileSize: number;
}

export interface ProductExplanation {
  usage?: string;
  features?: string;
  description?: string;
  nutritional_content?: {
    ingredients?: {
      aroma: string | null;
      value: string;
    }[];
    nutrition_facts?: {
      ingredients: {
        name: string;
        amounts: string[];
      }[];
      portion_sizes: string[];
    };
    amino_acid_facts?: any;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_explanation: string;
  explanation?: ProductExplanation;
  main_category_id?: string;
  sub_category_id?: string;
  tags: string[];
  stock: number;
  variant: any;
  isActive: boolean;
  shortDescription: string;
  longDescription: string;
  price: number;
  primaryPhotoUrl: string;
  reviewCount: number;
  averageRating: number;
  category: ProductCategory;
  photos: ProductPhoto[];
  variants: ProductVariant[];
  comment_count: number;
  average_star: number;
  createdAt: string;
  updatedAt: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProductCommentResponse {
  id: string;
  title: string;
  content: string;
  rating: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

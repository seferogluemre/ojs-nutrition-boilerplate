export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  brand?: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  image?: string;
  attributes: {
    [key: string]: string;
  };
}

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  categoryId: string;
  brand?: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'draft';
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

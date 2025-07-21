import { Category, Product, ProductComments, ProductPhoto, ProductVariant } from '#prisma/client';
import { Static } from '@sinclair/typebox';

import {
  productCreateSchema,
  productIndexQuerySchema,
  productResponseSchema,
  productUpdateSchema,
} from './dtos';

// Database tipler
export type ProductWithRelations = Product & {
  category: Category;
  photos: ProductPhoto[];
  productVariants: ProductVariant[];
  comments: ProductComments[];
};

// DTO Response tipleri
export type ProductResponse = Static<typeof productResponseSchema>;
export type ProductCreatePayload = Static<typeof productCreateSchema>;
export type ProductUpdatePayload = Static<typeof productUpdateSchema>;
export type ProductIndexQuery = Static<typeof productIndexQuerySchema>;

// Photo upload tipi
export interface ProductPhotoUpload {
  file: File;
  isPrimaryPhoto?: boolean;
  order?: number;
}

// Service method parametreleri
export interface ProductCreateData extends Omit<ProductCreatePayload, 'photos'> {
  photos?: ProductPhotoUpload[];
}

export interface ProductUpdateData extends Omit<ProductUpdatePayload, 'photos'> {
  photos?: ProductPhotoUpload[];
}

// Arama ve filtreleme
export interface ProductFilters {
  categoryId?: number;
  isActive?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

// Sorting
export interface ProductSorting {
  field: 'createdAt' | 'price' | 'name' | 'averageRating' | 'reviewCount';
  direction: 'asc' | 'desc';
}

// Pagination
export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated Response
export interface PaginatedProductResponse {
  data: ProductResponse[];
  meta: ProductPagination;
}

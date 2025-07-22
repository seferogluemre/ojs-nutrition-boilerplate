import { BaseFormatter } from '../../utils';
import { productResponseSchema } from './dtos';
import { ProductResponse, ProductWithRelations } from './types';

export abstract class ProductFormatter {
  static response(data: ProductWithRelations): ProductResponse {
    // Manuel mapping yerine BaseFormatter.convertData kullan
    const convertedData = BaseFormatter.convertData<ProductResponse>(
      {
        id: data.uuid,
        name: data.name,
        slug: data.slug,
        stock: data.stock,
        variant: data.variant,
        isActive: data.isActive,
        shortDescription: data.shortDescription,
        price: data.price,
        primaryPhotoUrl: data.primaryPhotoUrl,
        reviewCount: data.reviewCount,
        averageRating: data.averageRating,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      productResponseSchema,
    );

    return convertedData;
  }

  // Minimal ürün response'u (listeleme için)
  static minimal(data: ProductWithRelations) {
    return {
      id: data.uuid,
      name: data.name,
      slug: data.slug,
      price: data.price,
      primaryPhotoUrl: data.primaryPhotoUrl,
      averageRating: data.averageRating,
      reviewCount: data.reviewCount,
      stock: data.stock,
      isActive: data.isActive,
      category: {
        id: data.category.uuid || data.category.id?.toString(), // Geçici fix
        name: data.category.name,
        slug: data.category.slug,
      },
    };
  }

  // Sepet için ürün formatı
  static forCart(data: ProductWithRelations) {
    return {
      id: data.uuid,
      name: data.name,
      slug: data.slug,
      price: data.price,
      primaryPhotoUrl: data.primaryPhotoUrl,
      stock: data.stock,
      isActive: data.isActive,
    };
  }

  static bestSeller(product: any) {
    return {
      name: product.name,
      short_explanation: product.shortDescription,
      slug: product.slug,
      price_info: {
        total_price: product.price,
        discounted_price: undefined,
        price_per_servings: Math.round((product.price / 20) * 100) / 100,
        discount_percentage: undefined,
      },
      photo_src: product.primaryPhotoUrl,
      comment_count: product.reviewCount,
      average_star: product.averageRating,
    };
  }
}

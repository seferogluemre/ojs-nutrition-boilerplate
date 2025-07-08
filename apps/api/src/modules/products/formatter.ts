import { BaseFormatter } from '../../utils';
import { productResponseSchema } from './dto';
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
        longDescription: data.longDescription,
        price: data.price,
        primaryPhotoUrl: data.primaryPhotoUrl,
        reviewCount: data.reviewCount,
        averageRating: data.averageRating,
        category: {
          id: data.category.uuid || data.category.id?.toString(),
          name: data.category.name,
          slug: data.category.slug,
        },
        photos: data.photos.map((photo) => ({
          id: photo.uuid,
          url: photo.url,
          isPrimaryPhoto: photo.isPrimaryPhoto,
          order: photo.order,
          fileSize: photo.fileSize,
        })),
        variants: data.productVariants.map((variant) => ({
          id: variant.uuid,
          name: variant.name,
        })),
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
}

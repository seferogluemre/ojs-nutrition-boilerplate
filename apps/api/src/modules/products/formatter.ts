import { ProductResponse, ProductWithRelations } from './types';

export abstract class ProductFormatter {
  static response(data: ProductWithRelations): ProductResponse {
    return {
      id: data.uuid,
      name: data.name,
      slug: data.slug,
      
      // 🔥 YENİ ALANLAR:
      short_explanation: data.shortDescription,
      explanation: data.explanation as any || undefined,
      main_category_id: data.mainCategoryId || undefined,
      sub_category_id: data.subCategoryId || undefined,
      tags: data.tags || [],
      
      // Mevcut alanlar
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
        id: data.category.uuid,
        name: data.category.name,
        slug: data.category.slug,
      },
      
      photos: data.photos?.map(photo => ({
        id: photo.uuid,
        url: photo.url,
        isPrimaryPhoto: photo.isPrimaryPhoto,
        order: photo.order,
        fileSize: photo.fileSize,
      })) || [],
      
      // 🔥 YENİ VARIANTS MAPPING:
      variants: data.productVariants?.map(variant => ({
        id: variant.uuid,
        name: variant.name,
        size: (variant.size as any) || { pieces: 1, total_services: 30 },
        aroma: variant.aroma || "Aromasız",
        price: (variant.price as any) || {
          profit: null,
          total_price: data.price,
          discounted_price: null,
          price_per_servings: Math.round((data.price / 30) * 100) / 100,
          discount_percentage: null
        },
        photo_src: variant.photoSrc || data.primaryPhotoUrl,
        is_available: variant.isAvailable ?? true
      })) || [],
      
      // Comments
      comment_count: data.reviewCount,
      average_star: data.averageRating,
      
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
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

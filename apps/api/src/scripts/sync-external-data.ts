import prisma from "../core/prisma";

// External API base URL
const API_BASE_URL = 'https://fe1111.projects.academy.onlyjs.com/api/v1'

// Types for external API responses
interface ExternalCategory {
  id?: string;
  name: string;
  slug: string;
  order: number;
  children?: ExternalCategory[];
  sub_children?: ExternalCategory[];
}

interface ExternalCategoriesResponse {
  status: string;
  data: {
    data: ExternalCategory[];
    status: string;
  };
}

interface ExternalProduct {
  id: string;
  name: string;
  slug: string;
  short_explanation: string;
  price_info: {
    total_price: number;
    discounted_price?: number;
    price_per_servings?: number;
    discount_percentage?: number;
  };
  photo_src: string;
  comment_count: number;
  average_star: number;
}

interface ExternalProductsResponse {
  status: string;
  data: ExternalProduct[];
}

interface ExternalProductDetail {
  id: string;
  name: string;
  slug: string;
  short_explanation: string;
  explanation: {
    usage?: string;
    features?: string;
    description?: string;
    nutritional_content?: any;
  };
  main_category_id: string;
  sub_category_id: string;
  tags: string[];
  variants: Array<{
    id: string;
    size: {
      pieces: number;
      total_services: number;
    };
    aroma: string;
    price: {
      total_price: number;
      discounted_price?: number;
      price_per_servings?: number;
      discount_percentage?: number;
    };
    photo_src: string;
    is_available: boolean;
  }>;
  comment_count: number;
  average_star: number;
}

interface ExternalProductDetailResponse {
  status: string;
  data: ExternalProductDetail;
}

const categoryMapping = new Map<string, { id: number, uuid: string }>();

const productUuidMapping = new Map<string, string>();

function createImageUrl(photoSrc: string | null): string {
  if (!photoSrc) return '';
  if (photoSrc.startsWith('http')) return photoSrc;
  const baseUrl = 'https://fe1111.projects.academy.onlyjs.com';
  return `${baseUrl}${photoSrc}`;
}

// Helper function to generate UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

// Delay function for API rate limiting
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch data from external API
async function fetchExternalAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🔍 API çağrısı: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`❌ API Hatası [${url}]:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

// Sync categories with hierarchy
async function syncCategories(): Promise<void> {
  console.log('🏗️  Kategori senkronizasyonu başlatılıyor...');

  try {
    const response = await fetchExternalAPI<ExternalCategoriesResponse>('/categories');
    const categories = response.data.data;

    console.log(`📦 ${categories.length} ana kategori bulundu`);

    // Process main categories
    for (const mainCategory of categories) {
      const mainCategoryUuid = generateUUID();

      // Try to find existing category by slug (more reliable than name)
      let dbMainCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: mainCategory.slug },
            { name: mainCategory.name }
          ]
        },
      });

      if (dbMainCategory) {
        // Update existing category
        dbMainCategory = await prisma.category.update({
          where: { id: dbMainCategory.id },
          data: {
            name: mainCategory.name,
            order: mainCategory.order,
          },
        });
      } else {
        // Create new category
        dbMainCategory = await prisma.category.create({
          data: {
            uuid: mainCategoryUuid,
            name: mainCategory.name,
            slug: mainCategory.slug,
            order: mainCategory.order,
          },
        });
      }

      // Store mapping if external category has ID
      if (mainCategory.id) {
        categoryMapping.set(mainCategory.id, { id: dbMainCategory.id, uuid: dbMainCategory.uuid });
      }

      console.log(`✅ Ana kategori: ${mainCategory.name}`);

      // Process children categories
      if (mainCategory.children) {
        for (const childCategory of mainCategory.children) {
          const childCategoryUuid = generateUUID();

          // Try to find existing child category by slug or name
          let dbChildCategory = await prisma.category.findFirst({
            where: {
              OR: [
                { slug: childCategory.slug },
                { name: childCategory.name }
              ]
            },
          });

          if (dbChildCategory) {
            // Update existing child category
            dbChildCategory = await prisma.category.update({
              where: { id: dbChildCategory.id },
              data: {
                name: childCategory.name,
                order: childCategory.order,
                parentId: dbMainCategory.id,
              },
            });
          } else {
            // Create new child category
            try {
              dbChildCategory = await prisma.category.create({
                data: {
                  uuid: childCategoryUuid,
                  name: childCategory.name,
                  slug: childCategory.slug,
                  order: childCategory.order,
                  parentId: dbMainCategory.id,
                },
              });
            } catch (error: any) {
              if (error.code === 'P2002') {
                // Handle unique constraint violation
                console.warn(`⚠️  Slug already exists: ${childCategory.slug}, skipping...`);
                continue;
              }
              throw error;
            }
          }
          if (childCategory.id) {
            categoryMapping.set(childCategory.id, { id: dbChildCategory.id, uuid: dbChildCategory.uuid });
          }

          console.log(`  ├─ Alt kategori: ${childCategory.name}`);

          // Process sub_children categories
          if (childCategory.sub_children) {
            for (const subChildCategory of childCategory.sub_children) {
              const subChildCategoryUuid = generateUUID();
              
              // Store product UUID mapping for sub_children (they are actually products)
              productUuidMapping.set(subChildCategory.slug, subChildCategoryUuid);

              // Try to find existing sub child category by slug or name
              let dbSubChildCategory = await prisma.category.findFirst({
                where: {
                  OR: [
                    { slug: subChildCategory.slug },
                    { name: subChildCategory.name }
                  ]
                },
              });

              if (dbSubChildCategory) {
                dbSubChildCategory = await prisma.category.update({
                  where: { id: dbSubChildCategory.id },
                  data: {
                    uuid: subChildCategoryUuid, // ÖNEMLİ: UUID'yi güncelle
                    name: subChildCategory.name,
                    order: subChildCategory.order,
                    parentId: dbChildCategory.id,
                  },
                });
              } else {
                try {
                  dbSubChildCategory = await prisma.category.create({
                    data: {
                      uuid: subChildCategoryUuid,
                      name: subChildCategory.name,
                      slug: subChildCategory.slug,
                      order: subChildCategory.order,
                      parentId: dbChildCategory.id,
                    },
                  });
                } catch (error: any) {
                  if (error.code === 'P2002') {
                    console.warn(`⚠️  Slug already exists: ${subChildCategory.slug}, skipping...`);
                    continue;
                  }
                  throw error;
                }
              }

              console.log(`    └─ Sub kategori (ürün): ${subChildCategory.name} (UUID: ${subChildCategoryUuid})`);
            }
          }
        }
      }
    }

    console.log(`✅ Kategori senkronizasyonu tamamlandı! (${categoryMapping.size} mapping)`);
  } catch (error) {
    console.error('❌ Kategori senkronizasyonu hatası:', error);
    throw error;
  }
}

async function syncProducts(): Promise<void> {
  console.log('📦 Ürün senkronizasyonu başlatılıyor...');

  try {
    const response = await fetchExternalAPI<ExternalProductsResponse>('/products');
    const products = response.data;

    console.log(`📦 ${products.length} ürün bulundu`);

    let processedCount = 0;

    for (const product of products) {
      try {
        console.log(`🔍 Ürün detayı çekiliyor: ${product.slug}`);

        const detailResponse = await fetchExternalAPI<ExternalProductDetailResponse>(`/products/${product.slug}`);
        const productDetail = detailResponse.data;

        const categoryInfo = categoryMapping.get(productDetail.sub_category_id);
        if (!categoryInfo) {
          console.warn(`⚠️  Kategori bulunamadı: ${productDetail.sub_category_id} (${product.name})`);
          continue;
        }
        const categoryId = categoryInfo.id;

        const totalStock = productDetail.variants.reduce((sum, variant) => sum + (variant.size.pieces || 0), 0);

        const productUuid = productUuidMapping.get(product.slug) || generateUUID();

        const explanation = {
          usage: productDetail.explanation.usage || null,
          features: productDetail.explanation.features || null,
          description: productDetail.explanation.description || null,
          nutritional_content: productDetail.explanation.nutritional_content || null,
        };

        let dbProduct = await prisma.product.findFirst({
          where: { name: product.name },
        });

        if (dbProduct) {
          dbProduct = await prisma.product.update({
            where: { id: dbProduct.id },
            data: {
              name: product.name,
              categoryId: categoryId,
              mainCategoryId: productDetail.main_category_id,
              subCategoryId: productDetail.sub_category_id,
              explanation: explanation,
              tags: productDetail.tags,
              stock: totalStock,
              price: Math.round(product.price_info.total_price * 100), // Convert to cents
              shortDescription: product.short_explanation?.substring(0, 50) || '',
              longDescription: (productDetail.explanation.description || product.short_explanation)?.substring(0, 250) || '',
              primaryPhotoUrl: createImageUrl(product.photo_src),
              reviewCount: product.comment_count,
              averageRating: Math.round(product.average_star),
              isActive: true,
            },
          });
        } else {
          try {
            dbProduct = await prisma.product.create({
              data: {
                uuid: productUuid,
                name: product.name,
                slug: product.slug,
                categoryId: categoryId,
                mainCategoryId: productDetail.main_category_id,
                subCategoryId: productDetail.sub_category_id,
                explanation: explanation,
                tags: productDetail.tags,
                stock: totalStock,
                price: Math.round(product.price_info.total_price * 100), // Convert to cents
                shortDescription: product.short_explanation?.substring(0, 50) || '',
                longDescription: (productDetail.explanation.description || product.short_explanation)?.substring(0, 250) || '',
                primaryPhotoUrl: createImageUrl(product.photo_src),
                reviewCount: product.comment_count,
                averageRating: Math.round(product.average_star),
                isActive: true,
              },
            });
          } catch (error: any) {
            if (error.code === 'P2002') {
              console.warn(`⚠️  Ürün slug'ı zaten mevcut: ${product.slug}, atlaniyor...`);
              continue;
            }
            throw error;
          }
        }

        const isSubChildrenProduct = productUuidMapping.has(product.slug);
        console.log(`✅ Ürün ${isSubChildrenProduct ? 'güncellendi/oluşturuldu (sub_children)' : 'oluşturuldu'}: ${product.name} (UUID: ${productUuid})`);

        console.log(`🔧 ${productDetail.variants.length} varyant işleniyor...`);

        for (const variant of productDetail.variants) {
          const variantPrice = {
            total_price: variant.price.total_price,
            discounted_price: variant.price.discounted_price || null,
            price_per_servings: variant.price.price_per_servings || null,
            discount_percentage: variant.price.discount_percentage || null,
          };

          const variantName = variant.aroma || 'Default';
          const dbVariant = await prisma.productVariant.findFirst({
            where: {
              productId: dbProduct.id,
              name: variantName,
            },
          });

          if (dbVariant) {
            await prisma.productVariant.update({
              where: { id: dbVariant.id },
              data: {
                size: variant.size,
                aroma: variant.aroma,
                price: variantPrice,
                photoSrc: createImageUrl(variant.photo_src),
                isAvailable: variant.is_available,
              },
            });
          } else {
            await prisma.productVariant.create({
              data: {
                uuid: generateUUID(),
                productId: dbProduct.id,
                name: variantName,
                size: variant.size,
                aroma: variant.aroma,
                price: variantPrice,
                photoSrc: createImageUrl(variant.photo_src),
                isAvailable: variant.is_available,
              },
            });
          }
        }

        processedCount++;

        if (processedCount % 5 === 0) {
          console.log(`⏱️  İlerleme: ${processedCount}/${products.length} ürün işlendi`);
        }

        await delay(100);

      } catch (error) {
        console.error(`❌ Ürün işleme hatası [${product.slug}]:`, error instanceof Error ? error.message : error);
        continue; 
      }
    }

    console.log(`✅ Ürün senkronizasyonu tamamlandı! ${processedCount}/${products.length} ürün işlendi`);

  } catch (error) {
    console.error('❌ Ürün senkronizasyonu hatası:', error);
    throw error;
  }
}

// Main sync function
async function main(): Promise<void> {
  const startTime = Date.now();

  console.log('🚀 Dış API senkronizasyonu başlatılıyor...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);

  try {
    await syncCategories();

    await syncProducts();

    const duration = Date.now() - startTime;
    console.log(`🎉 Senkronizasyon başarıyla tamamlandı! Süre: ${Math.round(duration / 1000)}s`);

  } catch (error) {
    console.error('💥 Senkronizasyon hatası:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.main) {
  main();
}

export { main as syncExternalData };


import prisma from "../core/prisma";

/**
 * Top Sellers Atama Script'i
 * 
 * Bu script her ana kategoride 2-3 ürünü top seller olarak işaretler.
 * Öncelik sırası:
 * 1. En yüksek average rating
 * 2. En yüksek review count  
 * 3. En düşük fiyat (eşitlik durumunda)
 */

async function assignTopSellers(): Promise<void> {
  console.log('🏆 Top Sellers atama işlemi başlatılıyor...');

  try {
    // Önce mevcut tüm top seller işaretlerini kaldır
    await prisma.product.updateMany({
      where: { isTopSeller: true },
      data: { isTopSeller: false }
    });
    console.log('🧹 Mevcut top seller işaretleri temizlendi');

    const mainCategories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        products: {
          where: { isActive: true },
          orderBy: [
            { averageRating: 'desc' },
            { reviewCount: 'desc' },
            { price: 'asc' }
          ]
        },
        children: {
          include: {
            products: {
              where: { isActive: true },
              orderBy: [
                { averageRating: 'desc' },
                { reviewCount: 'desc' },
                { price: 'asc' }
              ]
            }
          }
        }
      }
    });

    console.log(`📦 ${mainCategories.length} ana kategori bulundu`);

    let totalTopSellersAssigned = 0;

    for (const category of mainCategories) {
      console.log(`\n🏷️  Kategori işleniyor: ${category.name}`);
      
      // Bu kategorideki tüm ürünleri topla (direkt + alt kategorilerden)
      let allProducts = [...category.products];
      
      // Alt kategorilerdeki ürünleri ekle
      for (const childCategory of category.children) {
        allProducts.push(...childCategory.products);
      }

      // Ürünleri sırala: rating > review count > fiyat
      allProducts.sort((a, b) => {
        // Önce rating'e göre sırala (yüksekten düşüğe)
        if (a.averageRating !== b.averageRating) {
          return b.averageRating - a.averageRating;
        }
        
        // Rating eşitse review count'a göre sırala
        if (a.reviewCount !== b.reviewCount) {
          return b.reviewCount - a.reviewCount;
        }
        
        // Her ikisi de eşitse fiyata göre sırala (düşükten yükseğe)
        return a.price - b.price;
      });

      // Eğer kategori boşsa atla
      if (allProducts.length === 0) {
        console.log(`  ⚠️  Kategori boş, atlanıyor...`);
        continue;
      }

      // En fazla 3 ürünü top seller yap, ama kategori az ürünlüyse hepsini
      const topSellersCount = Math.min(3, allProducts.length);
      const topSellerProducts = allProducts.slice(0, topSellersCount);

      console.log(`  📊 ${allProducts.length} ürün içinden ${topSellersCount} tanesi top seller seçildi`);

      // Seçilen ürünleri top seller olarak işaretle
      for (const product of topSellerProducts) {
        await prisma.product.update({
          where: { id: product.id },
          data: { isTopSeller: true }
        });

        console.log(`    ✅ ${product.name} (Rating: ${product.averageRating}, Reviews: ${product.reviewCount}, Fiyat: ${product.price / 100}₺)`);
        totalTopSellersAssigned++;
      }
    }

    console.log(`\n🎉 Top Sellers atama tamamlandı! Toplam ${totalTopSellersAssigned} ürün işaretlendi`);

    // Son kontrol - kategoriler bazında özet
    console.log('\n📈 Kategori bazında özet:');
    for (const category of mainCategories) {
      const topSellersInCategory = await prisma.product.count({
        where: {
          isTopSeller: true,
          OR: [
            { categoryId: category.id },
            { category: { parentId: category.id } }
          ]
        }
      });
      
      console.log(`  ${category.name}: ${topSellersInCategory} top seller`);
    }

  } catch (error) {
    console.error('❌ Top Sellers atama hatası:', error);
    throw error;
  }
}

// Eğer script doğrudan çalıştırılıyorsa main fonksiyonu çalıştır
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    await assignTopSellers();
    
    const duration = Date.now() - startTime;
    console.log(`\n⏱️  İşlem süresi: ${Math.round(duration / 1000)}s`);
    
  } catch (error) {
    console.error('💥 Script hatası:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.main) {
  main();
}

export { assignTopSellers };

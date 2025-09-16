import { PrismaClient } from '../prisma/client/index.js'

const prisma = new PrismaClient()

async function clearTables() {
  try {
    console.log('Tabloları temizleme işlemi başlıyor...')
    
    // 1. Önce order_items tablosunu temizle (foreign key constraints nedeniyle)
    console.log('Order Items tablosu temizleniyor...')
    const deletedOrderItems = await prisma.orderItem.deleteMany({})
    console.log(`${deletedOrderItems.count} adet order item silindi`)
    
    // 2. Products tablosunu temizle
    console.log('Products tablosu temizleniyor...')
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`${deletedProducts.count} adet ürün silindi`)
    
    // 3. Son olarak categories tablosunu temizle
    console.log('Categories tablosu temizleniyor...')
    const deletedCategories = await prisma.category.deleteMany({})
    console.log(`${deletedCategories.count} adet kategori silindi`)
    
    console.log('✅ Tüm tablolar başarıyla temizlendi!')
    
  } catch (error) {
    console.error('❌ Hata oluştu:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearTables()
  .then(() => {
    console.log('İşlem tamamlandı')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script hata ile sonlandı:', error)
    process.exit(1)
  })

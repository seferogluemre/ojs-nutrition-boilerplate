import { Product, ProductFormData } from '../types/types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organik Elma',
    slug: 'organik-elma',
    description: 'Taze ve organik elma. Vitamin C açısından zengin.',
    price: 25.99,
    comparePrice: 29.99,
    sku: 'ORG-ELMA-001',
    barcode: '1234567890123',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Meyveler' },
    brand: 'Doğal Ürünler',
    status: 'active',
    stock: 150,
    trackQuantity: true,
    allowBackorder: false,
    weight: 0.2,
    dimensions: { length: 8, width: 8, height: 10 },
    images: ['/images/products/organic-apple.jpg'],
    tags: ['organik', 'meyve', 'vitamin'],
    seoTitle: 'Organik Elma - Doğal ve Taze',
    seoDescription: 'En taze organik elmalar. Vitamin C kaynağı.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Tam Buğday Ekmeği',
    slug: 'tam-bugday-ekmegi',
    description: 'Tam buğday unundan yapılmış, lif açısından zengin ekmek.',
    price: 8.50,
    sku: 'EKM-BUGDAY-001',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Ekmek & Unlu Mamuller' },
    brand: 'Fırın Evi',
    status: 'active',
    stock: 45,
    trackQuantity: true,
    allowBackorder: true,
    weight: 0.5,
    images: ['/images/products/whole-wheat-bread.jpg'],
    tags: ['ekmek', 'tam buğday', 'lif'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:15:00Z',
  },
  {
    id: '3',
    name: 'Organik Zeytinyağı',
    slug: 'organik-zeytinyagi',
    description: 'Soğuk sıkım organik zeytinyağı. Extra virgin kalitesinde.',
    price: 89.99,
    comparePrice: 99.99,
    sku: 'ZYG-ORG-500ML',
    barcode: '9876543210987',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Yağlar & Soslar' },
    brand: 'Ege Zeytini',
    status: 'active',
    stock: 25,
    trackQuantity: true,
    allowBackorder: false,
    weight: 0.5,
    dimensions: { length: 6, width: 6, height: 20 },
    images: ['/images/products/organic-olive-oil.jpg'],
    tags: ['zeytinyağı', 'organik', 'soğuk sıkım'],
    seoTitle: 'Organik Zeytinyağı - Extra Virgin',
    seoDescription: 'Soğuk sıkım organik zeytinyağı, en kaliteli zeytin meyvelerinden.',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-22T09:45:00Z',
  },
  {
    id: '4',
    name: 'Protein Tozu - Vanilya',
    slug: 'protein-tozu-vanilya',
    description: 'Yüksek kaliteli whey protein tozu, vanilya aromalı.',
    price: 299.99,
    sku: 'PROT-VAN-1KG',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Spor Gıdaları' },
    brand: 'FitLife',
    status: 'active',
    stock: 12,
    trackQuantity: true,
    allowBackorder: true,
    weight: 1.0,
    dimensions: { length: 15, width: 15, height: 25 },
    images: ['/images/products/protein-powder-vanilla.jpg'],
    tags: ['protein', 'spor', 'vanilya', 'whey'],
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
  },
  {
    id: '5',
    name: 'Organik Bal',
    slug: 'organik-bal',
    description: 'Doğal arı balı, katkısız ve organik sertifikalı.',
    price: 45.00,
    sku: 'BAL-ORG-500G',
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Tatlı & Şeker' },
    brand: 'Doğa Balı',
    status: 'inactive',
    stock: 0,
    trackQuantity: true,
    allowBackorder: false,
    weight: 0.5,
    images: ['/images/products/organic-honey.jpg'],
    tags: ['bal', 'organik', 'doğal'],
    createdAt: '2024-01-08T16:30:00Z',
    updatedAt: '2024-01-25T13:10:00Z',
  },
  {
    id: '6',
    name: 'Quinoa',
    slug: 'quinoa',
    description: 'Yüksek protein içerikli quinoa, süper gıda.',
    price: 35.99,
    sku: 'QUI-500G',
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Tahıllar & Bakliyat' },
    brand: 'Sağlıklı Yaşam',
    status: 'draft',
    stock: 30,
    trackQuantity: true,
    allowBackorder: true,
    weight: 0.5,
    images: ['/images/products/quinoa.jpg'],
    tags: ['quinoa', 'protein', 'süper gıda'],
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-01-23T15:45:00Z',
  },
];

// Simulated API functions
export const productsApi = {
  async getProducts(): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(product => product.id === id) || null;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      ...data,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const updatedProduct: Product = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockProducts[index] = updatedProduct;
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    mockProducts.splice(index, 1);
  },

  async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive' | 'draft'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockProducts.forEach(product => {
      if (ids.includes(product.id)) {
        product.status = status;
        product.updatedAt = new Date().toISOString();
      }
    });
  },
};

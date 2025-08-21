import { Category } from '../types/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    uuid: 'cat-1-uuid',
    name: 'Elektronik',
    slug: 'elektronik',
    order: 0,
    productCount: 156,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    children: [
      {
        id: '11',
        uuid: 'cat-11-uuid',
        name: 'Telefon',
        slug: 'telefon',
        parentId: '1',
        order: 0,
        productCount: 45,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '12',
        uuid: 'cat-12-uuid',
        name: 'Bilgisayar',
        slug: 'bilgisayar',
        parentId: '1',
        order: 1,
        productCount: 78,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    uuid: 'cat-2-uuid',
    name: 'Giyim',
    slug: 'giyim',
    order: 1,
    productCount: 89,
    isActive: true,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    children: [
      {
        id: '21',
        uuid: 'cat-21-uuid',
        name: 'Kadın Giyim',
        slug: 'kadin-giyim',
        parentId: '2',
        order: 0,
        productCount: 45,
        isActive: true,
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-10T14:20:00Z'
      },
      {
        id: '22',
        uuid: 'cat-22-uuid',
        name: 'Erkek Giyim',
        slug: 'erkek-giyim',
        parentId: '2',
        order: 1,
        productCount: 44,
        isActive: true,
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-10T14:20:00Z'
      }
    ]
  },
  {
    id: '3',
    uuid: 'cat-3-uuid',
    name: 'Ev & Yaşam',
    slug: 'ev-yasam',
    order: 2,
    productCount: 23,
    isActive: false,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    uuid: 'cat-4-uuid',
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    order: 3,
    productCount: 67,
    isActive: true,
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z'
  }
];

// API fonksiyonları (mock)
export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    // Gerçek API çağrısını simüle et
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCategories;
  },

  getCategory: async (id: string): Promise<Category | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories.find(cat => cat.id === id) || null;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      uuid: `cat-${Math.random().toString(36).substr(2, 9)}-uuid`,
      name: data.name || '',
      slug: data.slug || '',
      parentId: data.parentId,
      order: data.order || 0,
      productCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    return newCategory;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const category = mockCategories.find(cat => cat.id === id);
    if (!category) throw new Error('Kategori bulunamadı');
    
    return {
      ...category,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },

  deleteCategory: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock silme işlemi
  }
};

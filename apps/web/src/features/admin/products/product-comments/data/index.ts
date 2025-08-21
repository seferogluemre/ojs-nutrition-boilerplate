import { ProductComment } from '../types';

// Mock data for comments - gerçek API'den gelecek
export const mockComments: ProductComment[] = [
  {
    id: '1',
    title: 'Her zamanki kalite. Teşekkürler',
    content: 'Her zamanki kalite. Teşekkürler',
    rating: 5,
    images: [],
    user: {
      id: '1',
      name: 'Eren U.',
      maskedName: 'E***n U.'
    },
    createdAt: '2024-05-06T00:00:00Z',
    updatedAt: '2024-05-06T00:00:00Z'
  },
  {
    id: '2',
    title: 'Mükemmel ürün!',
    content: 'Ürünü çok beğendim. Kaliteli ve lezzetli. Kesinlikle tavsiye ederim. Paketleme de çok güzeldi.',
    rating: 5,
    images: ['/images/comment1.jpg', '/images/comment2.jpg'],
    user: {
      id: '2',
      name: 'Ayşe K.',
      maskedName: 'A***e K.'
    },
    createdAt: '2024-05-05T00:00:00Z',
    updatedAt: '2024-05-05T00:00:00Z'
  },
  {
    id: '3',
    title: 'İyi ama pahalı',
    content: 'Ürün kaliteli ama fiyatı biraz yüksek. Yine de memnun kaldım.',
    rating: 4,
    images: [],
    user: {
      id: '3',
      name: 'Mehmet Y.',
      maskedName: 'M***et Y.'
    },
    createdAt: '2024-05-04T00:00:00Z',
    updatedAt: '2024-05-04T00:00:00Z'
  },
  {
    id: '4',
    title: 'Ortalama',
    content: 'Beklentimi karşılamadı. Daha iyisini bekliyordum.',
    rating: 3,
    images: ['/images/comment3.jpg'],
    user: {
      id: '4',
      name: 'Fatma S.',
      maskedName: 'F***a S.'
    },
    createdAt: '2024-05-03T00:00:00Z',
    updatedAt: '2024-05-03T00:00:00Z'
  }
];

// API fonksiyonları - gerçek API entegrasyonu için
export const commentsApi = {
  async getComments(productId?: string): Promise<ProductComment[]> {
    // TODO: Gerçek API çağrısı yapılacak
    // return await api.get(`/products/${productId}/comments`);
    
    // Şimdilik mock data döndürüyoruz
    return Promise.resolve(mockComments);
  },

  async deleteComment(commentId: string): Promise<void> {
    // TODO: Gerçek API çağrısı yapılacak
    // return await api.delete(`/comments/${commentId}`);
    
    console.log('Yorum siliniyor:', commentId);
    return Promise.resolve();
  }
};

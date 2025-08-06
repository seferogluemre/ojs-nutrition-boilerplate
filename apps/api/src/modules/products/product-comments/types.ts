import { ProductComments, User } from '#prisma/client';

// Database types
export type ProductCommentsWithUser = ProductComments & {
  user: User;
};

// DTO types
export interface CommentIndexQuery {
  limit?: number;
  offset?: number;
}

export interface CommentCreatePayload {
  title?: string;
  content?: string;
  rating: number;
  images?: string[]; // Fotoğraf URL'leri
}

export interface CommentResponse {
  id: string;
  title: string | null;
  content: string | null;
  rating: number;
  images: string[]; // Fotoğraf URL'leri
  user: {
    id: string;
    name: string;
    maskedName: string; // Maskelenmiş isim
  };
  createdAt: Date;
  updatedAt: Date;
}

// Service method parameters
export interface GetCommentsParams {
  productId: string;
  page?: number;
  limit?: number;
}

export interface CreateCommentParams {
  productId: string;
  userId: string;
  data: CommentCreatePayload;
}

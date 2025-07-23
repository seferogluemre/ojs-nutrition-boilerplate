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
}

export interface CommentResponse {
  id: string;
  title: string | null;
  content: string | null;
  rating: number;
  user: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Service method parameters
export interface GetCommentsParams {
  productId: string;
  limit?: number;
  offset?: number;
}

export interface CreateCommentParams {
  productId: string;
  userId: string;
  data: CommentCreatePayload;
}

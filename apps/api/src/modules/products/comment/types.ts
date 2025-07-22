import { Customer, ProductComments } from '#prisma/client';

// Database types
export type ProductCommentWithRelations = ProductComments & {
  Customer: Customer;
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
  customer: {
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
  customerId: string;
  data: CommentCreatePayload;
}

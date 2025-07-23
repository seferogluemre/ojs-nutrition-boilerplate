import { CommentResponse, ProductCommentWithRelations } from './types';

export abstract class ProductCommentFormatter {
  static response(data: ProductCommentWithRelations): CommentResponse {
    return {
      id: data.uuid,
      title: data.title || null,
      content: data.content || null,
      rating: data.rating,
      customer: {
        id: data.Customer.uuid,
        name: data.Customer.name,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static list(data: ProductCommentWithRelations[]): CommentResponse[] {
    return data.map(this.response);
  }
}

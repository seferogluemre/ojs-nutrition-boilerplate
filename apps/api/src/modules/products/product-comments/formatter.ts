import { CommentResponse, ProductCommentsWithUser } from './types';

export abstract class ProductCommentFormatter {
  static response(data: ProductCommentsWithUser): CommentResponse {
    return {
      id: data.uuid,
      title: data.title || null,
      content: data.content || null,
      rating: data.rating,
      user: {
        id: data.user.id,
        name: data.user.name,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static list(data: ProductCommentsWithUser[]): CommentResponse[] {
    return data.map(this.response);
  }
}

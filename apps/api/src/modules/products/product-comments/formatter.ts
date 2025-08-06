import { CommentResponse, ProductCommentsWithUser } from './types';
import { CommentImageUploadService } from './upload-service';

export abstract class ProductCommentFormatter {

  private static maskName(fullName: string): string {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) {
      return fullName; // Tek isimse maskeleme
    }

    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    // Soyadın ilk harfi + uzunluğu kadar yıldız
    const maskedLastName = lastName.charAt(0) + '*'.repeat(lastName.length - 1);
    
    return `${firstName} ${maskedLastName}`;
  }

  /**
   * Fotoğraf yollarını public URL'lere çevirir
   */
  private static formatImageUrls(imagePaths: string[]): string[] {
    return imagePaths.map(path => CommentImageUploadService.getImageUrl(path));
  }

  static response(data: ProductCommentsWithUser): CommentResponse {
    return {
      id: data.uuid,
      title: data.title || null,
      content: data.content || null,
      rating: data.rating,
      images: this.formatImageUrls(data.images || []),
      user: {
        id: data.user.id,
        name: data.user.name,
        maskedName: this.maskName(data.user.name),
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static list(data: ProductCommentsWithUser[]): CommentResponse[] {
    return data.map(item => this.response(item));
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '../../../utils';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

// Extend for compatibility with File interface
type FileUpload = UploadedFile | File;

export class CommentImageUploadService {
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly MAX_FILES = 3;
  private static readonly UPLOAD_BASE_PATH = 'public/media/productComments';

  /**
   * Yorum fotoğraflarını yükler ve dosya yollarını döner
   */
  static async uploadCommentImages(
    productUuid: string,
    files: FileUpload[]
  ): Promise<string[]> {
    // Dosya sayısı kontrolü
    if (files.length > this.MAX_FILES) {
      throw new BadRequestException(`En fazla ${this.MAX_FILES} fotoğraf yükleyebilirsiniz.`);
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      // Dosya türü kontrolü
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        throw new BadRequestException(
          `Desteklenmeyen dosya türü: ${file.type}. Sadece JPG, PNG ve WebP dosyaları kabul edilir.`
        );
      }

      // Dosya boyutu kontrolü
      if (file.size > this.MAX_FILE_SIZE) {
        throw new BadRequestException(
          `Dosya boyutu çok büyük: ${file.name}. Maksimum ${this.MAX_FILE_SIZE / 1024 / 1024}MB olmalıdır.`
        );
      }

      // Dosya yükle
      const filePath = await this.saveFile(productUuid, file);
      uploadedPaths.push(filePath);
    }

    return uploadedPaths;
  }

  /**
   * Dosyayı belirtilen klasöre kaydeder
   */
  private static async saveFile(productUuid: string, file: FileUpload): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(file.type);
    const fileName = `${timestamp}_${random}.${extension}`;

    // Klasör yolu oluştur
    const folderPath = path.join(this.UPLOAD_BASE_PATH, productUuid);
    const fullFolderPath = path.join(process.cwd(), folderPath);

    // Klasör yoksa oluştur
    if (!fs.existsSync(fullFolderPath)) {
      fs.mkdirSync(fullFolderPath, { recursive: true });
    }

    // Dosya yolu
    const filePath = path.join(folderPath, fileName);
    const fullFilePath = path.join(process.cwd(), filePath);

    // Dosyayı kaydet
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(fullFilePath, buffer);

    // Relative path döner (database'de saklanacak)
    return filePath.replace(/\\/g, '/'); // Windows path separator'ü düzelt
  }

  /**
   * MIME type'dan dosya uzantısını alır
   */
  private static getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    return extensions[mimeType] || 'jpg';
  }

  /**
   * Yorum silindiğinde fotoğrafları da siler
   */
  static async deleteCommentImages(imagePaths: string[]): Promise<void> {
    for (const imagePath of imagePaths) {
      const fullPath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(`Failed to delete image: ${imagePath}`, error);
        }
      }
    }
  }

  /**
   * Fotoğraf URL'ini public URL'e çevirir
   */
  static getImageUrl(imagePath: string): string {
    // public/ prefix'ini kaldır ve API base URL ekle
    return imagePath.replace('public/', '/');
  }
}
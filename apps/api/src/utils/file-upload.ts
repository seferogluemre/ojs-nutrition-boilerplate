export interface FileUploadOptions {
  allowedTypes?: string[];
  maxSizeInMB?: number;
  uploadPath?: string;
  urlPrefix?: string;
}

export interface FileUploadResult {
  fileName: string;
  filePath: string;
  fileUrl: string;
}

export class FileUploadUtil {
  static async uploadProductPhoto(file: File, options: FileUploadOptions = {}): Promise<FileUploadResult> {
    const {
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSizeInMB = 5,
      uploadPath = 'public/productImages',
      urlPrefix = '/productImages'
    } = options;

    // 1. Validation
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Sadece JPG, PNG, WEBP formatları kabul edilir.');
    }

    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`Fotoğraf boyutu ${maxSizeInMB}MB'dan küçük olmalıdır.`);
    }

    // 2. 7 haneli random ID generate
    const randomId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${randomId}.${fileExtension}`;

    // 3. File paths
    const filePath = `${uploadPath}/${fileName}`;
    const fileUrl = `${urlPrefix}/${fileName}`;

    // 4. Save file
    await Bun.write(filePath, file);

    return {
      fileName,
      filePath,
      fileUrl
    };
  }
}

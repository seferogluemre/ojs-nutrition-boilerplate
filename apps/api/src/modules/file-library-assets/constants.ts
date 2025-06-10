import {
  FileLibraryAssetFileType,
  FileLibraryAssetMimeType,
  FileLibraryAssetType,
} from '#prisma/client';

export const FILE_LIBRARY_ASSET_IMAGE_RULES = {
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  maxSize: 10 * 1024 * 1024, // 10MB
};

export const FILE_LIBRARY_ASSET_VIDEO_RULES = {
  allowedMimeTypes: ['video/mp4', 'video/avi', 'video/mpeg', 'video/webm', 'video/ogg'],
  maxSize: 10 * 1024 * 1024, // 10MB
};

export const FILE_LIBRARY_ASSET_TYPE_RULES = {
  //PRODUCT_IMAGE
  [FileLibraryAssetType.PRODUCT_IMAGE]: {
    validationRules: FILE_LIBRARY_ASSET_IMAGE_RULES,
    pathPrefix: ['products', 'images'],
    fileType: FileLibraryAssetFileType.IMAGE,
  },
  //USER_IMAGE
  [FileLibraryAssetType.USER_IMAGE]: {
    validationRules: FILE_LIBRARY_ASSET_IMAGE_RULES,
    pathPrefix: ['users', 'images'],
    fileType: FileLibraryAssetFileType.IMAGE,
  },
  //SCHOOL_LOGO
  [FileLibraryAssetType.SCHOOL_LOGO]: {
    validationRules: FILE_LIBRARY_ASSET_IMAGE_RULES,
    pathPrefix: ['schools', 'logos'],
    fileType: FileLibraryAssetFileType.IMAGE,
  },
  //PRODUCT_BRAND_LOGO
  [FileLibraryAssetType.PRODUCT_BRAND_LOGO]: {
    validationRules: FILE_LIBRARY_ASSET_IMAGE_RULES,
    pathPrefix: ['product-brands', 'logos'],
    fileType: FileLibraryAssetFileType.IMAGE,
  },
  //SCHOOL_BRAND_LOGO
  [FileLibraryAssetType.SCHOOL_BRAND_LOGO]: {
    validationRules: FILE_LIBRARY_ASSET_IMAGE_RULES,
    pathPrefix: ['school-brands', 'logos'],
    fileType: FileLibraryAssetFileType.IMAGE,
  },
};

export const normalizeMimeType = (mimeType: string) => {
  const mimeTypesMapping = {
    //IMAGE
    'image/jpeg': FileLibraryAssetMimeType.IMAGE_JPEG,
    'image/png': FileLibraryAssetMimeType.IMAGE_PNG,
    'image/gif': FileLibraryAssetMimeType.IMAGE_GIF,
    'image/webp': FileLibraryAssetMimeType.IMAGE_WEBP,
    'image/svg+xml': FileLibraryAssetMimeType.IMAGE_SVG,
    'image/bmp': FileLibraryAssetMimeType.IMAGE_BMP,
    'image/tiff': FileLibraryAssetMimeType.IMAGE_TIFF,

    //VIDEO
    'video/mp4': FileLibraryAssetMimeType.VIDEO_MP4,
    'video/avi': FileLibraryAssetMimeType.VIDEO_AVI,
    'video/mpeg': FileLibraryAssetMimeType.VIDEO_MPEG,
    'video/webm': FileLibraryAssetMimeType.VIDEO_WEBM,
    'video/ogg': FileLibraryAssetMimeType.VIDEO_OGG,
  };

  return mimeTypesMapping[mimeType as keyof typeof mimeTypesMapping];
};

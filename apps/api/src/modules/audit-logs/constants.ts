import { PrismaModelNamePascalCase } from '#core/prisma.ts';

export enum AuditLogAction {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

export const AuditLogEntity = {
  USER: 'User',
  ROLE: 'Role',
  POST: 'Post',
  FILE_LIBRARY_ASSET: 'FileLibraryAsset',
  PRODUCT: 'Product',
  CATEGORY: 'Category',
  ORDER: 'Order',
  CART: 'Cart',
} as const satisfies Record<string, PrismaModelNamePascalCase>;

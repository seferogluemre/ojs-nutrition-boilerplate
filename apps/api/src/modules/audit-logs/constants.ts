import { PrismaModelNamePascalCase } from '#core';

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
} as const satisfies Record<string, PrismaModelNamePascalCase>;

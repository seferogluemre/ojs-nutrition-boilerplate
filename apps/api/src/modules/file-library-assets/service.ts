import { prisma } from '#/core';
import { Prisma } from '#prisma/client';
import fs from 'fs';
import path from 'path';

import { HandleError } from '#shared/error/handle-error';
import { NotFoundException } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { FILE_LIBRARY_ASSET_TYPE_RULES, normalizeMimeType } from './constants';
import { getFileLibraryAssetFilters } from './dtos';
import {
  FileLibraryAssetCreateInput,
  FileLibraryAssetIndexQuery,
  FileLibraryAssetUpdateInput,
} from './types';

export abstract class FileLibraryAssetsService {

  static async index(query: FileLibraryAssetIndexQuery) {
    try {
      const [hasFilters, filters, orderBy] = getFileLibraryAssetFilters(query);
      const { skip, perPage } = PaginationService.getPaginationParams(query);

      const where = hasFilters
        ? {
            AND: [...filters],
          }
        : { deletedAt: null };

      const [data, total] = await Promise.all([
        prisma.fileLibraryAsset.findMany({
          where,
          skip,
          take: perPage,
          orderBy,
        }),
        prisma.fileLibraryAsset.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'fileLibraryAsset', 'find');
      throw error;
    }
  }

  static async show(uuid: string) {
    try {
      const fileLibraryAsset = await prisma.fileLibraryAsset.findUnique({
        where: { uuid },
      });

      if (!fileLibraryAsset) {
        throw new NotFoundException('Dosya bulunamadı');
      }

      return fileLibraryAsset;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'fileLibraryAsset', 'find');
      throw error;
    }
  }

  static async store(data: FileLibraryAssetCreateInput) {
    try {
      const { file, type } = data;

      const validationRules = FILE_LIBRARY_ASSET_TYPE_RULES[type];

      const { allowedMimeTypes, maxSize } = validationRules.validationRules;
      const { pathPrefix, fileType } = validationRules;

      if (file.size > maxSize) {
        throw new Error('Dosya boyutu maksimum dosya boyutundan büyük olamaz.');
      }

      if (!allowedMimeTypes.includes(file.type)) {
        throw new Error('Desteklenmeyen dosya türü.');
      }

      const uploadDir = path.join(process.cwd(), 'public', 'storage', pathPrefix.join('/'));

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = file.name.split('.').pop();

      const timestamp = Date.now().toString();
      const randomPart1 = Math.random().toString(36).substring(2, 15);
      const randomPart2 = Math.random().toString(36).substring(2, 15);

      const uniqueFileName = `${timestamp}-${randomPart1}${randomPart2}.${fileExtension}`;

      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = await file.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(buffer));

      const relativePath = path.posix.join(pathPrefix.join('/'), uniqueFileName);

      const fileLibraryAsset = await prisma.fileLibraryAsset.create({
        data: {
          name: uniqueFileName,
          type,
          fileType,
          mimeType: normalizeMimeType(file.type),
          path: relativePath,
          size: file.size,
        },
      });

      return fileLibraryAsset;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'fileLibraryAsset', 'create');
      throw error;
    }
  }

  static async update(uuid: string, data: FileLibraryAssetUpdateInput) {
    try {
      const existingFileLibraryAsset = await prisma.fileLibraryAsset.findUnique({
        where: { uuid },
        select: {
          id: true,
        },
      });

      if (!existingFileLibraryAsset) {
        throw new NotFoundException('Kantin bulunamadı.');
      }

      const updates: Prisma.FileLibraryAssetUpdateInput = {
        name: data.name,
      };

      const fileLibraryAsset = await prisma.fileLibraryAsset.update({
        where: { uuid },
        data: updates,
      });

      return fileLibraryAsset;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'fileLibraryAsset', 'update');
      throw error;
    }
  }

  static async destroy(uuid: string) {
    try {
      const fileLibraryAsset = await prisma.fileLibraryAsset.findUnique({
        where: { uuid },
      });

      if (!fileLibraryAsset) {
        throw new NotFoundException('Dosya bulunamadı');
      }

      const filePath = path.join(process.cwd(), 'public', 'storage', fileLibraryAsset.path);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const deletedAsset = await prisma.fileLibraryAsset.delete({
        where: { uuid },
      });

      return deletedAsset;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'fileLibraryAsset', 'delete');
      throw error;
    }
  }
}

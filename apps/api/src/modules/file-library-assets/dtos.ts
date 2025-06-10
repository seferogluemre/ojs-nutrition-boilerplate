import { FileLibraryAssetType } from '#prisma/client';
import {
  FileLibraryAssetPlain,
  FileLibraryAssetPlainInputUpdate,
} from '#prismabox/FileLibraryAsset';
import { t } from 'elysia';

import { ControllerHook, errorResponseDto, prepareFilters, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

export const fileLibraryAssetResponseDto = t.Composite([
  t.Omit(FileLibraryAssetPlain, ['size']),
  t.Object({
    size: t.String(),
  }),
]);

export const [fileLibraryAssetFiltersDto, getFileLibraryAssetFilters] = prepareFilters(
  FileLibraryAssetPlain,
  {
    simple: ['name'],
    multipleOptions: ['mimeType'],
    date: ['createdAt', 'updatedAt', 'deletedAt'],
    search: ['name'],
  },
);

export const fileLibraryAssetIndexDto = {
  query: t.Partial(t.Composite([fileLibraryAssetFiltersDto, paginationQueryDto])),
  response: {
    200: paginationResponseDto(fileLibraryAssetResponseDto),
  },
  detail: {
    summary: 'Index',
    description: 'Dosyaların listesini döndürür',
  },
} satisfies ControllerHook;

export const fileLibraryAssetShowDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: { 200: fileLibraryAssetResponseDto, 404: errorResponseDto[404] },
  detail: {
    summary: 'Show',
    description: 'Dosya detaylarını döndürür',
  },
} satisfies ControllerHook;

export const fileLibraryAssetCreateInputDto = t.Object({
  file: t.File(),
  type: t.Enum(FileLibraryAssetType),
});

export const fileLibraryAssetCreateDto = {
  body: fileLibraryAssetCreateInputDto,
  response: { 200: fileLibraryAssetResponseDto, 422: errorResponseDto[422] },
  detail: {
    summary: 'Create',
    description: 'Yeni dosya oluşturur',
  },
} satisfies ControllerHook;

export const fileLibraryAssetUpdateInputDto = FileLibraryAssetPlainInputUpdate;

export const fileLibraryAssetUpdateDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  body: fileLibraryAssetUpdateInputDto,
  response: {
    200: fileLibraryAssetResponseDto,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update',
    description: 'Dosyayı günceller',
  },
} satisfies ControllerHook;

export const fileLibraryAssetDestroyDto = {
  ...fileLibraryAssetShowDto,
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Destroy',
    description: 'Dosyayı siler',
  },
} satisfies ControllerHook;

import { Static } from 'elysia';

import {
  fileLibraryAssetCreateInputDto,
  fileLibraryAssetIndexDto,
  fileLibraryAssetResponseDto,
  fileLibraryAssetShowDto,
  fileLibraryAssetUpdateInputDto,
} from './dtos';

export type FileLibraryAssetShowParams = Static<(typeof fileLibraryAssetShowDto)['params']>;
export type FileLibraryAssetShowResponse = Static<typeof fileLibraryAssetResponseDto>;
export type FileLibraryAssetDestroyParams = FileLibraryAssetShowParams;

export type FileLibraryAssetCreateInput = Static<typeof fileLibraryAssetCreateInputDto>;
export type FileLibraryAssetUpdateInput = Static<typeof fileLibraryAssetUpdateInputDto>;

export type FileLibraryAssetIndexQuery = Static<typeof fileLibraryAssetIndexDto.query>;

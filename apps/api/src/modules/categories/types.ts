import { Static } from 'elysia';
import { categoryCreateDto, categoryResponseDto, categoryShowDto, categoryUpdateDto } from './dtos';

export type CategoryCreatePayload = Static<(typeof categoryCreateDto)['body']>;
export type CategoryUpdatePayload = Static<(typeof categoryUpdateDto)['body']>;
export type CategoryShowParams = Static<(typeof categoryShowDto)['params']>;
export type CategoryShowResponse = Static<typeof categoryResponseDto>;
export type CategoryDestroyParams = CategoryShowParams; 
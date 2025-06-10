import { postCreateDto, postResponseDto, postShowDto, postUpdateDto } from './dtos';
import { Static } from 'elysia';

export type PostCreatePayload = Static<(typeof postCreateDto)['body']>;
export type PostUpdatePayload = Static<(typeof postUpdateDto)['body']>;
export type PostShowParams = Static<(typeof postShowDto)['params']>;
export type PostShowResponse = Static<typeof postResponseDto>;
export type PostDestroyParams = PostShowParams; 
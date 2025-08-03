import { userCreateDto, userCreateResponseDto, userIndexDto, userShowDto, userUpdateDto } from './dtos';
import { Static } from 'elysia';

export type UserShowResponse = Static<typeof userShowDto.response[200]>;

export type UserCreatePayload = Static<(typeof userCreateDto)['body']>;
export type UserCreateResponse = Static<typeof userCreateResponseDto>;

export type UserUpdatePayload = Static<(typeof userUpdateDto)['body']>;

export type UserShowParams = Static<(typeof userShowDto)['params']>;
export type UserShowQuery = Static<(typeof userShowDto)['query']>;
export type UserDestroyParams = UserShowParams;

export type RecordStatus = 'ACTIVE' | 'DELETED' | 'ALL';
export type Status = 'ACTIVE' | 'INACTIVE' | 'ALL';

export type UserIndexQuery = Static<(typeof userIndexDto)['query']>;
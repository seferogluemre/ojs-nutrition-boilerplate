import { Static } from 'elysia';
import { userAddressCreateDto, userAddressIndexDto, userAddressShowDto, userAddressUpdateDto } from './dtos';

export type UserAddressShowResponse = Static<typeof userAddressShowDto.response[200]>;

export type UserAddressCreatePayload = Static<(typeof userAddressCreateDto)['body']>;
export type UserAddressCreateResponse = Static<typeof userAddressCreateDto.response['200']>;

export type UserAddressUpdatePayload = Static<(typeof userAddressUpdateDto)['body']>;

export type UserAddressIndexQuery = Static<(typeof userAddressIndexDto)['query']>;

export type UserAddressShowParams = Static<(typeof userAddressShowDto)['params']>;
export type UserAddressDestroyParams = UserAddressShowParams;
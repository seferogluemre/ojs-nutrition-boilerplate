import { Static } from 'elysia';
import {
    customerAddressCreateDto,
    customerAddressIndexDto,
    customerAddressShowDto,
    customerAddressUpdateDto
} from './dtos';

export type CustomerAddressShowResponse = Static<typeof customerAddressShowDto.response[200]>;

export type CustomerAddressCreatePayload = Static<(typeof customerAddressCreateDto)['body']>;

export type CustomerAddressUpdatePayload = Static<(typeof customerAddressUpdateDto)['body']>;

export type CustomerAddressIndexQuery = Static<(typeof customerAddressIndexDto)['query']>;

export type CustomerAddressShowParams = Static<(typeof customerAddressShowDto)['params']>; 
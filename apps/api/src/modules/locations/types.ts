import { Static } from 'elysia';

import {
  cityResponseDto,
  cityShowDto,
  countryResponseDto,
  countryShowDto,
  regionResponseDto,
  regionShowDto,
  stateResponseDto,
  stateShowDto,
  subregionResponseDto,
  subregionShowDto,
} from './dtos';

// Country types
export type CountryShowParams = Static<(typeof countryShowDto)['params']>;
export type CountryShowResponse = Static<typeof countryResponseDto>;
export type CountryDestroyParams = CountryShowParams;

// State types
export type StateShowParams = Static<(typeof stateShowDto)['params']>;
export type StateShowResponse = Static<typeof stateResponseDto>;
export type StateDestroyParams = StateShowParams;

// City types
export type CityShowParams = Static<(typeof cityShowDto)['params']>;
export type CityShowResponse = Static<typeof cityResponseDto>;
export type CityDestroyParams = CityShowParams;

// Region types
export type RegionShowParams = Static<(typeof regionShowDto)['params']>;
export type RegionShowResponse = Static<typeof regionResponseDto>;
export type RegionDestroyParams = RegionShowParams;

// Subregion types
export type SubregionShowParams = Static<(typeof subregionShowDto)['params']>;
export type SubregionShowResponse = Static<typeof subregionResponseDto>;
export type SubregionDestroyParams = SubregionShowParams;

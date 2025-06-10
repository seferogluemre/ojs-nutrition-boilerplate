import { City, Country, Region, State, Subregion } from '#prisma/client';
import { BaseFormatter } from '#utils';

import {
  cityResponseDto,
  countryResponseDto,
  regionResponseDto,
  stateResponseDto,
  subregionResponseDto,
} from './dtos';
import {
  CityShowResponse,
  CountryShowResponse,
  RegionShowResponse,
  StateShowResponse,
  SubregionShowResponse,
} from './types';

export abstract class CountryFormatter {
  static response(data: Country) {
    const convertedData = BaseFormatter.convertData<CountryShowResponse>(
      {
        ...data,
        latitude: data.latitude !== null ? data.latitude.toString() : null,
        longitude: data.longitude !== null ? data.longitude.toString() : null,
      },
      countryResponseDto,
    );
    return convertedData;
  }
}

export abstract class StateFormatter {
  static response(data: State) {
    const convertedData = BaseFormatter.convertData<StateShowResponse>(
      {
        ...data,
        latitude: data.latitude !== null ? data.latitude.toString() : null,
        longitude: data.longitude !== null ? data.longitude.toString() : null,
      },
      stateResponseDto,
    );
    return convertedData;
  }
}

export abstract class CityFormatter {
  static response(data: City) {
    const convertedData = BaseFormatter.convertData<CityShowResponse>(
      {
        ...data,
        latitude: data.latitude !== null ? data.latitude.toString() : null,
        longitude: data.longitude !== null ? data.longitude.toString() : null,
      },
      cityResponseDto,
    );
    return convertedData;
  }
}

export abstract class RegionFormatter {
  static response(data: Region) {
    const convertedData = BaseFormatter.convertData<RegionShowResponse>(data, regionResponseDto);
    return convertedData;
  }
}

export abstract class SubregionFormatter {
  static response(data: Subregion) {
    const convertedData = BaseFormatter.convertData<SubregionShowResponse>(
      data,
      subregionResponseDto,
    );
    return convertedData;
  }
}

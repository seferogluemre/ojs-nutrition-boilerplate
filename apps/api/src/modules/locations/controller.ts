import { NotFoundException, PaginationService } from '#utils';
import { Elysia } from 'elysia';

import {
  cityIndexDto,
  cityShowDto,
  countryIndexDto,
  countryShowDto,
  regionIndexDto,
  regionShowDto,
  stateIndexDto,
  stateShowDto,
  subregionIndexDto,
  subregionShowDto,
} from './dtos';
import {
  CityFormatter,
  CountryFormatter,
  RegionFormatter,
  StateFormatter,
  SubregionFormatter,
} from './formatters';
import { LocationsService } from './service';

// Country Routes
const countryController = new Elysia({ prefix: '/countries', tags: ['Country'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await LocationsService.indexCountries(query);
      return PaginationService.createPaginatedResponse({
        data: data.map(CountryFormatter.response),
        total,
        query,
      });
    },
    countryIndexDto,
  )
  .get(
    '/:id',
    async ({ params }) => {
      const country = await LocationsService.showCountry(params.id);
      if (!country) throw new NotFoundException('Country not found');
      return CountryFormatter.response(country);
    },
    countryShowDto,
  );

// State Routes
const stateController = new Elysia({ prefix: '/states', tags: ['State'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await LocationsService.indexStates(query);

      return PaginationService.createPaginatedResponse({
        data: data.map(StateFormatter.response),
        total,
        query,
      });
    },
    stateIndexDto,
  )
  .get(
    '/:id',
    async ({ params }) => {
      const state = await LocationsService.showState(params.id);
      if (!state) throw new NotFoundException('State not found');
      return StateFormatter.response(state);
    },
    stateShowDto,
  );

// City Routes
const cityController = new Elysia({ prefix: '/cities', tags: ['City'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await LocationsService.indexCities(query);

      return PaginationService.createPaginatedResponse({
        data: data.map(CityFormatter.response),
        total,
        query,
      });
    },
    cityIndexDto,
  )
  .get(
    '/:id',
    async ({ params }) => {
      const city = await LocationsService.showCity(params.id);
      if (!city) throw new NotFoundException('City not found');
      return CityFormatter.response(city);
    },
    cityShowDto,
  );

// Region Routes
const regionController = new Elysia({ prefix: '/regions', tags: ['Region'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await LocationsService.indexRegions(query);

      return PaginationService.createPaginatedResponse({
        data: data.map(RegionFormatter.response),
        total,
        query,
      });
    },
    regionIndexDto,
  )
  .get(
    '/:id',
    async ({ params }) => {
      const region = await LocationsService.showRegion(params.id);
      if (!region) throw new NotFoundException('Region not found');
      return region;
    },
    regionShowDto,
  );

// Subregion Routes
const subregionController = new Elysia({ prefix: '/subregions', tags: ['Subregion'] })
  .get(
    '/',
    async ({ query }) => {
      const { data, total } = await LocationsService.indexSubregions(query);

      return PaginationService.createPaginatedResponse({
        data: data.map(SubregionFormatter.response),
        total,
        query,
      });
    },
    subregionIndexDto,
  )
  .get(
    '/:id',
    async ({ params }) => {
      const subregion = await LocationsService.showSubregion(params.id);
      if (!subregion) throw new NotFoundException('Subregion not found');
      return subregion;
    },
    subregionShowDto,
  );

// Main Locations Module
const app = new Elysia({ prefix: '/locations' })
  .use(countryController)
  .use(stateController)
  .use(cityController)
  .use(regionController)
  .use(subregionController);

export default app;

import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import { NotFoundException, PaginationQuery } from '#utils';
import { Prisma } from '@prisma/client';

export abstract class LocationsService {
  // Country Methods
  static async indexCountries(query: PaginationQuery & { search?: string }) {
    try {
      const { page = 1, perPage = 20, search } = query;
      const skip = (page - 1) * perPage;

      const where: any = search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {};

      const [data, total] = await Promise.all([
        prisma.country.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { name: 'asc' },
        }),
        prisma.country.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'country', 'find');
      throw error;
    }
  }

  static async showCountry(id: number) {
    try {
      const country = await prisma.country.findUnique({
        where: { id },
      });

      if (!country) {
        throw new NotFoundException('Country not found');
      }

      return country;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'country', 'find');
      throw error;
    }
  }

  // State Methods
  static async indexStates(query: PaginationQuery & { search?: string; countryId?: number }) {
    try {
      const { page = 1, perPage = 20, search, countryId } = query;
      const skip = (page - 1) * perPage;

      const where: any = {
        ...(search
          ? {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {}),
        ...(countryId ? { countryId } : {}),
      };

      const [data, total] = await Promise.all([
        prisma.state.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { name: 'asc' },
          include: {
            country: true,
          },
        }),
        prisma.state.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'state', 'find');
      throw error;
    }
  }

  static async showState(id: number) {
    try {
      const state = await prisma.state.findUnique({
        where: { id },
        include: {
          country: true,
        },
      });

      if (!state) {
        throw new NotFoundException('State not found');
      }

      return state;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'state', 'find');
      throw error;
    }
  }

  // City Methods
  static async indexCities(
    query: PaginationQuery & { search?: string; countryId?: number; stateId?: number },
  ) {
    try {
      const { page = 1, perPage = 20, search, countryId, stateId } = query;
      const skip = (page - 1) * perPage;

      const where: any = {
        ...(search
          ? {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {}),
        ...(countryId ? { countryId } : {}),
        ...(stateId ? { stateId } : {}),
      };

      const [data, total] = await Promise.all([
        prisma.city.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { name: 'asc' },
          include: {
            country: true,
            state: true,
          },
        }),
        prisma.city.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'city', 'find');
      throw error;
    }
  }

  static async showCity(id: number) {
    try {
      const city = await prisma.city.findUnique({
        where: { id },
        include: {
          country: true,
          state: true,
        },
      });

      if (!city) {
        throw new NotFoundException('City not found');
      }

      return city;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'region', 'find');
      throw error;
    }
  }

  // Region Methods
  static async indexRegions(query: PaginationQuery & { search?: string }) {
    try {
      const { page = 1, perPage = 20, search } = query;
      const skip = (page - 1) * perPage;

      const where: any = {
        ...(search
          ? {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {}),
      };

      const [data, total] = await Promise.all([
        prisma.region.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { name: 'asc' },
        }),
        prisma.region.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'region', 'find');
      throw error;
    }
  }

  static async showRegion(id: number) {
    try {
      const region = await prisma.region.findUnique({
        where: { id },
      });

      if (!region) {
        throw new NotFoundException('Region not found');
      }

      return region;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'subregion', 'find');
      throw error;
    }
  }

  // Subregion Methods
  static async indexSubregions(query: PaginationQuery & { search?: string; regionId?: number }) {
    try {
      const { page = 1, perPage = 20, search, regionId } = query;
      const skip = (page - 1) * perPage;

      const where: any = {
        ...(search
          ? {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {}),
        ...(regionId ? { regionId } : {}),
      };

      const [data, total] = await Promise.all([
        prisma.subregion.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { name: 'asc' },
        }),
        prisma.subregion.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'subregion', 'find');
      throw error;
    }
  }

  static async showSubregion(id: number) {
    try {
      const subregion = await prisma.subregion.findUnique({
        where: { id },
      });

      if (!subregion) {
        throw new NotFoundException('Subregion not found');
      }

      return subregion;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'subregion', 'find');
      throw error;
    }
  }
}

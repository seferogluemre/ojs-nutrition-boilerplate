import { prisma } from '#core';
import { Prisma, UserAddress } from '#prisma/index';
import { HandleError } from '#shared/error/handle-error';
import { InternalServerErrorException, NotFoundException } from '#utils';

import { getUserAddressFilters } from './dtos';
import { UserAddressCreatePayload, UserAddressIndexQuery, UserAddressUpdatePayload } from './types';


export abstract class UserAddressesService {
  static async index(query?: UserAddressIndexQuery): Promise<UserAddress[]> {
    try {
      const filterQuery = query
        ? {
            ...query,
            userId: query.userId === null ? undefined : query.userId,
          }
        : undefined;

      const [hasFilters, filters] = getUserAddressFilters(filterQuery);
      const where: Prisma.UserAddressWhereInput = {};

      if (hasFilters) {
        where.OR = filters;
      }

      return prisma.userAddress.findMany({
        where,
        include: {
          city: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'find');
      throw error;
    }
  }

  static async show(where: { id: number; userId?: string }) {
    try {
      const userAddress = await prisma.userAddress.findFirst({
        where: {
          id: where.id,
          ...(where.userId && { userId: where.userId }),
        },
        include: {
          city: true,
        },
      });

      if (!userAddress) {
        throw new NotFoundException('Kullanıcı adresi bulunamadı');
      }

      return userAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'find');
      throw error;
    }
  }

  static async store(payload: UserAddressCreatePayload & { userId: string }): Promise<UserAddress> {
    try {
      const userAddress = await prisma.userAddress.create({
        data: payload,
      });

      return userAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'create');
      throw error;
    }
  }

  static async update(id: string, payload: UserAddressUpdatePayload): Promise<UserAddress> {
    try {
      const userAddress = await prisma.userAddress.findUnique({
        where: {uuid: id },
      });

      if (!userAddress) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      const updatedUserAddress = await prisma.userAddress.update({
        where: { uuid: id },
        data: payload,
      });

      if (!updatedUserAddress) {
        throw new InternalServerErrorException('Bilinmeyen bir hata oluştu');
      }

      return updatedUserAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'update');
      throw error;
    }
  }

  static async destroy(id: string): Promise<void> {
    try {
      await prisma.userAddress.delete({
        where: { uuid: id },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'delete');
      throw error;
    }
  }

  static async restore(id: string) {
    try {
      const userAddress = await prisma.userAddress.findFirst({
        where: { uuid: id, deletedAt: { not: null } },
      });

      if (!userAddress) {
        throw new NotFoundException('Kullanıcı bulunamadı veya zaten aktif');
      }

      return await prisma.userAddress.update({
        where: { uuid: id },
        data: { deletedAt: null },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'update');
      throw error;
    }
  }
}

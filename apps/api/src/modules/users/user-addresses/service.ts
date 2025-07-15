import { prisma } from '#core';
import { UserAddress } from '#prisma/index';
import { HandleError } from '#shared/error/handle-error';
import { InternalServerErrorException, NotFoundException } from '#utils';
import { Prisma } from '@prisma/client';

import { getUserAddressFilters } from './dtos';
import { UserAddressCreatePayload, UserAddressIndexQuery, UserAddressUpdatePayload } from './types';


export abstract class UserAddressesService {
  private static async prepareUserAddressPayload(
    payloadRaw: UserAddressUpdatePayload,
  ): Promise<UserAddressUpdatePayload> {
    const {
      title,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      isDefault,
      cityId,
    } = payloadRaw;

    const userAddressPayload = {
      title,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      isDefault,
      cityId,
    };

    return Object.fromEntries(
      Object.entries(userAddressPayload).filter(([_, value]) => value !== undefined),
    ) as UserAddressUpdatePayload;
  }

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
      const userAddressPayload = await this.prepareUserAddressPayload(payload);

      const userAddress = await prisma.userAddress.create({
        data: userAddressPayload,
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
        where: { id },
      });

      if (!userAddress) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      const userAddressPayload = await this.prepareUserAddressPayload(payload);

      const updates: Prisma.UserAddressUpdateInput = { ...userAddressPayload };

      const updatedUserAddress = await prisma.userAddress.update({
        where: { id },
        data: updates,
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
        where: { id },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'delete');
      throw error;
    }
  }

  static async restore(id: string) {
    try {
      const userAddress = await prisma.userAddress.findFirst({
        where: { id, deletedAt: { not: null } },
      });

      if (!userAddress) {
        throw new NotFoundException('Kullanıcı bulunamadı veya zaten aktif');
      }

      return await prisma.userAddress.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'userAddress', 'update');
      throw error;
    }
  }
}

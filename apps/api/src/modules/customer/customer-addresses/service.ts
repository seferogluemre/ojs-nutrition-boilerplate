import { prisma } from '#core';
import { CustomerAddress } from '#prisma/client';
import { HandleError } from '#shared/error/handle-error';
import { InternalServerErrorException, NotFoundException } from '#utils';
import { Prisma } from '@prisma/client';

import { getCustomerAddressFilters } from './dtos';
import { CustomerAddressCreatePayload, CustomerAddressIndexQuery, CustomerAddressUpdatePayload } from './types';

export abstract class CustomerAddressesService {
  private static async prepareCustomerAddressPayload(
    payloadRaw: CustomerAddressUpdatePayload,
  ): Promise<CustomerAddressUpdatePayload> {
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

    const customerAddressPayload = {
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
      Object.entries(customerAddressPayload).filter(([_, value]) => value !== undefined),
    ) as CustomerAddressUpdatePayload;
  }

  static async index(query?: CustomerAddressIndexQuery): Promise<CustomerAddress[]> {
    try {
      const filterQuery = query
        ? {
            ...query,
            customerId: query.customerId === null ? undefined : query.customerId,
          }
        : undefined;

      const [hasFilters, filters] = getCustomerAddressFilters(filterQuery);
      const where: any = {};

      if (hasFilters) {
        where.OR = filters;
      }

      return prisma.customerAddress.findMany({
        where,
        include: {
          city: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'find');
      throw error;
    }
  }

  static async show(where: { id: number; customerId?: number }) {
    try {
      const customerAddress = await prisma.customerAddress.findFirst({
        where: {
          id: where.id,
          ...(where.customerId && { customerId: where.customerId }),
        },
        include: {
          city: true,
        },
      });

      if (!customerAddress) {
        throw new NotFoundException('Müşteri adresi bulunamadı');
      }

      return customerAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'find');
      throw error;
    }
  }

  static async store(payload: CustomerAddressCreatePayload & { customerId: number }): Promise<CustomerAddress> {
    try {
      const customerAddressPayload = await this.prepareCustomerAddressPayload(payload);

      // Eğer isDefault true ise, diğer adreslerin isDefault'unu false yap
      if (payload.isDefault) {
        await prisma.customerAddress.updateMany({
          where: { customerId: payload.customerId },
          data: { isDefault: false },
        });
      }

      const customerAddress = await prisma.customerAddress.create({
        data: customerAddressPayload,
        include: {
          city: true,
        },
      });

      return customerAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'create');
      throw error;
    }
  }

  static async update(id: string, payload: CustomerAddressUpdatePayload): Promise<CustomerAddress> {
    try {
      const customerAddress = await prisma.customerAddress.findUnique({
        where: { uuid: id },
      });

      if (!customerAddress) {
        throw new NotFoundException('Müşteri adresi bulunamadı');
      }

      const customerAddressPayload = await this.prepareCustomerAddressPayload(payload);

      if (payload.isDefault) {
        await prisma.customerAddress.updateMany({
          where: { 
            customerId: customerAddress.customerId,
            uuid: { not: id }, // Bu adres hariç
          },
          data: { isDefault: false },
        });
      }

      const updates: Prisma.CustomerAddressUpdateInput = { ...customerAddressPayload };

      const updatedCustomerAddress = await prisma.customerAddress.update({
        where: { uuid: id },
        data: updates,
        include: {
          city: true,
        },
      });

      if (!updatedCustomerAddress) {
        throw new InternalServerErrorException('Bilinmeyen bir hata oluştu');
      }

      return updatedCustomerAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'update');
      throw error;
    }
  }

  static async destroy(id: string): Promise<void> {
    try {
      await prisma.customerAddress.delete({
        where: { uuid: id },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'delete');
      throw error;
    }
  }

  static async setDefault(id: string, customerId: number): Promise<CustomerAddress> {
    try {
      // Önce tüm adreslerin isDefault'unu false yap
      await prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });

      // Seçilen adresi default yap
      const updatedAddress = await prisma.customerAddress.update({
        where: { uuid: id },
        data: { isDefault: true },
        include: {
          city: true,
        },
      });

      return updatedAddress;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customerAddress', 'update');
      throw error;
    }
  }
} 
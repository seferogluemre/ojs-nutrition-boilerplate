import { prisma } from '#core';
import { OrderStatus } from '#prisma/client';
import { ForbiddenException } from '../../../utils';
import type { AuthContext } from '../../auth/authentication/types';

export function withProductPurchaseCheck() {
  return {
    beforeHandle: async ({ user, params, set }: AuthContext & { params: { id: string } }) => {
      const productId = params.id;

      const deliveredOrder = await prisma.order.findFirst({
        where: {
          userId: user.id,
          status: OrderStatus.DELIVERED,
          items: {
            some: {
              product: {
                uuid: productId,
              },
            },
          },
        },
        include: {
          items: {
            where: {
              product: {
                uuid: productId,
              },
            },
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!deliveredOrder) {
        const exception = new ForbiddenException(
          'Bu ürünü değerlendirmek için önce satın almalı ve teslim almış olmalısınız.'
        );
        set.status = exception.statusCode;
        set.headers = {
          'Content-Type': 'application/json',
        };

        return exception;
      }

      const existingComment = await prisma.productComments.findFirst({
        where: {
          userId: user.id,
          product: {
            uuid: productId,
          },
        },
      });

      if (existingComment) {
        const exception = new ForbiddenException(
          'Bu ürün için daha önce yorum yapmışsınız. Her ürün için sadece bir yorum yapabilirsiniz.'
        );
        set.status = exception.statusCode;
        set.headers = {
          'Content-Type': 'application/json',
        };

        return exception;
      }

      return;
    },
  };
}

export async function checkUserCanReviewProduct(userId: string, productUuid: string): Promise<{
  canReview: boolean;
  reason?: string;
}> {
  console.log('checkUserCanReviewProduct - userId:', userId);
  console.log('checkUserCanReviewProduct - productUuid:', productUuid);
  
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: OrderStatus.DELIVERED,
      items: {
        some: {
          product: {
            uuid: productUuid,
          },
        },
      },
    },
  });
  
  console.log('checkUserCanReviewProduct - deliveredOrder:', deliveredOrder ? 'Found' : 'Not found');
  
  const allOrders = await prisma.order.findMany({
    where: { userId },
    select: { uuid: true, status: true, items: { select: { product: { select: { name: true, uuid: true } } } } }
  });
  console.log('checkUserCanReviewProduct - allOrders:', JSON.stringify(allOrders, null, 2));

  if (!deliveredOrder) {
    return {
      canReview: false,
      reason: 'Bu ürünü değerlendirmek için önce satın almalı ve teslim almış olmalısınız.',
    };
  }

  const existingComment = await prisma.productComments.findFirst({
    where: {
      userId,
      product: {
        uuid: productUuid,
      },
    },
  });

  if (existingComment) {
    return {
      canReview: false,
      reason: 'Bu ürün için daha önce yorum yapmışsınız.',
    };
  }

  return {
    canReview: true,
  };
}
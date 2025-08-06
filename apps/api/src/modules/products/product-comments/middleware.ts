import { prisma } from '#core';
import { OrderStatus } from '#prisma/client';
import { ForbiddenException } from '../../../utils';
import type { AuthContext } from '../../auth/authentication/types';

/**
 * Kullanıcının ürünü sipariş etmiş ve teslim almış olduğunu kontrol eder
 * Sadece DELIVERED siparişi olan kullanıcılar yorum yapabilir
 */
export function withProductPurchaseCheck() {
  return {
    beforeHandle: async ({ user, params, set }: AuthContext & { params: { id: string } }) => {
      const productId = params.id;

      // Kullanıcının bu ürünü sipariş etmiş ve teslim almış olduğunu kontrol et
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

      // Kullanıcının daha önce bu ürün için yorum yapıp yapmadığını kontrol et
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

/**
 * Kullanıcının ürünü sipariş edip etmediğini kontrol eder (yorum yapma eligibility)
 * Frontend'de buton gösterimi için kullanılır
 */
export async function checkUserCanReviewProduct(userId: string, productUuid: string): Promise<{
  canReview: boolean;
  reason?: string;
}> {
  // Kullanıcının bu ürünü sipariş etmiş ve teslim almış olduğunu kontrol et
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

  if (!deliveredOrder) {
    return {
      canReview: false,
      reason: 'Bu ürünü değerlendirmek için önce satın almalı ve teslim almış olmalısınız.',
    };
  }

  // Kullanıcının daha önce bu ürün için yorum yapıp yapmadığını kontrol et
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
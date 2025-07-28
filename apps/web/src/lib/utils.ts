import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fiyatı Türkiye formatında formatlar (2.890,00 TL)
 */
export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return '0,00 TL';
  
  return numericPrice.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' TL';
}

/**
 * Sipariş durumunu İngilizce'den Türkçe'ye çevirir ve renk kodunu döner
 */
export function getOrderStatus(status: string): { text: string; colorClass: string } {
  const statusMap: Record<string, { text: string; colorClass: string }> = {
    PENDING: {
      text: 'Sipariş Alındı',
      colorClass: 'text-gray-700 bg-gray-100 border border-gray-200'
    },
    CONFIRMED: {
      text: 'Sipariş Onaylandı', 
      colorClass: 'text-blue-700 bg-blue-100 border border-blue-200'
    },
    PREPARING: {
      text: 'Hazırlanıyor',
      colorClass: 'text-orange-700 bg-orange-100 border border-orange-200'
    },
    PROCESSING: {
      text: 'Hazırlanıyor',
      colorClass: 'text-orange-700 bg-orange-100 border border-orange-200'
    },
    SHIPPED: {
      text: 'Kargoya Verildi',
      colorClass: 'text-blue-700 bg-blue-100 border border-blue-200'
    },
    DELIVERED: {
      text: 'Teslim Edildi',
      colorClass: 'text-green-700 bg-green-100 border border-green-200'
    },
    CANCELLED: {
      text: 'İptal Edildi',
      colorClass: 'text-red-700 bg-red-100 border border-red-200'
    },
    RETURNED: {
      text: 'İade Edildi', 
      colorClass: 'text-purple-700 bg-purple-100 border border-purple-200'
    }
  };

  return statusMap[status.toUpperCase()] || {
    text: status,
    colorClass: 'text-gray-700 bg-gray-100 border border-gray-200'
  };
}

import { Badge } from "#components/ui/badge"
import type { OrderStatus } from "../types/types"

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusConfig = {
  PENDING: {
    label: "Beklemede",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  PROCESSING: {
    label: "İşleniyor",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  SHIPPED: {
    label: "Kargoda",
    variant: "default" as const,
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  DELIVERED: {
    label: "Teslim Edildi",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  CANCELLED: {
    label: "İptal Edildi",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  REFUNDED: {
    label: "İade Edildi",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
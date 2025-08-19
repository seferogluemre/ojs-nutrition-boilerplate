import { Badge } from "#components/ui/badge"
import type { Parcel } from "../types/parcel-types"

interface ParcelStatusBadgeProps {
  status: Parcel["status"]
}

export function ParcelStatusBadge({ status }: ParcelStatusBadgeProps) {
  const getStatusConfig = (status: Parcel["status"]) => {
    switch (status) {
      case "DELIVERED":
        return {
          label: "Teslim Edildi",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "IN_TRANSIT":
        return {
          label: "Yolda",
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        }
      case "PENDING":
        return {
          label: "Beklemede",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        }
      case "PROCESSING":
        return {
          label: "İşleniyor",
          variant: "default" as const,
          className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        }
      case "CANCELLED":
        return {
          label: "İptal Edildi",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-100",
        }
      case "RETURNED":
        return {
          label: "İade Edildi",
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        }
      default:
        return {
          label: status,
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

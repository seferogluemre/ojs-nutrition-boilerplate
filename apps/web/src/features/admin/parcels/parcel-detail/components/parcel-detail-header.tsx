"use client"

import { Button } from "#components/ui/button"
import { ArrowLeft, Clock, MapPin, Package } from "lucide-react"
import { ParcelStatusBadge } from "../../components/parcel-status-badge"
import type { ParcelDetail } from "../types/types"

interface ParcelDetailHeaderProps {
  parcel: ParcelDetail
  onBack: () => void
}

export function ParcelDetailHeader({ parcel, onBack }: ParcelDetailHeaderProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
      </div>

      <div className="border-b pb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Kargo Detayı</h1>
            </div>
            <p className="text-lg font-mono text-muted-foreground">{parcel.trackingNumber}</p>
          </div>
          <ParcelStatusBadge status={parcel.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tahmini Teslimat</p>
              <p className="font-medium">{new Date(parcel.estimatedDelivery).toLocaleDateString("tr-TR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rota</p>
              <p className="font-medium">
                {parcel.route.fromCity} → {parcel.route.toCity}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kurye</p>
            <p className="font-medium">
              {parcel.courier.firstName} {parcel.courier.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

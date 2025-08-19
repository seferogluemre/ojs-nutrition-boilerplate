import { MapPin, Package, Phone, User } from "lucide-react"
import type { ParcelDetail } from "../types/types"

interface ParcelShippingInfoProps {
  parcel: ParcelDetail
}

export function ParcelShippingInfo({ parcel }: ParcelShippingInfoProps) {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border-b pb-6">
      <div>
        <div className="mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Teslimat Adresi
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{parcel.shippingAddress.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{parcel.shippingAddress.phone}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{parcel.shippingAddress.address}</p>
            <p>
              {parcel.shippingAddress.district}, {parcel.shippingAddress.city}
            </p>
            <p>Posta Kodu: {parcel.shippingAddress.postalCode}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Kargo Bilgileri
          </h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ağırlık</p>
              <p className="font-medium">{parcel.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sipariş ID</p>
              <p className="font-mono text-sm">{parcel.orderId}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Boyutlar (cm)</p>
            <p className="font-medium">
              {parcel.dimensions.length} × {parcel.dimensions.width} × {parcel.dimensions.height}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mesafe</p>
              <p className="font-medium">{parcel.route.distance} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tahmini Süre</p>
              <p className="font-medium">{parcel.route.estimatedDuration} saat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

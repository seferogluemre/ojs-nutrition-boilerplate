"use client"
import { useRouter } from "@tanstack/react-router"
import { ParcelDetailHeader } from "./components/parcel-detail-header"
import { ParcelEventsTimeline } from "./components/parcel-events-timeline"
import { ParcelShippingInfo } from "./components/parcel-shipping-info"
import { mockParcelDetail } from "./data/data"

interface ParcelDetailPageProps {
  params: {
    parcelId: string
  }
}

export  function ParcelDetail({ params }: ParcelDetailPageProps) {
  const router = useRouter()

  const parcel = mockParcelDetail

  const handleBack = () => {
    router.navigate({ to: "/admin/parcels" })
  }

  return (
    <div className="space-y-4">
      <ParcelDetailHeader parcel={parcel} onBack={handleBack} />
      <ParcelShippingInfo parcel={parcel} />
      <ParcelEventsTimeline events={parcel.events} />
    </div>
  )
}

import { ParcelDetail } from '#features/admin/parcels/parcel-detail/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/parcels/$parcelId')({
  component: ParcelDetail,
})
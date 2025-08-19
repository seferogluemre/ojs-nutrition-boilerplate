import { ParcelEvents } from '#features/admin/parcels/parcel-events/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/parcels/parcel-events/')({
  component: ParcelEvents,
})

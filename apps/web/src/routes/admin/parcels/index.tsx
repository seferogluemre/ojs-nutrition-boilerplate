import { Parcels } from '#features/admin/parcels/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/parcels/')({
  component: Parcels,
})
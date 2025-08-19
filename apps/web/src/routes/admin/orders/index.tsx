import { Orders } from '#features/admin/orders/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders/')({
  component: Orders,
})

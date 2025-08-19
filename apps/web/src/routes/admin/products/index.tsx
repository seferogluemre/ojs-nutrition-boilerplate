import { AdminProducts } from '#features/admin/products/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/')({
  component: AdminProducts,
})
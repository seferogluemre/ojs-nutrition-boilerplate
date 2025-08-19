import { ProductComments } from '#features/admin/products/product-comments/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/product-comments/')({
  component: ProductComments,
})
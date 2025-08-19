import { ProductVariants } from '#features/admin/products/product-variants/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/product-variants/')({
  component: ProductVariants,
})
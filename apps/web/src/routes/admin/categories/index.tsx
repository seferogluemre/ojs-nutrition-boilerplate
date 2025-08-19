import { Categories } from '#features/admin/categories/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categories/')({
  component: Categories,
})
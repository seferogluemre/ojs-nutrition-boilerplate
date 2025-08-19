import { Dashboard } from '#features/admin/dashboard/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard/')({
  component: Dashboard,
})
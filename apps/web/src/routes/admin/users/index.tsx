import { Users } from '#features/admin/users/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/')({
  component: Users,
})
import SSSPage from '#features/sss'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/sss/')({
  component: SSSPage,
}) 
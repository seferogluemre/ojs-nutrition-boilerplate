import SSSPage from '#features/sss'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sss/')({
  component: SSSPage,
}) 
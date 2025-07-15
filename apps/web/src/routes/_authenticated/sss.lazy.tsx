import SSSPage from '#features/sss'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/sss')({
  component: SSSPage,
}) 
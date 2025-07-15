import About from '#features/about'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/about/')({
  component: About,
}) 
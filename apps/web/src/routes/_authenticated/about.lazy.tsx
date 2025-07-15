import About from '#features/about'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/about')({
  component: About,
}) 
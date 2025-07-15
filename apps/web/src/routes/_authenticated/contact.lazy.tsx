import Contact from '#features/contact/index.js'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/contact')({
  component: Contact,
}) 
import Contact from '#features/contact'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/contact/')({
  component: Contact,
}) 
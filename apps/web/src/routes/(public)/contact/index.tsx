import Contact from '#features/contact'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/contact/')({
  component: Contact,
}) 
import { Account } from '#features/account/index.js'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(public)/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Account />
}
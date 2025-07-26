import { Account } from '#features/account/index.js'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Account />
}
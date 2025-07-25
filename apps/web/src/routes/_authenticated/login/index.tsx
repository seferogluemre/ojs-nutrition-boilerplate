import Login from '#features/login/index.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />
}

import PaymentPage from '#features/payment/index.js'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/payment/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PaymentPage />
}
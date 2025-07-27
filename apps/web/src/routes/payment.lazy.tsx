import PaymentPage from '#features/payment/index.js'
import { useAuthStore } from '#stores/authStore.js'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  useEffect(() => {
    if (!auth.accessToken || !auth.user) {
      navigate({
        to: '/login',
        search: {
          redirect: '/payment'
        }
      })
    }
  }, [auth.accessToken, auth.user, navigate])

  if (!auth.accessToken || !auth.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return <PaymentPage />
} 
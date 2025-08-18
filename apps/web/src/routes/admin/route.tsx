import { AuthenticatedLayout } from '#components/layout/admin-panel-layout.js'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.auth.user) {
      throw redirect({ to: "/sign-in" });
    }
  }
})

function RouteComponent() {
  return <>
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  </>
}

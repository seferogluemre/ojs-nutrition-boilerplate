import { AuthenticatedLayout } from '#components/layout/admin-panel-layout.js';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  // Şuanlık paneli görebilmek adına sayfalara direk giriş yapabilmek için auth kontrolünü yorum satırına aldım
  // beforeLoad: async ({ context }) => {
  //   if (!context.auth.auth.user) {
  //     throw redirect({ to: "/sign-in" });
  //   }
  // }
})

function RouteComponent() {
  return <>
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  </>
}

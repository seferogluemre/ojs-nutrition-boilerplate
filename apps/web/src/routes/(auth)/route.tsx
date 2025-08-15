import AuthLayout from "#components/layout/auth-layout";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async ({ context }) => {
    const { auth } = context;

    if (auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: () => {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  },
});

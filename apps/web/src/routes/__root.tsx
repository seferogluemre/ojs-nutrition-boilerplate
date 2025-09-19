import { Toaster } from "#components/ui/toaster";
import GeneralError from "#features/errors/general-error";
import NotFoundError from "#features/errors/not-found-error";
import { api } from "#lib/api.js";
import { AuthState, useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthState;
}>()({
  component: () => {
    const auth = useAuthStore();
    const { setItems, clearCart } = useCartStore();

    const { data: authData } = useQuery({
      queryKey: ["auth-me"],
      queryFn: async () => {
        if (!auth.accessToken) return null;

        const response = await (api as any).auth.me.get();
        return response.data;
      },
      enabled: !!auth?.accessToken && auth.isHydrated,
      retry: false,
    });

    const { data: cartData } = useQuery({
      queryKey: ["cart-items"],
      queryFn: async () => {
        if (!auth.accessToken) return { items: [] };

        const response = await (api as any)["cart-items"].get();
        return response.data;
      },
      enabled: !!auth?.accessToken && auth.isHydrated,
    });
    
    useEffect(() => {
      if (authData) {
        // Transform the /auth/me response to match the login response structure
        const transformedUser = {
          ...authData,
          name: authData.name || `${authData.firstName || ''} ${authData.lastName || ''}`.trim(),
        };
        auth.setUser(transformedUser);
      } else if (auth.accessToken && authData === null && auth.isHydrated) {
        // Only reset if hydration is complete and we have a token but no user data
        auth.reset();
        clearCart();
      }
    }, [authData, auth.accessToken, auth.isHydrated]);
    
    useEffect(() => {
      if (cartData?.items) {
        setItems(cartData.items);
      } else if (!auth.accessToken) {
        clearCart();
      }
    }, [cartData, auth.accessToken, setItems, clearCart]);
    
    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.MODE === "development" && (
          <>
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
import { Toaster } from "#components/ui/toaster";
import GeneralError from "#features/errors/general-error";
import NotFoundError from "#features/errors/not-found-error";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    const { auth } = useAuthStore();
    const { setItems, clearCart } = useCartStore();

    const { data: authData } = useQuery({
      queryKey: ["auth-me"],
      queryFn: async () => {
        if (!auth.accessToken) return null;

        const response = await api.auth.me.get({
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        });
        return response.data;
      },
      enabled: !!auth.accessToken,
      retry: false,
    });

    const { data: cartData } = useQuery({
      queryKey: ["cart-items"],
      queryFn: async () => {
        if (!auth.accessToken) return { items: [] };

        const response = await api["cart-items"].get({
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        });
        return response.data;
      },
      enabled: !!auth.accessToken,
    });
    useEffect(() => {
      if (authData) {
        auth.setUser(authData);
      } else if (auth.accessToken && authData === null) {
        auth.reset();
        clearCart();
      }
    }, [authData, auth.accessToken]);
    
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
import { Toaster } from "#components/ui/toaster";
import GeneralError from "#features/errors/general-error";
import NotFoundError from "#features/errors/not-found-error";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    const { auth } = useAuthStore();
    const { fetchCartItems } = useCartStore();
    
    useEffect(() => {
      auth.checkAuth(); 
      if(auth.accessToken){
        fetchCartItems();
      }
    }, [auth.accessToken]);
    
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

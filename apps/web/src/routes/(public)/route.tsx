import { LayoutWithNav } from "#components/layout/layout-with-nav";
import { SearchProvider } from "#context/search-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SearchProvider>
      <LayoutWithNav>
        <Outlet />
      </LayoutWithNav>
    </SearchProvider>
  );
}

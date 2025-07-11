import { SearchProvider } from "#context/search-context";
import { cn } from "#lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
// import { SidebarProvider } from "#components/ui/sidebar";
// import { AppSidebar } from "#components/layout/app-sidebar";
import SkipToMain from "#components/skip-to-main";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  // const defaultOpen = Cookies.get("sidebar:state") !== "false";
  return (
    <SearchProvider>
      {/* SidebarProvider ve AppSidebar geçici olarak gizlendi */}
      {/* <SidebarProvider defaultOpen={defaultOpen}> */}
        <SkipToMain />
        {/* <AppSidebar /> */}
        <div
          id="content"
          className={cn(
            // Sidebar CSS'lerini kaldırdık, şimdi tam genişlik kullanacak
            "w-full max-w-full",
            // "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            // "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            // "transition-[width] duration-200 ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh",
          )}
        >
          <Outlet />
        </div>
      {/* </SidebarProvider> */}
    </SearchProvider>
  );
}
